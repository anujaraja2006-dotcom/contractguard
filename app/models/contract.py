from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    contract_number = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(50), default="Vendor")  # Vendor, Client, Software, Lease, Employee, Service, Other
    description = Column(Text, nullable=True)
    party_name = Column(String(255), nullable=False)
    party_contact = Column(String(255), nullable=True)
    value = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    
    start_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False, index=True)
    notice_period_days = Column(Integer, default=30)
    auto_renew = Column(Boolean, default=False)
    
    status = Column(String(50), default="Active")  # Active, Expiring Soon, Expired, Renewed, Under Review, Escalated
    renewal_stage = Column(String(50), default="Review")
    owner_name = Column(String(255), default="Anuja")
    owner_email = Column(String(255), default="anuja@enterprise.com")
    department = Column(String(100), default="IT Infrastructure")
    risk_level = Column(String(50), default="Medium")  # Low, Medium, High, Critical
    file_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reminders = relationship("Reminder", back_populates="contract", cascade="all, delete-orphan")
    renewals = relationship("RenewalRecord", back_populates="contract", cascade="all, delete-orphan")
    escalations = relationship("Escalation", back_populates="contract", cascade="all, delete-orphan")
