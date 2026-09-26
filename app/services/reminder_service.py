from datetime import date, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.models.reminder import Reminder


class ReminderService:
    @staticmethod
    def generate_milestone_reminders(db: Session, contract: Contract) -> List[Reminder]:
        """Automatically create reminders for 90, 60, 30, 14, 7 days before expiry."""
        intervals = [
            (90, "90-day", "Quarterly renewal strategy evaluation"),
            (60, "60-day", "Notice period deadline approaching"),
            (30, "30-day", "Contract renewal decision required"),
            (14, "14-day", "Approval sign-off urgently needed"),
            (7, "7-day", "Final week before expiration"),
        ]
        created = []
        for days, r_type, note in intervals:
            target = contract.expiry_date - timedelta(days=days)
            rem = Reminder(
                contract_id=contract.id,
                reminder_type=r_type,
                target_date=target,
                status="Pending",
                channel="Email + Slack",
                message=f"{contract.name}: {note}. Expiration: {contract.expiry_date}",
            )
            db.add(rem)
            created.append(rem)
        db.commit()
        return created

    @staticmethod
    def get_upcoming_for_calendar(db: Session, limit: int = 20) -> List[Reminder]:
        return db.query(Reminder).order_by(Reminder.target_date.asc()).limit(limit).all()
