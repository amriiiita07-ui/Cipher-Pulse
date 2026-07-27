"""
CipherPulse — Model Training Script
Reads generated CSV, trains TF-IDF + Logistic Regression multi-class classifier,
evaluates performance, and saves artifacts.
"""

import os
import sys
import csv
import numpy as np

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from backend.app.ml.vectorizer import create_vectorizer, save_vectorizer
from backend.app.ml.model import create_model, save_model

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "generated_messages.csv")
# Also check the etl-relative path
DATA_FILE_ALT = os.path.join(os.path.dirname(__file__), "..", "data", "generated_messages.csv")


def load_training_data(filepath: str) -> tuple[list[str], list[str]]:
    """Load texts and labels from CSV or JSONL."""
    texts = []
    labels = []
    
    if filepath.endswith('.jsonl'):
        import json
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip(): continue
                row = json.loads(line)
                texts.append(row["message_text"])
                if int(row.get("label", 0)) == 1:
                    labels.append(row.get("label_type", "UNKNOWN"))
                else:
                    labels.append("BENIGN")
    else:
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                texts.append(row["message_text"])
                if row["is_flagged"].strip().lower() in ("true", "1", "yes"):
                    labels.append(row.get("flag_reason", "UNKNOWN") or "UNKNOWN")
                else:
                    labels.append("BENIGN")
    return texts, labels


def train():
    # Find data file
    if len(sys.argv) > 1:
        data_path = sys.argv[1]
    else:
        data_path = None
        for p in [DATA_FILE, DATA_FILE_ALT]:
            if os.path.exists(p):
                data_path = p
                break

    if data_path is None or not os.path.exists(data_path):
        print(f"❌ Data file not found at {data_path}.")
        sys.exit(1)

    print(f"📂 Loading data from {data_path}")
    texts, labels = load_training_data(data_path)
    print(f"   Total samples: {len(texts)}")

    # Show label distribution
    from collections import Counter
    dist = Counter(labels)
    print(f"   Label distribution: {dict(dist)}")

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )
    print(f"   Train: {len(X_train)}, Test: {len(X_test)}")

    # Vectorize
    print("🔤 Fitting TF-IDF vectorizer...")
    vectorizer = create_vectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"   Feature dimensions: {X_train_vec.shape}")

    # Train
    print("🧠 Training Logistic Regression classifier...")
    model = create_model()
    model.fit(X_train_vec, y_train)

    # Evaluate
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n📊 Accuracy: {accuracy:.4f}")
    print("\n" + classification_report(y_test, y_pred))

    # Save artifacts
    unique_labels = sorted(set(labels))
    save_vectorizer(vectorizer)
    save_model(model, unique_labels)

    print("\n🎉 Training complete!")


if __name__ == "__main__":
    train()
