from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractUpdate


class ContractService:
    @staticmethod
    def get_all(db: Session, category: Optional[str] = None, status: Optional[str] = None) -> List[Contract]:
        query = db.query(Contract)
        if category and category.lower() != "all":
            query = query.filter(Contract.category.ilike(f"%{category}%"))
        if status and status.lower() != "all":
            query = query.filter(Contract.status == status)
        return query.all()

    @staticmethod
    def get_by_id(db: Session, contract_id: int) -> Optional[Contract]:
        return db.query(Contract).filter(Contract.id == contract_id).first()

    @staticmethod
    def create(db: Session, data: ContractCreate) -> Contract:
        contract = Contract(**data.dict())
        db.add(contract)
        db.commit()
        db.refresh(contract)
        return contract

    @staticmethod
    def update(db: Session, contract_id: int, data: ContractUpdate) -> Optional[Contract]:
        contract = ContractService.get_by_id(db, contract_id)
        if not contract:
            return None
        for key, value in data.dict(exclude_unset=True).items():
            setattr(contract, key, value)
        db.commit()
        db.refresh(contract)
        return contract

    @staticmethod
    def delete(db: Session, contract_id: int) -> bool:
        contract = ContractService.get_by_id(db, contract_id)
        if not contract:
            return False
        db.delete(contract)
        db.commit()
        return True

    @staticmethod
    def compute_days_remaining(expiry_date: date, ref_date: Optional[date] = None) -> int:
        if ref_date is None:
            ref_date = date(2026, 9, 25)  # Reference enterprise date
        return (expiry_date - ref_date).days
