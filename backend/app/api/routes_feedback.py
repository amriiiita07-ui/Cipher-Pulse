"""
CipherPulse — /feedback endpoint
Human-in-the-loop review submission.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db import crud

import uuid as uuid_mod

router = APIRouter(prefix="/api", tags=["feedback"])


class FeedbackRequest(BaseModel):
    raw_id: str
    review_status: str = "open"  # open | dismissed | escalated | confirmed
    feedback: Optional[str] = None  # true_positive | false_positive | needs_more_info
    reviewer: Optional[str] = "compliance-officer"
    notes: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    raw_id: str
    review_status: str
    feedback: Optional[str]
    reviewer: Optional[str]
    notes: Optional[str]
    reviewed_at: str


@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    """Submit or update a review for a flagged message."""
    try:
        raw_uuid = uuid_mod.UUID(req.raw_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid raw_id format")

    # Check message exists
    msg = crud.get_message_by_id(db, raw_uuid)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    # Check if review already exists → update it
    existing = crud.get_review_by_raw_id(db, raw_uuid)
    if existing:
        review = crud.update_review(
            db, raw_uuid,
            review_status=req.review_status,
            feedback=req.feedback,
            reviewer=req.reviewer,
            notes=req.notes,
        )
    else:
        review = crud.create_review(
            db,
            raw_id=raw_uuid,
            review_status=req.review_status,
            feedback=req.feedback,
            reviewer=req.reviewer,
            notes=req.notes,
        )

    return FeedbackResponse(
        id=str(review.id),
        raw_id=str(review.raw_id),
        review_status=review.review_status,
        feedback=review.feedback,
        reviewer=review.reviewer,
        notes=review.notes,
        reviewed_at=review.reviewed_at.isoformat(),
    )


@router.get("/reviews")
def list_reviews(
    status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """List all reviews, optionally filtered by status."""
    reviews = crud.get_reviews(db, status=status, limit=limit)
    return [
        {
            "id": str(r.id),
            "raw_id": str(r.raw_id),
            "review_status": r.review_status,
            "feedback": r.feedback,
            "reviewer": r.reviewer,
            "notes": r.notes,
            "reviewed_at": r.reviewed_at.isoformat(),
        }
        for r in reviews
    ]
