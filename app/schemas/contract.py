from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ContractBase(BaseModel):
    contract_number: str
    name: str
    category: str = "Vendor"  # Vendor, Client, Software, Lease, Employee, Service, Other
    description: Optional[str] = None
    party_name: str
    party_contact: Optional[str] = None
    value: float = 0.0
    currency: str = "USD"
    start_date: date
    expiry_date: date
    notice_period_days: int = 30
    auto_renew: bool = False
    status: str = "Active"
    renewal_stage: str = "Review"
    owner_name: str = "Anuja"
    owner_email: str = "anuja@enterprise.com"
    department: str = "IT Infrastructure"
    risk_level: str = "Medium"


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    party_name: Optional[str] = None
    value: Optional[float] = None
    expiry_date: Optional[date] = None
    notice_period_days: Optional[int] = None
    auto_renew: Optional[bool] = None
    status: Optional[str] = None
    renewal_stage: Optional[str] = None
    owner_name: Optional[str] = None
    risk_level: Optional[str] = None


class ContractOut(ContractBase):
    id: int
    created_at: datetime
    updated_at: datetime
    days_remaining: Optional[int] = None

    class Config:
        from_attributes = True
