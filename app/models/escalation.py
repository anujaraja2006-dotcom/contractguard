from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False)
    level = Column(String(50), default="Level 1")  # Level 1 (Owner), Level 2 (Manager), Level 3 (VP/Legal)
    trigger_reason = Column(String(255), nullable=False)
    status = Column(String(50), default="Open")  # Open, Under Review, Resolved
    escalated_to = Column(String(255), default="Department Head")
    resolution_notes = Column(Text, nullable=True)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    contract = relationship("Contract", back_populates="escalations")
