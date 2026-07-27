"""
CipherPulse — SQLAlchemy ORM Models
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, Boolean, Float, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class CommunicationRaw(Base):
    __tablename__ = "communications_raw"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(String(50), nullable=False, default="simulated")
    timestamp = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    sender_id = Column(String(100))
    sender_role = Column(String(100))
    team = Column(String(100))
    channel_id = Column(String(100))
    message_text = Column(Text, nullable=False)
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String(255))
    ingested_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    # Relationships
    scores = relationship("CommunicationScored", back_populates="raw", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="raw", cascade="all, delete-orphan")


class CommunicationScored(Base):
    __tablename__ = "communications_scored"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    raw_id = Column(UUID(as_uuid=True), ForeignKey("communications_raw.id", ondelete="CASCADE"), nullable=False)
    risk_score = Column(Float, nullable=False)
    labels = Column(JSONB, nullable=False, default=list)
    explanation = Column(JSONB, nullable=False, default=dict)
    model_version = Column(String(50), nullable=False, default="v1-tfidf-lr")
    scored_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    # Relationships
    raw = relationship("CommunicationRaw", back_populates="scores")

    __table_args__ = (
        CheckConstraint("risk_score >= 0 AND risk_score <= 100", name="ck_risk_score_range"),
    )


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    raw_id = Column(UUID(as_uuid=True), ForeignKey("communications_raw.id", ondelete="CASCADE"), nullable=False)
    review_status = Column(String(30), nullable=False, default="open")
    reviewer = Column(String(100))
    feedback = Column(String(30))
    notes = Column(Text)
    reviewed_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    # Relationships
    raw = relationship("CommunicationRaw", back_populates="reviews")
