import os
import json
import time
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

from google import genai
from google.genai import types

load_dotenv()

MODEL = os.getenv("CIPHERPULSE_GEN_MODEL", "gemini-2.0-flash")
API_KEY = os.environ.get("GEMINI_API_KEY", "")

client = genai.Client(api_key=API_KEY)

SYSTEM_RULES = """
You generate synthetic internal communications for a fictional financial institution.

Hard rules:
- Output ONLY valid JSON. No markdown. No extra commentary.
- Never include real people, real emails, real phone numbers, real addresses, or real account numbers.
- Use fictional placeholders if needed.
- Match the schema exactly.

Schema (each record):
id, timestamp, source, sender_role, team, message_text, label, label_type, severity

Allowed values:
- source: slack | email
- sender_role: trader | analyst | advisor | compliance | engineer | manager
- team: equities | fx | rates | wealth | compliance | data
- label: 0 or 1
- label_type: NONE | MNPI | GUARANTEE | COLLUSION | PII
- severity: none | low | medium | high
"""

def iso_time(start: datetime, i: int) -> str:
    t = start + timedelta(seconds=30 * i)
    return t.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

def build_prompt(n: int, start_id: int) -> str:
    return f"""
{SYSTEM_RULES}

Generate {n} messages as JSON with this exact outer shape:
{{ "data": [ ... ] }}

Rules:
- id format: msg_{{6-digit}} (e.g., msg_000123). Start from msg_{start_id:06d}.
- timestamp must be ISO-8601 Zulu (YYYY-MM-DDTHH:MM:SSZ). Use realistic spread.
- Class balance: ~92% label=0 normal; ~8% label=1 risky split evenly across MNPI/GUARANTEE/COLLUSION/PII.
- If label=0 then label_type="NONE" and severity="none".
- If label=1 then label_type in MNPI/GUARANTEE/COLLUSION/PII and severity in low/medium/high.
- Messages must be realistic workplace communications. Include subtle/ambiguous risky cases (not only obvious keyword stuffing).
- Do not be extremely explicit about wrongdoing; make some risky messages plausibly deniable.

Return ONLY the JSON object.
"""

def generate_batch(n: int, start_id: int) -> list[dict]:
    prompt = build_prompt(n, start_id)
    
    for attempt in range(5):
        try:
            resp = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5,
                    top_p=0.95,
                    max_output_tokens=8192,
                    response_mime_type="application/json",
                )
            )
            text = resp.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            obj = json.loads(text)
            if isinstance(obj, list):
                return obj
            if isinstance(obj, dict):
                if "data" in obj and isinstance(obj["data"], list):
                    return obj["data"]
                # Fallback: if dict has a list, return it
                for val in obj.values():
                    if isinstance(val, list):
                        return val
            raise KeyError("Could not locate a list of data records in JSON response.")
        except (json.JSONDecodeError, KeyError, Exception) as e:
            if attempt == 4:
                print(f"Final attempt failed. Raw output was:\n{resp.text if 'resp' in locals() else 'No response'}")
                raise e
            print(f"JSON decode/parse failed on attempt {attempt+1}, retrying... (Error: {e})")
            time.sleep(2)

def main():
    out_path = os.getenv("CIPHERPULSE_OUT", "data/training_messages.jsonl")
    total = int(os.getenv("CIPHERPULSE_TOTAL", "2000"))
    batch_size = int(os.getenv("CIPHERPULSE_BATCH", "25"))
    sleep_s = float(os.getenv("CIPHERPULSE_SLEEP", "1.0"))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    start_time = datetime(2026, 5, 10, 9, 0, 0, tzinfo=timezone.utc)
    next_id = 1

    with open(out_path, "w", encoding="utf-8") as f:
        while next_id <= total:
            n = min(batch_size, total - next_id + 1)
            data = generate_batch(n, next_id)

            # Normalize ids/timestamps (robustness)
            for i, row in enumerate(data):
                row["id"] = f"msg_{(next_id + i):06d}"
                row["timestamp"] = iso_time(start_time, next_id + i)
                # enforce consistent fields for normal class
                if row.get("label") == 0:
                    row["label_type"] = "NONE"
                    row["severity"] = "none"

                f.write(json.dumps(row, ensure_ascii=False) + "\n")

            f.flush() # Ensure the data is written to disk immediately
            print(f"Wrote {n} messages ({next_id}..{next_id+n-1})")
            next_id += n
            time.sleep(sleep_s)

    print(f"Done: {out_path}")

if __name__ == "__main__":
    main()