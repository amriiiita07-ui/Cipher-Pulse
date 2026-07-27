"""
CipherPulse — TF-IDF Vectorizer wrapper.
Handles fitting and transforming message text to feature vectors.
"""

import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
VECTORIZER_PATH = os.path.join(ARTIFACTS_DIR, "vectorizer.pkl")


def create_vectorizer(max_features: int = 5000, ngram_range: tuple = (1, 2)) -> TfidfVectorizer:
    """Create a fresh TF-IDF vectorizer."""
    return TfidfVectorizer(
        max_features=max_features,
        ngram_range=ngram_range,
        stop_words="english",
        strip_accents="unicode",
        sublinear_tf=True,
    )


def save_vectorizer(vectorizer: TfidfVectorizer, path: str = VECTORIZER_PATH) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(vectorizer, path)
    print(f"✅ Vectorizer saved → {path}")


def load_vectorizer(path: str = VECTORIZER_PATH) -> TfidfVectorizer:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Vectorizer not found at {path}. Train first.")
    return joblib.load(path)
