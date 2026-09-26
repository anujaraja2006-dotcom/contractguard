from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class RenewalRecord(Base):
    __tablename__ = "renewal_records"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False)
    previous_expiry = Column(Date, nullable=False)
    new_expiry = Column(Date, nullable=False)
    renewal_cost = Column(Float, nullable=True)
    status = Column(String(50), default="Completed")
    notes = Column(Text, nullable=True)
    processed_by = Column(String(255), default="Anuja")
    timestamp = Column(DateTime, default=datetime.utcnow)

    contract = relationship("Contract", back_populates="renewals")
