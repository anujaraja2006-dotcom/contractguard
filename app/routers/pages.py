from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.contract import Contract
from app.models.user import User
from app.services.calendar_service import CalendarService
from app.schemas.calendar import CalendarQuery

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
def index(request: Request):
    return RedirectResponse(url="/calendar")


@router.get("/calendar", response_class=HTMLResponse)
def get_calendar_page(
    request: Request,
    view: str = "Week",
    workspace: str = "all",
    category: str = "all",
    q: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = CalendarQuery(
        view_type=view,
        workspace_filter=workspace,
        category_filter=category,
        search_query=q if q else None,
    )
    events = CalendarService.get_events(db, query)
    contracts = db.query(Contract).all()

    workspace_counts = {
        "upcoming": 12,
        "expiring": 7,
        "expired": 3,
        "escalations": 2,
    }

    categories = [
        "Vendor",
        "Client",
        "Software",
        "Lease",
        "Employee",
        "Service",
        "Other",
    ]

    return templates.TemplateResponse(
        "calendar.html",
        {
            "request": request,
            "user": user,
            "view_type": view,
            "active_workspace": workspace,
            "active_category": category,
            "search_query": q,
            "workspace_counts": workspace_counts,
            "categories": categories,
            "events": events,
            "contracts": contracts,
            "current_month_name": "September 2026",
            "simulated_today": "2026-09-25",
        },
    )


@router.get("/dashboard", response_class=HTMLResponse)
def get_dashboard_page(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    contracts = db.query(Contract).all()
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": user,
            "contracts": contracts,
            "total_contracts": len(contracts),
            "upcoming_renewals": 12,
            "expiring_soon": 7,
            "expired": 3,
            "escalations": 2,
        },
    )


@router.get("/contracts", response_class=HTMLResponse)
def get_contracts_page(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    contracts = db.query(Contract).all()
    return templates.TemplateResponse(
        "contracts.html",
        {
            "request": request,
            "user": user,
            "contracts": contracts,
        },
    )


@router.get("/contracts/{contract_id}", response_class=HTMLResponse)
def get_contract_details_page(
    contract_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return templates.TemplateResponse(
        "contract_details.html",
        {
            "request": request,
            "user": user,
            "contract": contract,
        },
    )


@router.get("/login", response_class=HTMLResponse)
def get_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
