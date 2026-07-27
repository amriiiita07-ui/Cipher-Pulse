"""
CipherPulse — SQL Queries for the Analytics Dashboard
Returns pandas DataFrames from PostgreSQL.
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cipherpulse:cipherpulse_secret@localhost:5432/cipherpulse")
_engine = create_engine(DATABASE_URL)


def alerts_over_time() -> pd.DataFrame:
    """Daily alert count over time."""
    query = text("""
        SELECT
            DATE(cs.scored_at) AS day,
            COUNT(*) AS alert_count
        FROM communications_scored cs
        WHERE cs.risk_score >= 60
        GROUP BY DATE(cs.scored_at)
        ORDER BY day;
    """)
    return pd.read_sql(query, _engine)


def alerts_by_category() -> pd.DataFrame:
    """Alert count per risk label."""
    query = text("""
        SELECT
            label AS category,
            COUNT(*) AS count
        FROM communications_scored cs,
             jsonb_array_elements_text(cs.labels) AS label
        WHERE cs.risk_score >= 60
        GROUP BY label
        ORDER BY count DESC;
    """)
    return pd.read_sql(query, _engine)


def top_teams_by_risk() -> pd.DataFrame:
    """Average risk score per team."""
    query = text("""
        SELECT
            cr.team,
            ROUND(AVG(cs.risk_score)::numeric, 2) AS avg_risk,
            COUNT(*) AS flagged_count
        FROM communications_raw cr
        JOIN communications_scored cs ON cs.raw_id = cr.id
        WHERE cs.risk_score >= 60
        GROUP BY cr.team
        ORDER BY avg_risk DESC
        LIMIT 10;
    """)
    return pd.read_sql(query, _engine)


def top_senders_by_risk() -> pd.DataFrame:
    """Top senders with highest average risk."""
    query = text("""
        SELECT
            cr.sender_id,
            cr.sender_role,
            cr.team,
            ROUND(AVG(cs.risk_score)::numeric, 2) AS avg_risk,
            COUNT(*) AS flagged_count
        FROM communications_raw cr
        JOIN communications_scored cs ON cs.raw_id = cr.id
        WHERE cs.risk_score >= 60
        GROUP BY cr.sender_id, cr.sender_role, cr.team
        ORDER BY flagged_count DESC
        LIMIT 10;
    """)
    return pd.read_sql(query, _engine)


def review_stats() -> pd.DataFrame:
    """Review feedback distribution."""
    query = text("""
        SELECT
            COALESCE(r.feedback, 'pending') AS feedback,
            COUNT(*) AS count
        FROM reviews r
        GROUP BY r.feedback
        ORDER BY count DESC;
    """)
    return pd.read_sql(query, _engine)


def false_positive_rate_over_time() -> pd.DataFrame:
    """False positive rate trend over time."""
    query = text("""
        SELECT
            DATE(r.reviewed_at) AS day,
            COUNT(*) FILTER (WHERE r.feedback = 'false_positive') AS false_positives,
            COUNT(*) AS total_reviews,
            ROUND(
                COUNT(*) FILTER (WHERE r.feedback = 'false_positive')::numeric
                / GREATEST(COUNT(*), 1) * 100, 2
            ) AS fp_rate
        FROM reviews r
        GROUP BY DATE(r.reviewed_at)
        ORDER BY day;
    """)
    return pd.read_sql(query, _engine)


def risk_distribution() -> pd.DataFrame:
    """Distribution of risk scores across all scored messages."""
    query = text("""
        SELECT
            CASE
                WHEN risk_score < 20  THEN '0-19 (Low)'
                WHEN risk_score < 40  THEN '20-39 (Minor)'
                WHEN risk_score < 60  THEN '40-59 (Medium)'
                WHEN risk_score < 80  THEN '60-79 (High)'
                ELSE '80-100 (Critical)'
            END AS risk_bucket,
            COUNT(*) AS count
        FROM communications_scored
        GROUP BY risk_bucket
        ORDER BY risk_bucket;
    """)
    return pd.read_sql(query, _engine)


def summary_kpis() -> dict:
    """Key metrics for the top cards."""
    with _engine.connect() as conn:
        total = conn.execute(text("SELECT COUNT(*) FROM communications_raw")).scalar()
        scored = conn.execute(text("SELECT COUNT(*) FROM communications_scored")).scalar()
        alerts = conn.execute(text("SELECT COUNT(*) FROM communications_scored WHERE risk_score >= 60")).scalar()
        critical = conn.execute(text("SELECT COUNT(*) FROM communications_scored WHERE risk_score >= 80")).scalar()
        reviewed = conn.execute(text("SELECT COUNT(*) FROM reviews")).scalar()
        tp = conn.execute(text("SELECT COUNT(*) FROM reviews WHERE feedback = 'true_positive'")).scalar()
        fp = conn.execute(text("SELECT COUNT(*) FROM reviews WHERE feedback = 'false_positive'")).scalar()

    return {
        "total_messages": total or 0,
        "scored_messages": scored or 0,
        "total_alerts": alerts or 0,
        "critical_alerts": critical or 0,
        "reviewed": reviewed or 0,
        "true_positives": tp or 0,
        "false_positives": fp or 0,
        "fp_rate": round((fp or 0) / max(reviewed or 1, 1) * 100, 2),
    }
