"""
CipherPulse — ETL: Load raw CSV into PostgreSQL communications_raw table.
Reads data/generated_messages.csv and inserts into the database.
"""

import csv
import os
import sys
from datetime import datetime

import psycopg2
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://cipherpulse:cipherpulse_secret@localhost:5432/cipherpulse")
INPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "generated_messages.csv")


def parse_bool(val: str) -> bool:
    return str(val).strip().lower() in ("true", "1", "yes")


def load_raw(filepath: str = INPUT_FILE, db_url: str = DATABASE_URL) -> int:
    """Load CSV rows into communications_raw. Returns count inserted."""
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    insert_sql = """
        INSERT INTO communications_raw
            (id, source, timestamp, sender_id, sender_role, team,
             channel_id, message_text, is_flagged, flag_reason, ingested_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING;
    """

    count = 0
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cur.execute(insert_sql, (
                row["id"],
                row["source"],
                row["timestamp"],
                row["sender_id"],
                row["sender_role"],
                row["team"],
                row["channel_id"],
                row["message_text"],
                parse_bool(row["is_flagged"]),
                row.get("flag_reason", "") or None,
                datetime.utcnow(),
            ))
            count += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"✅ Loaded {count} rows into communications_raw")
    return count


if __name__ == "__main__":
    load_raw()
