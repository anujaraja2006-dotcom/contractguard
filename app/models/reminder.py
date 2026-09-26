from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False)
    reminder_type = Column(String(50), nullable=False)  # 90-day, 60-day, 30-day, 14-day, 7-day, Expiry, Custom
    target_date = Column(Date, nullable=False, index=True)
    status = Column(String(50), default="Pending")  # Pending, Sent, Snoozed, Acknowledged
    channel = Column(String(50), default="Email + Slack")
    message = Column(String(500), nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contract = relationship("Contract", back_populates="reminders")
