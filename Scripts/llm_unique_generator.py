#!/usr/bin/env python3
"""
CipherPulse — 4GB RAM Optimized Local LLM unique Generator
Queries a local Llama-3.2-1B model via Ollama to generate 100% unique, organic trader chats
and streams them directly into the secure ingestion pipeline.
"""

import time
import json
import random
import urllib.request

OLLAMA_URL = "http://localhost:11434/api/generate"
API_URL = "http://localhost:8000/api/analyze"

TRADERS = [
    {"sender_id": "tom.trader", "sender_role": "Trader", "team": "Equities Trading", "channel_id": "eq-desk"},
    {"sender_id": "sarah.analyst", "sender_role": "Analyst", "team": "Research & Strategy", "channel_id": "market-insights"},
    {"sender_id": "bob.portfolio", "sender_role": "Portfolio Manager", "team": "Wealth Management", "channel_id": "wealth-alpha"},
    {"sender_id": "alice.compliance", "sender_role": "Compliance Officer", "team": "Risk Management", "channel_id": "compliance-alerts"},
    {"sender_id": "meridian.insider", "sender_role": "Corporate Advisor", "team": "Investment Banking", "channel_id": "deal-room-beta"}
]

TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "Meridian", "QuantumCorp", "ApexGold", "NVIDIA", "META"]
SOURCES = ["slack", "teams", "bloomberg", "reuters"]
VIOLATIONS = ["Material Non-Public Information (MNPI)", "Collusion / Price Fixing", "Guaranteed Risk-Free Returns"]

def query_local_llm():
    """Asks the local 1B LLM to generate a single unique trader chat message"""
    trader = random.choice(TRADERS)
    ticker = random.choice(TICKERS)
    violation = random.choice(VIOLATIONS)
    is_violation = random.choice([True, False, False])  # 33% violation chance
    
    if is_violation:
        prompt = (
            f"You are roleplaying as a Wall Street trader named {trader['sender_id']}. "
            f"Write a single casual chat message (1-2 sentences) discussing {ticker}. "
            f"The message must contain a subtle and suspicious {violation} policy violation. "
            f"Do not write any greetings, quotes, or headers. Write only the raw chat message."
        )
    else:
        prompt = (
            f"You are roleplaying as a Wall Street trader named {trader['sender_id']}. "
            f"Write a standard, benign business/trading chat message (1-2 sentences) discussing {ticker} "
            f"without any policy violations. Keep it extremely professional. "
            f"Do not write any greetings, quotes, or headers. Write only the raw chat message."
        )

    payload = {
        "model": "llama3.2:1b",
        "prompt": prompt,
        "stream": False
    }

    try:
        req = urllib.request.Request(OLLAMA_URL)
        req.add_header('Content-Type', 'application/json')
        jsondata = json.dumps(payload).encode('utf-8')
        
        with urllib.request.urlopen(req, jsondata, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result["response"].strip().strip('"').strip("'")
    except Exception as e:
        print(f"⚠️ Local LLM call failed (make sure 'ollama run llama3.2:1b' is active): {e}")
        return None

def main():
    print("=======================================================")
    print("🤖 Starting 4GB RAM Optimized Local LLM Unique Generator")
    print("   Target Model: Llama-3.2-1B-Instruct")
    print("   Press CTRL+C to stop")
    print("=======================================================")
    
    try:
        while True:
            # Generate unique chat message using Llama-3.2-1B
            message_text = query_local_llm()
            
            if message_text:
                trader = random.choice(TRADERS)
                payload = {
                    "source": random.choice(SOURCES),
                    "sender_id": trader["sender_id"],
                    "sender_role": trader["sender_role"],
                    "team": trader["team"],
                    "channel_id": trader["channel_id"],
                    "message_text": message_text
                }
                
                # Send directly to your live API
                try:
                    req = urllib.request.Request(API_URL)
                    req.add_header('Content-Type', 'application/json')
                    jsondata = json.dumps(payload).encode('utf-8')
                    
                    with urllib.request.urlopen(req, jsondata, timeout=5) as response:
                        result = json.loads(response.read().decode('utf-8'))
                        print(f"\n💬 Generated: \"{message_text[:60]}...\"")
                        print(f"   ↳ Risk Score: {result.get('risk_score', 0):.2f}% | Flagged: {result.get('labels', [])}")
                except Exception as e:
                    print(f"❌ Failed to send to API: {e}")
            
            # Sleep to match natural trading conversation flow
            time.sleep(random.uniform(5.0, 10.0))
            
    except KeyboardInterrupt:
        print("\n🛑 Local LLM Generator stopped.")

if __name__ == "__main__":
    main()
