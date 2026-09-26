# Contract Renewal Reminder System — MARS Calendar Module

A professional enterprise web application module for contract renewal tracking, reminder scheduling, milestone monitoring, and escalation management.

---

## Architecture Overview

```
Contract-Renewal-Reminder-System/
    app/
        main.py                     # FastAPI entry point & initialization
        database.py                 # SQLite database & SQLAlchemy configuration
        dependencies.py             # Auth & DB dependency injection
        routers/
            pages.py                # Jinja2 template routes (/, /calendar, /dashboard)
            auth.py                 # Authentication API routes
            contracts.py            # Contract CRUD & document upload endpoints
            calendar.py             # Calendar events query & schedule generation
            reminders.py            # Reminder lifecycle management
            escalations.py          # SLA & escalation triggers
        models/
            user.py                 # User & Role schema
            contract.py             # Business contract definition
            reminder.py             # Notification schedule records
            renewal.py              # Renewal history records
            escalation.py           # Escalation tracking
        schemas/
            user.py                 # Pydantic schemas for auth
            contract.py             # Pydantic contract validation
            calendar.py             # Pydantic calendar query & events
        services/
            contract_service.py     # Business rules for contract deadlines
            calendar_service.py     # Grid activity mapping & color styling
            reminder_service.py     # Milestone notifications logic
            escalation_service.py   # Automated escalation triggers
    templates/
        calendar.html               # MARS Calendar primary view (Week/Month/Day/Year)
        dashboard.html              # Executive overview & KPIs
        contracts.html              # Contract registry
        contract_details.html       # Individual contract dossier
        login.html                  # Secure authentication portal
    static/
        css/
            style.css               # Shared layout & global design tokens
            calendar.css            # MARS Calendar styles & soft pastel cards
        js/
            calendar.js             # Interactive calendar timeline & filter engine
    uploads/                        # Contract agreement attachments
    requirements.txt                # Python dependencies
    README.md
```

---

## Getting Started (FastAPI)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Application
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Open in Browser
- MARS Calendar: `http://localhost:8000/calendar`
- Contract Dashboard: `http://localhost:8000/dashboard`
- API Documentation: `http://localhost:8000/docs`

---

## MARS Calendar Features

1. **Calendar-Only Sidebar**: Appears exclusively on the Calendar view:
   - Header: **MARS Calendar**
   - **MY WORKSPACE**: Upcoming Renewals (12), Expiring Soon (7), Expired (3), Escalations (2)
   - **CONTRACT CATEGORIES**: Vendor, Client, Software, Lease, Employee, Service, Other
   - User Profile Footer: Anuja, Role: Admin / Manager / User
2. **Top Navigation Toolbar**:
   - Navigation: `Today`, `< Previous`, `> Next`
   - Header: `September 2026`
   - Views: `Week` (default), `Month`, `Day`, `Year`
   - Actions: `Search`, `Refresh`, `Notifications`, `More options`
3. **Weekly Time-Grid**:
   - Day columns: `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`, `SUN`
   - Hourly vertical intervals: `8 AM` to `6 PM`
   - Soft pastel workflow event cards with contract name, event type, time, and owner
4. **Contract Details Panel**:
   - Real-time side panel / drawer with complete contract metadata, milestones, notice dates, and quick actions (View Contract, Quick Renew, Escalate)
