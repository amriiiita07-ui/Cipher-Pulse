"""
CipherPulse — Explanation module.
Extracts human-readable reason codes from TF-IDF model predictions.
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


def explain_prediction(
    text: str,
    vectorizer: TfidfVectorizer,
    model: LogisticRegression,
    predicted_label: str,
    top_n: int = 5,
) -> dict:
    """
    Generate an explanation for why the model flagged a message.
    Returns:
      - top_tokens: most influential words for the predicted class
      - highlighted_spans: words in the text that match top features
      - reason_summary: short human-readable explanation
    """
    feature_names = np.array(vectorizer.get_feature_names_out())

    # Get the coefficient vector for the predicted class
    class_idx = list(model.classes_).index(predicted_label)
    coefs = model.coef_[class_idx]

    # Transform the input text
    text_features = vectorizer.transform([text])
    nonzero_indices = text_features.nonzero()[1]

    # Score each present feature by its TF-IDF weight * model coefficient
    feature_scores = []
    for idx in nonzero_indices:
        tfidf_weight = text_features[0, idx]
        coef_weight = coefs[idx]
        combined_score = tfidf_weight * coef_weight
        feature_scores.append((feature_names[idx], round(float(combined_score), 4)))

    # Sort by contribution (descending)
    feature_scores.sort(key=lambda x: x[1], reverse=True)
    top_tokens = feature_scores[:top_n]

    # Find highlighted spans in the original text
    text_lower = text.lower()
    highlighted = []
    for token, score in top_tokens:
        if token in text_lower:
            start = text_lower.find(token)
            highlighted.append({
                "token": token,
                "start": start,
                "end": start + len(token),
                "score": score,
            })

    # Generate reason summary
    reason_map = {
        "MNPI": "Message contains language suggesting sharing of material non-public information",
        "GUARANTEED_RETURN": "Message contains promises of guaranteed or risk-free returns",
        "COLLUSION": "Message suggests coordinated market manipulation or collusion",
        "PII_LEAKAGE": "Message contains or references sensitive client personal information",
        "AML_SUSPICIOUS": "Message contains language suggesting potential money laundering or structuring",
        "BENIGN": "No compliance risk detected",
    }

    top_words = ", ".join([f'"{t}"' for t, _ in top_tokens[:3]])
    reason_summary = reason_map.get(predicted_label, f"Flagged as {predicted_label}")
    if predicted_label != "BENIGN":
        reason_summary += f". Key indicators: {top_words}"

    return {
        "top_tokens": [{"token": t, "score": s} for t, s in top_tokens],
        "highlighted_spans": highlighted,
        "reason_summary": reason_summary,
    }
