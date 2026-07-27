"""
CipherPulse — Analytical Dashboard (Plotly Dash)
Leadership-level KPIs, risk trends, category breakdowns, and team analysis.

Run: python dashboard/app.py
Accessible at: http://localhost:8050
"""

import dash
from dash import dcc, html, dash_table
from dash.dependencies import Input, Output
import plotly.express as px
import plotly.graph_objects as go

from dashboard.queries import (
    alerts_over_time,
    alerts_by_category,
    top_teams_by_risk,
    top_senders_by_risk,
    risk_distribution,
    review_stats,
    summary_kpis,
)

# ─── Theme colors ───────────────────────────────────────────────────────────
DARK_BG = "#0a0e1a"
CARD_BG = "#111827"
ACCENT_CYAN = "#06b6d4"
ACCENT_PURPLE = "#8b5cf6"
ACCENT_RED = "#ef4444"
ACCENT_GREEN = "#10b981"
ACCENT_AMBER = "#f59e0b"
TEXT_PRIMARY = "#f1f5f9"
TEXT_SECONDARY = "#94a3b8"
BORDER = "#1e293b"

app = dash.Dash(
    __name__,
    title="CipherPulse Analytics",
    meta_tags=[{"name": "viewport", "content": "width=device-width, initial-scale=1"}],
)

# ─── Styles ─────────────────────────────────────────────────────────────────

card_style = {
    "backgroundColor": CARD_BG,
    "borderRadius": "12px",
    "padding": "24px",
    "border": f"1px solid {BORDER}",
    "boxShadow": "0 4px 24px rgba(0,0,0,0.3)",
}

kpi_card_style = {
    **card_style,
    "textAlign": "center",
    "minWidth": "180px",
    "flex": "1",
}

plot_config = {"displayModeBar": False}

CHART_TEMPLATE = go.layout.Template(
    layout=go.Layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Inter, sans-serif", color=TEXT_PRIMARY, size=13),
        xaxis=dict(gridcolor="#1e293b", zerolinecolor="#1e293b"),
        yaxis=dict(gridcolor="#1e293b", zerolinecolor="#1e293b"),
        margin=dict(l=40, r=20, t=40, b=40),
    )
)


def make_kpi_card(title: str, value, color: str = ACCENT_CYAN):
    return html.Div(style=kpi_card_style, children=[
        html.P(title, style={"color": TEXT_SECONDARY, "fontSize": "13px", "margin": "0 0 8px 0", "textTransform": "uppercase", "letterSpacing": "1px"}),
        html.H2(str(value), style={"color": color, "margin": "0", "fontSize": "32px", "fontWeight": "700"}),
    ])


# ─── Layout ─────────────────────────────────────────────────────────────────

app.layout = html.Div(
    style={
        "backgroundColor": DARK_BG,
        "minHeight": "100vh",
        "padding": "32px",
        "fontFamily": "'Inter', 'Segoe UI', sans-serif",
        "color": TEXT_PRIMARY,
    },
    children=[
        # Header
        html.Div(style={"display": "flex", "justifyContent": "space-between", "alignItems": "center", "marginBottom": "32px"}, children=[
            html.Div(children=[
                html.H1("CipherPulse", style={"margin": "0", "fontSize": "28px", "fontWeight": "800", "background": f"linear-gradient(135deg, {ACCENT_CYAN}, {ACCENT_PURPLE})", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent"}),
                html.P("Compliance Analytics Dashboard", style={"color": TEXT_SECONDARY, "margin": "4px 0 0 0", "fontSize": "14px"}),
            ]),
            html.Div(children=[
                html.Button("⟳ Refresh", id="refresh-btn", n_clicks=0, style={
                    "backgroundColor": ACCENT_CYAN,
                    "color": DARK_BG,
                    "border": "none",
                    "borderRadius": "8px",
                    "padding": "10px 20px",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "fontSize": "14px",
                }),
            ]),
        ]),

        # KPI cards
        html.Div(id="kpi-row", style={"display": "flex", "gap": "16px", "marginBottom": "32px", "flexWrap": "wrap"}),

        # Charts row 1
        html.Div(style={"display": "grid", "gridTemplateColumns": "2fr 1fr", "gap": "24px", "marginBottom": "24px"}, children=[
            html.Div(style=card_style, children=[
                html.H3("Alerts Over Time", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                dcc.Graph(id="alerts-time-chart", config=plot_config),
            ]),
            html.Div(style=card_style, children=[
                html.H3("Risk Distribution", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                dcc.Graph(id="risk-dist-chart", config=plot_config),
            ]),
        ]),

        # Charts row 2
        html.Div(style={"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "24px", "marginBottom": "24px"}, children=[
            html.Div(style=card_style, children=[
                html.H3("Alerts by Category", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                dcc.Graph(id="category-chart", config=plot_config),
            ]),
            html.Div(style=card_style, children=[
                html.H3("Top Teams by Risk", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                dcc.Graph(id="teams-chart", config=plot_config),
            ]),
        ]),

        # Charts row 3
        html.Div(style={"display": "grid", "gridTemplateColumns": "1fr 1fr", "gap": "24px", "marginBottom": "24px"}, children=[
            html.Div(style=card_style, children=[
                html.H3("Top Flagged Senders", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                html.Div(id="senders-table"),
            ]),
            html.Div(style=card_style, children=[
                html.H3("Review Feedback", style={"margin": "0 0 16px 0", "color": TEXT_PRIMARY, "fontSize": "16px"}),
                dcc.Graph(id="review-chart", config=plot_config),
            ]),
        ]),

        # Auto-refresh interval (every 30s)
        dcc.Interval(id="auto-refresh", interval=30_000, n_intervals=0),
    ],
)


# ─── Callbacks ──────────────────────────────────────────────────────────────

@app.callback(
    [
        Output("kpi-row", "children"),
        Output("alerts-time-chart", "figure"),
        Output("risk-dist-chart", "figure"),
        Output("category-chart", "figure"),
        Output("teams-chart", "figure"),
        Output("senders-table", "children"),
        Output("review-chart", "figure"),
    ],
    [
        Input("refresh-btn", "n_clicks"),
        Input("auto-refresh", "n_intervals"),
    ],
)
def update_dashboard(n_clicks, n_intervals):
    # KPIs
    kpis = summary_kpis()
    kpi_cards = [
        make_kpi_card("Total Messages", f"{kpis['total_messages']:,}", ACCENT_CYAN),
        make_kpi_card("Alerts (≥60)", f"{kpis['total_alerts']:,}", ACCENT_AMBER),
        make_kpi_card("Critical (≥80)", f"{kpis['critical_alerts']:,}", ACCENT_RED),
        make_kpi_card("Reviewed", f"{kpis['reviewed']:,}", ACCENT_PURPLE),
        make_kpi_card("FP Rate", f"{kpis['fp_rate']}%", ACCENT_GREEN),
    ]

    # Alerts over time
    df_time = alerts_over_time()
    if not df_time.empty:
        fig_time = px.area(df_time, x="day", y="alert_count",
                           template=CHART_TEMPLATE, color_discrete_sequence=[ACCENT_CYAN])
        fig_time.update_traces(fill="tozeroy", fillcolor="rgba(6,182,212,0.15)")
    else:
        fig_time = go.Figure(layout=dict(template=CHART_TEMPLATE, annotations=[dict(text="No data", showarrow=False, font=dict(size=16, color=TEXT_SECONDARY))]))
    fig_time.update_layout(xaxis_title="", yaxis_title="Alerts", height=300)

    # Risk distribution
    df_dist = risk_distribution()
    if not df_dist.empty:
        colors = [ACCENT_GREEN, ACCENT_CYAN, ACCENT_AMBER, ACCENT_RED, "#dc2626"]
        fig_dist = go.Figure(data=[go.Bar(
            x=df_dist["risk_bucket"], y=df_dist["count"],
            marker_color=colors[:len(df_dist)],
        )])
        fig_dist.update_layout(template=CHART_TEMPLATE, height=300, xaxis_title="", yaxis_title="Count")
    else:
        fig_dist = go.Figure(layout=dict(template=CHART_TEMPLATE, height=300))

    # Category
    df_cat = alerts_by_category()
    if not df_cat.empty:
        fig_cat = px.bar(df_cat, x="count", y="category", orientation="h",
                         template=CHART_TEMPLATE, color_discrete_sequence=[ACCENT_PURPLE])
    else:
        fig_cat = go.Figure(layout=dict(template=CHART_TEMPLATE))
    fig_cat.update_layout(height=300, xaxis_title="Count", yaxis_title="")

    # Teams
    df_teams = top_teams_by_risk()
    if not df_teams.empty:
        fig_teams = px.bar(df_teams, x="avg_risk", y="team", orientation="h",
                           template=CHART_TEMPLATE, color="flagged_count",
                           color_continuous_scale=["#06b6d4", "#ef4444"])
    else:
        fig_teams = go.Figure(layout=dict(template=CHART_TEMPLATE))
    fig_teams.update_layout(height=300, xaxis_title="Avg Risk Score", yaxis_title="")

    # Senders table
    df_senders = top_senders_by_risk()
    if not df_senders.empty:
        sender_table = dash_table.DataTable(
            data=df_senders.to_dict("records"),
            columns=[
                {"name": "Sender", "id": "sender_id"},
                {"name": "Role", "id": "sender_role"},
                {"name": "Team", "id": "team"},
                {"name": "Avg Risk", "id": "avg_risk"},
                {"name": "Flags", "id": "flagged_count"},
            ],
            style_header={
                "backgroundColor": "#1e293b",
                "color": TEXT_PRIMARY,
                "fontWeight": "600",
                "border": f"1px solid {BORDER}",
                "fontSize": "13px",
            },
            style_data={
                "backgroundColor": CARD_BG,
                "color": TEXT_SECONDARY,
                "border": f"1px solid {BORDER}",
                "fontSize": "13px",
            },
            style_cell={"padding": "10px", "textAlign": "left"},
            style_data_conditional=[
                {"if": {"filter_query": "{avg_risk} >= 80"}, "color": ACCENT_RED, "fontWeight": "600"},
                {"if": {"filter_query": "{avg_risk} >= 60 && {avg_risk} < 80"}, "color": ACCENT_AMBER},
            ],
        )
    else:
        sender_table = html.P("No flagged senders yet", style={"color": TEXT_SECONDARY})

    # Reviews
    df_reviews = review_stats()
    if not df_reviews.empty:
        color_map = {"true_positive": ACCENT_RED, "false_positive": ACCENT_GREEN, "needs_more_info": ACCENT_AMBER, "pending": TEXT_SECONDARY}
        fig_review = px.pie(df_reviews, values="count", names="feedback",
                            template=CHART_TEMPLATE,
                            color="feedback",
                            color_discrete_map=color_map)
        fig_review.update_traces(textinfo="percent+label", hole=0.4)
    else:
        fig_review = go.Figure(layout=dict(template=CHART_TEMPLATE, annotations=[dict(text="No reviews yet", showarrow=False, font=dict(size=16, color=TEXT_SECONDARY))]))
    fig_review.update_layout(height=300, showlegend=False)

    return kpi_cards, fig_time, fig_dist, fig_cat, fig_teams, sender_table, fig_review


# ─── Run ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8050)
