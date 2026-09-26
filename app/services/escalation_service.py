from datetime import date
from typing import List
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.models.escalation import Escalation


class EscalationService:
    @staticmethod
    def check_and_trigger_escalations(db: Session, ref_date: date = date(2026, 9, 25)) -> List[Escalation]:
        """Automatically identify critical contracts within 14 days of expiry without renewal approval."""
        critical_contracts = db.query(Contract).filter(
            Contract.expiry_date <= (ref_date + date.resolution * 14 if hasattr(date, 'resolution') else ref_date),
            Contract.status != "Renewed",
        ).all()

        triggered = []
        for c in critical_contracts:
            existing = db.query(Escalation).filter(Escalation.contract_id == c.id, Escalation.status == "Open").first()
            if not existing:
                esc = Escalation(
                    contract_id=c.id,
                    level="Level 2",
                    trigger_reason=f"Notice period exceeded or expiry within 14 days without signed renewal. Owner: {c.owner_name}",
                    status="Open",
                    escalated_to="Legal Director & VP Finance",
                )
                db.add(esc)
                triggered.append(esc)
        if triggered:
            db.commit()
        return triggered

    @staticmethod
    def get_active_escalations(db: Session) -> List[Escalation]:
        return db.query(Escalation).filter(Escalation.status == "Open").all()
