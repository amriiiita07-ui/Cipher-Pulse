"""
CipherPulse — Synthetic Communications Data Generator
Generates realistic financial-firm messages with labeled compliance violations.
Output: data/generated_messages.csv
"""

import csv
import random
import uuid
import os
from datetime import datetime, timedelta

# ─── Configuration ──────────────────────────────────────────────────────────
NUM_MESSAGES = 1500
FLAG_RATIO = 0.12  # ~12% flagged
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "generated_messages.csv")

# ─── Metadata pools ────────────────────────────────────────────────────────
SOURCES = ["slack", "email", "teams", "bloomberg_chat"]

TEAMS = [
    "Equities Trading", "Fixed Income", "M&A Advisory", "Wealth Management",
    "Compliance", "Risk Management", "Research", "Operations", "IT",
    "Client Services", "Treasury", "FX Trading", "Derivatives"
]

ROLES = [
    "Analyst", "Associate", "VP", "Director", "Managing Director",
    "Trader", "Portfolio Manager", "Compliance Officer", "Research Analyst",
    "Client Advisor", "Operations Specialist"
]

SENDERS = [
    ("john.mitchell", "Trader", "Equities Trading"),
    ("sarah.chen", "Analyst", "Research"),
    ("mike.roberts", "VP", "M&A Advisory"),
    ("lisa.wong", "Managing Director", "Fixed Income"),
    ("dave.kumar", "Associate", "Wealth Management"),
    ("rachel.foster", "Compliance Officer", "Compliance"),
    ("tom.jackson", "Portfolio Manager", "Equities Trading"),
    ("emily.davis", "Director", "Client Services"),
    ("chris.martin", "Trader", "FX Trading"),
    ("anna.petrov", "Analyst", "Research"),
    ("james.wilson", "VP", "Derivatives"),
    ("maria.garcia", "Associate", "M&A Advisory"),
    ("ryan.lee", "Operations Specialist", "Operations"),
    ("helen.brown", "Client Advisor", "Wealth Management"),
    ("alex.turner", "Research Analyst", "Research"),
    ("kate.johnson", "Trader", "Fixed Income"),
    ("mark.thompson", "Director", "Risk Management"),
    ("sophia.liu", "Associate", "Equities Trading"),
    ("daniel.wright", "VP", "Treasury"),
    ("olivia.harris", "Analyst", "Compliance"),
]

CHANNELS = [
    "general", "trading-desk", "research-updates", "client-advisory",
    "risk-alerts", "deal-team-alpha", "market-news", "compliance-notices",
    "team-standup", "watercooler", "fx-desk", "fixed-income-desk"
]

# ─── Message templates ─────────────────────────────────────────────────────

BENIGN_MESSAGES = [
    "Morning team! Markets are looking interesting today. Let's discuss at standup.",
    "Can someone pull the latest PnL report for the equity book? Need it before noon.",
    "Reminder: compliance training is mandatory this Friday at 2pm. Please confirm attendance.",
    "I've updated the risk model parameters based on last quarter's vol data. Review when you can.",
    "Hey, are we still on for the client dinner Thursday? Need to confirm the reservation.",
    "FYI — the ECB press conference is at 2:45 PM CET. Expect vol spike in EUR pairs.",
    "Please review the attached pitch deck for the Acme Corp engagement before our call.",
    "Happy birthday Dave! 🎂 Cake in the break room at 3.",
    "IT maintenance window tonight 10pm-2am. Trading systems will be briefly offline.",
    "Great work on the quarterly report, team. Client feedback has been very positive.",
    "Can we reschedule tomorrow's portfolio review to Wednesday? I have a conflict.",
    "Updated the hedging strategy doc — please review Section 3 on delta adjustments.",
    "Lunch order going in at 11:30. Reply with your order if you want anything.",
    "New research note on semiconductor sector published. Link in the shared drive.",
    "Heads up: VIX is elevated. Consider tightening stop-losses on open positions.",
    "The new settlement system goes live next Monday. Training sessions available this week.",
    "Annual performance reviews are due by end of month. Please submit self-assessments.",
    "Good morning! S&P futures up 0.3%, 10Y at 4.25%. Should be an active day.",
    "Confirming receipt of the trade allocation report. Will review and revert by COB.",
    "Team meeting moved to Conference Room B due to AV issues in Room A.",
    "Reminder to submit your expense reports before the monthly cutoff date.",
    "The market rally yesterday was driven by strong tech earnings. No surprises there.",
    "Please update the CRM with latest client contact notes from this week's meetings.",
    "Our new hire starts Monday — please make them feel welcome!",
    "The Fed minutes didn't reveal anything unexpected. Rates steady as anticipated.",
    "Working from home tomorrow. I'll be available on Teams for any urgent matters.",
    "Can we set up a call to discuss the new portfolio rebalancing methodology?",
    "Excellent presentation to the board today. Very well received across the table.",
    "Treasury yields are ticking up. Watching the 10Y closely for a breakout.",
    "Please send me the latest NAV calculations for the client portfolios.",
    "The compliance hotline number has been updated — check the intranet for details.",
    "Weather alert: heavy snow expected tomorrow. Consider working remotely.",
    "System upgrade complete. All trading platforms are back online and functioning normally.",
    "Just got off a call with the custodian. They'll send updated statements by Friday.",
    "Reading through the new SEC proposed rules on market structure. Interesting changes ahead.",
    "Coffee machine on 5th floor is broken again. Use the one on 4th floor.",
    "Solid execution on the block trade this morning. Good teamwork everyone.",
    "Please ensure all trade confirmations are matched before end of day.",
    "Reviewing the stress test scenarios for Q2. Will share findings at the risk committee.",
    "The charity run is this Saturday! Sign up sheet is in the kitchen.",
    "Futures are flat pre-market. Quiet open expected unless we get surprise data.",
    "Can someone send me the counterparty credit exposure report? Thanks.",
    "Don't forget to log your hours on the client project by Friday.",
    "The compliance newsletter is out — please read the section on gift policies.",
    "Looking at the yield curve — still inverted but flattening. Worth monitoring.",
    "Good discussion at the strategy session. Let's finalize the action items tomorrow.",
    "Please update the trade blotter with this morning's executions.",
    "Anyone have the deck from the industry conference last week? Want to review it.",
    "Market close: Dow +0.4%, S&P +0.6%, NASDAQ +0.8%. Green across the board.",
    "Setting up a working group for the new regulatory reporting requirements.",
    "The printer on 3rd floor is jammed. IT has been notified.",
    "Just published the weekly market commentary. Please share with relevant clients.",
    "Reminder: no personal trading during the blackout period. Ends next Tuesday.",
    "GDP data coming out at 8:30 AM. Consensus is +2.1% QoQ.",
    "Looking forward to the team offsite next month. Hotel bookings are confirmed.",
    "The new API for real-time pricing is now in UAT. Testers needed.",
    "Quick reminder to review and sign the updated employee handbook acknowledgment.",
    "Good catch on that reconciliation discrepancy, Ryan. Let's investigate further.",
    "Scheduling a deep dive on the structured products book for next week.",
    "Holiday schedule reminder: markets closed Monday for the bank holiday.",
    "Can we get a quorum for the investment committee meeting? Need 5 members.",
    "Updated the client onboarding checklist per the new AML requirements.",
    "The bid-ask spread on XYZ Corp is widening. Low liquidity today.",
    "Please archive all completed project files to the shared drive by Friday.",
    "Morning briefing: Oil up 2%, gold flat, dollar strengthening against euro.",
    "Thanks for covering my shift yesterday. I owe you one!",
    "The vendor demo for the new risk analytics platform is at 3pm today.",
    "Running late — traffic is terrible. Start the meeting without me.",
    "Q3 earnings season kicks off next week. Prepare your sector previews.",
    "All clear on the audit findings. No material issues identified.",
]

# ─── Flagged message templates ─────────────────────────────────────────────

MNPI_MESSAGES = [
    "Hey, keep this between us — the Meridian Corp acquisition is going through. Board approved it yesterday. Don't share with anyone.",
    "I just heard from the CFO that Q3 earnings are going to be WAY above consensus. Like 40% beat. Maybe you should position before Thursday's release.",
    "Between you and me, the FDA approval for NovaPharma's drug is coming next week. This is going to be huge for the stock.",
    "The Titan-Apex merger talks are at the final stage. Announcement expected Monday morning. I'd load up on Apex shares before then.",
    "Don't tell anyone but I overheard the CEO on a call — they're going to announce a massive buyback program. Stock should pop 15%.",
    "Heads up, strictly confidential: GlobalTech is about to get a $2B defense contract. The press release goes out next Wednesday.",
    "I was in the executive meeting today. They're planning to cut the dividend by 50%. The market doesn't know yet. Might want to trim your position.",
    "Just saw the preliminary numbers — revenue is down 30% from guidance. This hasn't been shared externally. Be careful with your exposure.",
    "Confidential: our client StellarBio is about to announce a clinical trial failure. Their stock will crater once it's public.",
    "The takeover bid for Quantum Industries is at $85/share. Only the deal team knows. This is a 40% premium to current price.",
    "I got word that the regulator is about to fine CryptoEx $500M. They haven't disclosed it yet. Short opportunity if you ask me.",
    "Between us — the IPO pricing for TechNova is going to be $45, well above the expected range. Allocation will be tight.",
]

GUARANTEED_RETURNS_MESSAGES = [
    "I can guarantee you at least 25% returns on this fund. There's absolutely zero risk — you literally cannot lose money on this.",
    "Trust me, this investment is a sure thing. I personally guarantee you'll see minimum 20% annual returns. It's impossible to lose.",
    "Mrs. Patterson, I promise you this product will deliver at least 15% per year. There is no chance of losing your principal. None whatsoever.",
    "This strategy has never lost money and never will. I guarantee your portfolio will grow by at least 30% this year. You have my word.",
    "I'm telling you this is risk-free. Put your retirement savings in here and I guarantee it doubles within 3 years. No downside at all.",
    "Listen, forget about market risk. This structured product guarantees your returns. You'll get 18% minimum, no matter what happens in the markets.",
    "The returns on this are guaranteed — I'm talking 20% annually with zero volatility. Your money is completely safe. There's absolutely no way you lose.",
    "I assure you this is the safest investment you'll ever make. Guaranteed 12% returns, principal fully protected. Risk? What risk?",
    "You can't lose on this one. I've been doing this for 20 years and I guarantee this trade prints at least 50% profit.",
    "Don't worry about the market. This strategy is bulletproof. I guarantee positive returns every single quarter. No exceptions.",
]

COLLUSION_MESSAGES = [
    "Alright, here's the plan: we all start buying Nexus Corp at 10am sharp. If we coordinate, we can trigger the squeeze and dump at the top.",
    "Let's push QuantumShares up together. I'll buy 50K shares, you buy 50K, and we get Mike to buy another 50K. When retail follows, we sell.",
    "We need to coordinate our orders to move the price. Start placing large bids at $42 to create the illusion of demand. Then we unload.",
    "If the three of us simultaneously bid up the close on Friday, we can manipulate the settlement price higher. Good for our month-end marks.",
    "Let's front-run that large client order coming in tomorrow. We buy ahead of them, their order pushes the price up, and we profit.",
    "I'll wash-trade between my accounts to pump the volume, making it look like there's real interest. You guys start buying once volume picks up.",
    "We can corner the market on the March futures contract. Between our desks, we control enough contracts to squeeze the shorts.",
    "The plan is simple: we coordinate our algo strategies to systematically push the bid up during low-liquidity hours. Easy money.",
    "Let's talk on the other channel about moving that illiquid bond price. We need to make it look natural in the audit trail.",
    "I'll leak a fake bullish research note to retail traders. When the price pops, we sell our entire position. Clean exit.",
]

PII_LEAKAGE_MESSAGES = [
    "Here's the client info you asked for: John Smith, SSN 483-29-1847, account #7742991, current balance $2.3M. Don't forward this email.",
    "Attached is the full client list with names, addresses, SSNs, and account balances. Let me know if you need anything else.",
    "Client details: Margaret Reynolds, DOB 03/15/1965, SSN 291-55-8834. She wants to wire $500K from account #882441.",
    "Sending you the HNW client database export. It has everything — SSNs, tax IDs, portfolio values, beneficiary information. Handle with care.",
    "FYI here's the password to the client portal: admin@Wealth2024! — use it to pull the tax documents for the Thompson account.",
    "Hey, can you send me Mr. Nakamura's passport scan and bank statements? Just email them to my personal Gmail — faster that way.",
    "The client's credit card info: 4532-XXXX-8891-2247, exp 08/27, CVV 441. Use it for the subscription charge.",
    "Forwarding the complete client KYC file for Williams Estate Trust. Includes tax returns, ID scans, and source-of-wealth documentation.",
    "Here are the wire instructions for the offshore account: IBAN CH93-0076-2011-6238-5295-7, beneficiary: Pacific Holdings Ltd.",
    "Attached: employee salary report for the trading desk. Includes base, bonus, and deferred comp for all 45 team members.",
]

AML_MESSAGES = [
    "The client wants to break the $50K deposit into five $9,900 transactions across different branches. I told them we can make that work.",
    "We need to move $2M through the shell company accounts before month-end. Use the usual layering structure to avoid triggering alerts.",
    "The new client from the sanctioned country wants to open accounts through their UK subsidiary. Let's skip the enhanced due diligence — takes too long.",
    "Can we backdate the KYC documents for the Patel account? They need to show they were onboarded before the new regulations kicked in.",
    "Structure the wire transfers to stay under the reporting threshold. Split it across three days and use different reference codes.",
    "The client's source of funds documentation doesn't add up, but they're bringing in $10M in AUM. Let's not ask too many questions.",
]


def _random_ts(base: datetime, spread_days: int = 90) -> str:
    """Return a random ISO timestamp within the last `spread_days` days."""
    offset = timedelta(
        days=random.randint(0, spread_days),
        hours=random.randint(6, 20),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59),
    )
    return (base - offset).isoformat()


def generate_messages(n: int = NUM_MESSAGES) -> list[dict]:
    """Generate n synthetic messages with ~FLAG_RATIO flagged."""
    base_time = datetime.now()
    messages = []
    num_flagged = int(n * FLAG_RATIO)
    num_benign = n - num_flagged

    # ── Benign messages ─────────────────────────────────────────────────
    for _ in range(num_benign):
        sender_id, sender_role, team = random.choice(SENDERS)
        messages.append({
            "id": str(uuid.uuid4()),
            "source": random.choice(SOURCES),
            "timestamp": _random_ts(base_time),
            "sender_id": sender_id,
            "sender_role": sender_role,
            "team": team,
            "channel_id": random.choice(CHANNELS),
            "message_text": random.choice(BENIGN_MESSAGES),
            "is_flagged": False,
            "flag_reason": "",
        })

    # ── Flagged messages ────────────────────────────────────────────────
    flag_pools = [
        (MNPI_MESSAGES, "MNPI"),
        (GUARANTEED_RETURNS_MESSAGES, "GUARANTEED_RETURN"),
        (COLLUSION_MESSAGES, "COLLUSION"),
        (PII_LEAKAGE_MESSAGES, "PII_LEAKAGE"),
        (AML_MESSAGES, "AML_SUSPICIOUS"),
    ]

    for _ in range(num_flagged):
        pool, reason = random.choice(flag_pools)
        sender_id, sender_role, team = random.choice(SENDERS)
        messages.append({
            "id": str(uuid.uuid4()),
            "source": random.choice(SOURCES),
            "timestamp": _random_ts(base_time),
            "sender_id": sender_id,
            "sender_role": sender_role,
            "team": team,
            "channel_id": random.choice(CHANNELS),
            "message_text": random.choice(pool),
            "is_flagged": True,
            "flag_reason": reason,
        })

    random.shuffle(messages)
    return messages


def save_csv(messages: list[dict], path: str = OUTPUT_FILE) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fieldnames = [
        "id", "source", "timestamp", "sender_id", "sender_role",
        "team", "channel_id", "message_text", "is_flagged", "flag_reason"
    ]
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(messages)
    print(f"✅ Generated {len(messages)} messages → {path}")


if __name__ == "__main__":
    msgs = generate_messages()
    save_csv(msgs)
