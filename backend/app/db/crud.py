"""
CipherPulse — CRUD Operations
Database read/write helpers used by API routes.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import desc, text

from backend.app.db.models import CommunicationRaw, CommunicationScored, Review


# ─── Communications Raw ────────────────────────────────────────────────────

def create_raw_message(db: Session, **kwargs) -> CommunicationRaw:
    msg = CommunicationRaw(
        id=uuid.uuid4(),
        ingested_at=datetime.utcnow(),
        **kwargs,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_messages(db: Session, limit: int = 50, offset: int = 0) -> list[CommunicationRaw]:
    return (
        db.query(CommunicationRaw)
        .order_by(desc(CommunicationRaw.timestamp))
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_message_by_id(db: Session, raw_id: uuid.UUID) -> Optional[CommunicationRaw]:
    return db.query(CommunicationRaw).filter(CommunicationRaw.id == raw_id).first()


def count_messages(db: Session) -> int:
    return db.query(CommunicationRaw).count()


# ─── Communications Scored ──────────────────────────────────────────────────

def create_scored(db: Session, **kwargs) -> CommunicationScored:
    scored = CommunicationScored(
        id=uuid.uuid4(),
        scored_at=datetime.utcnow(),
        **kwargs,
    )
    db.add(scored)
    db.commit()
    db.refresh(scored)
    return scored


def get_alerts(db: Session, min_score: float = 60, limit: int = 50, offset: int = 0):
    """Return scored messages with risk_score >= min_score, joined with raw data."""
    results = (
        db.query(CommunicationRaw, CommunicationScored)
        .join(CommunicationScored, CommunicationScored.raw_id == CommunicationRaw.id)
        .filter(CommunicationScored.risk_score >= min_score)
        .order_by(desc(CommunicationScored.risk_score))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return results


def get_score_by_raw_id(db: Session, raw_id: uuid.UUID) -> Optional[CommunicationScored]:
    return db.query(CommunicationScored).filter(CommunicationScored.raw_id == raw_id).first()


def count_alerts(db: Session, min_score: float = 60) -> int:
    return (
        db.query(CommunicationScored)
        .filter(CommunicationScored.risk_score >= min_score)
        .count()
    )


# ─── Reviews ───────────────────────────────────────────────────────────────

def create_review(db: Session, **kwargs) -> Review:
    review = Review(
        id=uuid.uuid4(),
        reviewed_at=datetime.utcnow(),
        **kwargs,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_review_by_raw_id(db: Session, raw_id: uuid.UUID) -> Optional[Review]:
    return db.query(Review).filter(Review.raw_id == raw_id).first()


def update_review(db: Session, raw_id: uuid.UUID, **kwargs) -> Optional[Review]:
    review = get_review_by_raw_id(db, raw_id)
    if review:
        for key, value in kwargs.items():
            if hasattr(review, key):
                setattr(review, key, value)
        review.reviewed_at = datetime.utcnow()
        db.commit()
        db.refresh(review)
    return review


def get_reviews(db: Session, status: Optional[str] = None, limit: int = 50):
    q = db.query(Review)
    if status:
        q = q.filter(Review.review_status == status)
    return q.order_by(desc(Review.reviewed_at)).limit(limit).all()


# ─── Analytics helpers ──────────────────────────────────────────────────────

def get_stats(db: Session) -> dict:
    """Return summary statistics for the dashboard."""
    total = count_messages(db)
    total_alerts = count_alerts(db, min_score=60)
    high_alerts = count_alerts(db, min_score=80)

    reviewed = db.query(Review).count()
    true_pos = db.query(Review).filter(Review.feedback == "true_positive").count()
    false_pos = db.query(Review).filter(Review.feedback == "false_positive").count()

    return {
        "total_messages": total,
        "total_alerts": total_alerts,
        "high_risk_alerts": high_alerts,
        "reviewed": reviewed,
        "true_positives": true_pos,
        "false_positives": false_pos,
        "false_positive_rate": round(false_pos / max(reviewed, 1) * 100, 2),
    }
