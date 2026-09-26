from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.escalation import Escalation
from app.services.escalation_service import EscalationService

router = APIRouter(prefix="/api/escalations", tags=["Escalations"])


@router.get("/")
def list_escalations(db: Session = Depends(get_db)):
    return EscalationService.get_active_escalations(db)


@router.post("/trigger-check")
def trigger_escalation_audit(db: Session = Depends(get_db)):
    triggered = EscalationService.check_and_trigger_escalations(db)
    return {
        "message": f"Escalation audit complete. {len(triggered)} critical contracts flagged for executive review.",
        "escalations": triggered,
    }
