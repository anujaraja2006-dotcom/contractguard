from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.calendar import CalendarEventOut, CalendarQuery, CalendarEventCreate
from app.services.calendar_service import CalendarService

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])


@router.get("/events", response_model=List[CalendarEventOut])
def get_calendar_events(
    view_type: str = Query("Week", description="Month, Week, Day, Year"),
    workspace_filter: Optional[str] = Query("all", description="all, upcoming, expiring, expired, escalations"),
    category_filter: Optional[str] = Query("all", description="Vendor, Client, Software, Lease, Employee, Service, Other"),
    search_query: Optional[str] = Query(None, description="Free-text contract/activity search"),
    db: Session = Depends(get_db),
):
    query = CalendarQuery(
        view_type=view_type,
        workspace_filter=workspace_filter,
        category_filter=category_filter,
        search_query=search_query,
    )
    return CalendarService.get_events(db, query)


@router.post("/events")
def add_calendar_event(payload: CalendarEventCreate, db: Session = Depends(get_db)):
    return {
        "status": "success",
        "message": f"Calendar event '{payload.title}' scheduled for {payload.date} at {payload.time}",
        "event": payload,
    }
