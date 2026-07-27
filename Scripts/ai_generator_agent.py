#!/usr/bin/env python3
"""
CipherPulse — Background AI Streaming Agent Daemon
Endlessly simulates realistic trader conversation streams, generating compliance events,
market discussions, and policy violations, and posting them directly to the local API.
Runs 100% locally with zero external API fees or limits!
"""

import time
import json
import random
import urllib.request
from datetime import datetime

# Local API endpoint
API_URL = "http://localhost:8000/api/analyze"

# Trader profiles with specific teams, roles, and communication channels
TRADERS = [
    {"sender_id": "tom.trader", "sender_role": "Trader", "team": "Equities Trading", "channel_id": "eq-desk"},
    {"sender_id": "sarah.analyst", "sender_role": "Analyst", "team": "Research & Strategy", "channel_id": "market-insights"},
    {"sender_id": "bob.portfolio", "sender_role": "Portfolio Manager", "team": "Wealth Management", "channel_id": "wealth-alpha"},
    {"sender_id": "alice.compliance", "sender_role": "Compliance Officer", "team": "Risk Management", "channel_id": "compliance-alerts"},
    {"sender_id": "meridian.insider", "sender_role": "Corporate Advisor", "team": "Investment Banking", "channel_id": "deal-room-beta"},
    {"sender_id": "dave.broker", "sender_role": "Broker", "team": "OTC Desk", "channel_id": "general-otc"}
]

TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "Meridian", "QuantumCorp", "ApexGold"]
SOURCES = ["slack", "teams", "bloomberg", "reuters", "general"]

# Comprehensive template categories for highly realistic conversation streams
SCENARIOS = {
    "BENIGN": [
        "Hey, did you see the new market report on {ticker}? Looks solid.",
        "Let's schedule a sync at {time} to review the portfolio allocations.",
        "Market is opening flat today. I'm keeping an eye on {ticker} volume.",
        "Can you send over the Q1 financial statements when you get a chance?",
        "Congrats on the deal closing yesterday! Great job team.",
        "I will be out of office this afternoon. Contact Sarah for any urgent order executions.",
        "Let's review the risk limits for our {ticker} long positions tomorrow.",
        "Are we ready for the quarterly earnings call next week?",
        "Agree with your thesis on {ticker}. The debt-to-equity ratio looks much safer now.",
        "Just uploaded the compliance review audit logs into the secure vault."
    ],
    "MNPI": [
        "Hey, just got word from the {ticker} deal team. The merger is approved, public announcement tomorrow at 9 AM.",
        "We need to buy as much {ticker} call options as possible before the earnings leak hits the press.",
        "Meridian CEO just told me off-the-record that their quarterly earnings are {percentage}% higher than guidance.",
        "The board meeting just concluded. They agreed to buy back $5B in shares of {ticker}.",
        "Confidential: The acquisition of {ticker} by QuantumCorp is locked in. Keeping this strictly off-channel.",
        "Our investment banking partners are advising {ticker} on a massive restructuring plan. Get ready."
    ],
    "GUARANTEED_RETURN": [
        "I promise you this investment is completely risk-free. I guarantee at least a {percentage}% return within 3 months.",
        "Put your client assets in this fund. There is absolutely no downside, guaranteed returns of {percentage}% per annum.",
        "This {ticker} arbitrage trade is a sure thing. Guaranteed double within a year. Trust me.",
        "I can assure you that this offshore yield strategy is protected against any market downside.",
        "No matter what happens to {ticker}, your principal capital is 100% guaranteed. High yields guaranteed."
    ],
    "COLLUSION": [
        "Hey, let's both hold our bids for {ticker} at ${price} to prevent the price from dropping further.",
        "If you buy on the NYSE and I sell on the OTC, we can spread the volume and keep the bid-ask spread wide.",
        "Don't bid on {ticker} yet. Let the other desk finish selling, then we buy it cheap together.",
        "Let's coordinate our orders on {ticker} to push the settlement price above ${price} before close.",
        "If we split the block trade commission, I can route all my client flow exclusively through your desk."
    ]
}

def generate_random_message():
    """Dynamically builds a realistic chat message using seed templates and random variables"""
    category = random.choices(
        ["BENIGN", "MNPI", "GUARANTEED_RETURN", "COLLUSION"],
        weights=[0.60, 0.15, 0.15, 0.10], # 60% standard chats, 40% compliance alerts
        k=1
    )[0]
    
    trader = random.choice(TRADERS)
    template = random.choice(SCENARIOS[category])
    
    # Format the message with realistic random parameters
    message_text = template.format(
        ticker=random.choice(TICKERS),
        time=random.choice(["2:00 PM", "10:30 AM", "11:00 AM", "3:30 PM"]),
        percentage=random.choice([15, 25, 40, 50]),
        price=random.choice([42, 115, 230, 85])
    )
    
    payload = {
        "source": random.choice(SOURCES),
        "sender_id": trader["sender_id"],
        "sender_role": trader["sender_role"],
        "team": trader["team"],
        "channel_id": trader["channel_id"],
        "message_text": message_text
    }
    return payload

def send_message_to_api(payload):
    """Sends the generated message directly to the local FastAPI endpoint"""
    try:
        req = urllib.request.Request(API_URL)
        req.add_header('Content-Type', 'application/json')
        jsondata = json.dumps(payload).encode('utf-8')
        
        with urllib.request.urlopen(req, jsondata, timeout=5) as response:
            res_body = response.read()
            result = json.loads(res_body.decode('utf-8'))
            print(f"🤖 [AI Agent] Sent: \"{payload['message_text'][:45]}...\"")
            print(f"   ↳ Risk Score: {result.get('risk_score', 0):.2f}% | Labels: {result.get('labels', [])}")
    except Exception as e:
        print(f"❌ [AI Agent] Failed to connect to API: {e}")

def main():
    print("=======================================================")
    print("🚀 Starting Background AI Streaming Agent Daemon")
    print("   Streaming live trader feeds to:", API_URL)
    print("   Press CTRL+C to stop the daemon")
    print("=======================================================")
    
    try:
        while True:
            # Generate a realistic trader conversation payload
            payload = generate_random_message()
            
            # Post the event
            send_message_to_api(payload)
            
            # Sleep for a random interval between 4 to 8 seconds to mimic human chat streams
            sleep_time = random.uniform(4.0, 8.0)
            time.sleep(sleep_time)
            
    except KeyboardInterrupt:
        print("\n🛑 AI Streaming Agent Daemon stopped successfully.")

if __name__ == "__main__":
    main()
