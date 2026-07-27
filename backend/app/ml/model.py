"""
CipherPulse — ML Model wrapper.
Loads/saves the trained classifier and provides predict + score functions.
"""

import os
import json
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.pkl")
LABELS_PATH = os.path.join(ARTIFACTS_DIR, "labels.json")


def create_model() -> LogisticRegression:
    """Create a fresh Logistic Regression classifier."""
    return LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        solver="lbfgs",
        C=1.0,
    )


def save_model(model: LogisticRegression, labels: list[str],
               model_path: str = MODEL_PATH, labels_path: str = LABELS_PATH) -> None:
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    with open(labels_path, "w") as f:
        json.dump(labels, f, indent=2)
    print(f"✅ Model saved → {model_path}")
    print(f"✅ Labels saved → {labels_path}")


def load_model(model_path: str = MODEL_PATH) -> LogisticRegression:
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}. Train first.")
    return joblib.load(model_path)


def load_labels(labels_path: str = LABELS_PATH) -> list[str]:
    if not os.path.exists(labels_path):
        raise FileNotFoundError(f"Labels not found at {labels_path}. Train first.")
    with open(labels_path, "r") as f:
        return json.load(f)


def predict_risk(model: LogisticRegression, features) -> dict:
    """
    Given a feature vector (from vectorizer), return:
      - predicted_label: str
      - risk_score: float (0-100)
      - probabilities: dict[label -> probability]
    """
    probas = model.predict_proba(features)[0]
    classes = model.classes_.tolist()
    predicted_idx = int(np.argmax(probas))
    predicted_label = classes[predicted_idx]

    # Risk score: if predicted is "BENIGN", use (1 - benign_prob) * 100
    # Otherwise use the max violation probability * 100
    benign_prob = 0.0
    for i, cls in enumerate(classes):
        if cls == "BENIGN":
            benign_prob = probas[i]
            break

    risk_score = round((1.0 - benign_prob) * 100, 2)

    prob_dict = {cls: round(float(p), 4) for cls, p in zip(classes, probas)}

    return {
        "predicted_label": predicted_label,
        "risk_score": risk_score,
        "probabilities": prob_dict,
    }
