from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class CalendarEventOut(BaseModel):
    id: str
    title: str
    event_type: str  # expiry, renewal, notice_period, reminder_30, reminder_60, review, escalation
    date: str  # YYYY-MM-DD
    time: str  # e.g., "10:00 AM"
    end_time: Optional[str] = None  # e.g., "11:00 AM"
    contract_id: int
    contract_name: str
    contract_number: Optional[str] = None
    category: str
    party_name: str
    owner_name: str
    status: str
    days_remaining: int
    priority: str  # low, medium, high, critical
    color_family: str  # green, orange, yellow, red, blue, purple
    description: Optional[str] = None
    requires_escalation: bool = False


class CalendarQuery(BaseModel):
    view_type: str = "Week"  # Month, Week, Day, Year
    year: int = 2026
    month: int = 9
    day: int = 25
    workspace_filter: Optional[str] = "all"  # all, upcoming, expiring, expired, escalations
    category_filter: Optional[str] = "all"  # Vendor, Client, Software, Lease, Employee, Service, Other
    search_query: Optional[str] = None


class CalendarEventCreate(BaseModel):
    title: str
    event_type: str
    date: str
    time: str
    end_time: Optional[str] = None
    contract_id: int
    owner_name: str = "Anuja"
    notes: Optional[str] = None
