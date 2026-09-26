from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import os

from app.database import engine, Base, SessionLocal
from app.models.contract import Contract
from app.models.user import User
from app.models.reminder import Reminder
from app.routers import pages, auth, contracts, calendar, reminders, escalations

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MARS Calendar - Contract Renewal Reminder System",
    description="Enterprise module for contract renewal timelines, milestone tracking, and automated escalations.",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files & Uploads
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(pages.router)
app.include_router(calendar.router)
app.include_router(contracts.router)
app.include_router(auth.router)
app.include_router(reminders.router)
app.include_router(escalations.router)


@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if contracts already seeded
        if db.query(Contract).count() == 0:
            initial_contracts = [
                Contract(
                    contract_number="AGT-ABC-2025-09",
                    name="ABC Vendor Contract",
                    category="Vendor",
                    description="Specialist vendor technology consulting, security infrastructure auditing, and SLA support.",
                    party_name="ABC Technologies Ltd",
                    party_contact="support@abctech.com",
                    value=145000.0,
                    currency="USD",
                    start_date=date(2025, 10, 1),
                    expiry_date=date(2026, 9, 30),
                    notice_period_days=30,
                    auto_renew=False,
                    status="Expiring Soon",
                    renewal_stage="Review",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="IT Infrastructure",
                    risk_level="High",
                ),
                Contract(
                    contract_number="LIC-MS-2024-88",
                    name="Microsoft Software Licence",
                    category="Software",
                    description="Enterprise 365 licensing, Azure tenant commitment, GitHub Enterprise seats, and Premier Support.",
                    party_name="Microsoft Corporation",
                    party_contact="enterprise-renewals@microsoft.com",
                    value=320000.0,
                    currency="USD",
                    start_date=date(2024, 1, 1),
                    expiry_date=date(2026, 12, 31),
                    notice_period_days=60,
                    auto_renew=True,
                    status="Active",
                    renewal_stage="Initiated",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="Cloud Engineering",
                    risk_level="Medium",
                ),
                Contract(
                    contract_number="LSE-HQ-2021-01",
                    name="Office Lease Agreement",
                    category="Lease",
                    description="Commercial headquarters lease for Floors 8-10 at One Enterprise Square.",
                    party_name="Horizon Commercial Properties LLC",
                    party_contact="leasing@horizonprop.com",
                    value=840000.0,
                    currency="USD",
                    start_date=date(2021, 10, 1),
                    expiry_date=date(2026, 10, 31),
                    notice_period_days=60,
                    auto_renew=False,
                    status="Expiring Soon",
                    renewal_stage="Notice Period",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="Facilities & Workplace",
                    risk_level="High",
                ),
                Contract(
                    contract_number="SRV-XYZ-2025-14",
                    name="XYZ Service Contract",
                    category="Service",
                    description="Managed NOC infrastructure operations, 24/7 tier 2 incident escalation, and hardware maintenance.",
                    party_name="XYZ Global Managed Services Inc",
                    party_contact="accounts@xyzglobal.com",
                    value=188000.0,
                    currency="USD",
                    start_date=date(2025, 3, 1),
                    expiry_date=date(2026, 10, 15),
                    notice_period_days=45,
                    auto_renew=False,
                    status="Under Review",
                    renewal_stage="Negotiation",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="IT Infrastructure",
                    risk_level="Medium",
                ),
                Contract(
                    contract_number="SRV-DEF-2024-99",
                    name="DEF Service Contract",
                    category="Service",
                    description="Mission-critical telecommunications backbone and dedicated dark fibre connectivity.",
                    party_name="DEF Telecom Infrastructure",
                    party_contact="noc-director@deftelecom.net",
                    value=210000.0,
                    currency="USD",
                    start_date=date(2024, 6, 1),
                    expiry_date=date(2026, 9, 28),
                    notice_period_days=30,
                    auto_renew=False,
                    status="Escalated",
                    renewal_stage="Escalation",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="Telecommunications",
                    risk_level="Critical",
                ),
                Contract(
                    contract_number="CLI-ACME-2025-02",
                    name="Client Agreement",
                    category="Client",
                    description="Master services agreement and SLA commitment with ACME Retail Global.",
                    party_name="ACME Retail Global Corporation",
                    party_contact="contracts@acmeretail.com",
                    value=520000.0,
                    currency="USD",
                    start_date=date(2025, 4, 1),
                    expiry_date=date(2026, 11, 30),
                    notice_period_days=30,
                    auto_renew=True,
                    status="Active",
                    renewal_stage="Signed",
                    owner_name="Anuja",
                    owner_email="anuja@enterprise.com",
                    department="Enterprise Sales",
                    risk_level="Low",
                ),
            ]
            db.add_all(initial_contracts)
            db.commit()

        # Seed default user if absent
        if db.query(User).count() == 0:
            user = User(
                email="anuja@enterprise.com",
                full_name="Anuja",
                role="Admin",
                department="Legal Operations & Procurement",
                hashed_password="admin_hashed_password_demo",
                is_active=True,
            )
            db.add(user)
            db.commit()
    finally:
        db.close()
