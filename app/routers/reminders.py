from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.reminder import Reminder
from app.services.reminder_service import ReminderService

router = APIRouter(prefix="/api/reminders", tags=["Reminders"])


@router.get("/")
def list_reminders(db: Session = Depends(get_db)):
    return db.query(Reminder).order_by(Reminder.target_date.asc()).all()


@router.post("/{contract_id}/generate")
def generate_reminders(contract_id: int, db: Session = Depends(get_db)):
    from app.services.contract_service import ContractService
    contract = ContractService.get_by_id(db, contract_id)
    if not contract:
        return {"error": "Contract not found"}
    reminders = ReminderService.generate_milestone_reminders(db, contract)
    return {"message": f"Generated {len(reminders)} milestone reminders", "reminders": reminders}
