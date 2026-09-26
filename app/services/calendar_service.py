from datetime import date, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.contract import Contract
from app.schemas.calendar import CalendarEventOut, CalendarQuery


class CalendarService:
    @staticmethod
    def get_events(db: Session, query: CalendarQuery) -> List[CalendarEventOut]:
        contracts = db.query(Contract).all()
        events: List[CalendarEventOut] = []

        # Reference week starts on 2026-09-21 (Monday) to 2026-09-27 (Sunday)
        # We synthesize milestone contract activities for the calendar grid
        for c in contracts:
            days_rem = (c.expiry_date - date(2026, 9, 25)).days
            
            # Match contract-specific calendar milestones
            if "ABC" in c.name or "Vendor" in c.name:
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-review",
                        title=f"{c.name} • Contract Review",
                        event_type="review",
                        date="2026-09-21",  # Monday
                        time="10:00 AM",
                        end_time="11:00 AM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="medium",
                        color_family="purple",  # PURPLE: Review / Meeting
                        description="Quarterly vendor review meeting to assess SLA metrics and renegotiate terms.",
                        requires_escalation=False,
                    )
                )
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-approval",
                        title=f"{c.name} • Renewal Approval",
                        event_type="renewal",
                        date="2026-09-25",  # Friday
                        time="1:00 PM",
                        end_time="2:00 PM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="medium",
                        color_family="blue",  # BLUE: Renewed / Approved
                        description="Final sign-off by VP of Engineering and Finance Committee.",
                        requires_escalation=False,
                    )
                )

            elif "Microsoft" in c.name or "Software" in c.name:
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-rem30",
                        title=f"{c.name} • 30-Day Renewal Reminder",
                        event_type="reminder_30",
                        date="2026-09-22",  # Tuesday
                        time="11:00 AM",
                        end_time="12:00 PM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="high",
                        color_family="orange",  # ORANGE: Renewal approaching
                        description="Enterprise license true-up assessment and seat usage audit before 30-day window expires.",
                        requires_escalation=False,
                    )
                )

            elif "Lease" in c.name or "Office" in c.name:
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-notice",
                        title=f"{c.name} • Notice Period Deadline",
                        event_type="notice_period",
                        date="2026-09-23",  # Wednesday
                        time="2:00 PM",
                        end_time="3:00 PM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="high",
                        color_family="yellow",  # YELLOW: Notice period
                        description="Mandatory 60-day formal non-renewal or option exercise notice delivery cutoff.",
                        requires_escalation=False,
                    )
                )

            elif "XYZ" in c.name or "Service" in c.name:
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-meeting",
                        title=f"{c.name} • Renewal Meeting",
                        event_type="review",
                        date="2026-09-24",  # Thursday
                        time="3:00 PM",
                        end_time="4:00 PM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="medium",
                        color_family="purple",  # PURPLE: Review / Meeting
                        description="Joint stakeholder session with vendor account directors to align next term deliverables.",
                        requires_escalation=False,
                    )
                )

            elif "DEF" in c.name or c.risk_level == "Critical":
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-escalation",
                        title=f"{c.name} • Escalation Deadline",
                        event_type="escalation",
                        date="2026-09-25",  # Friday
                        time="9:00 AM",
                        end_time="10:00 AM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status="Escalated",
                        days_remaining=days_rem,
                        priority="critical",
                        color_family="red",  # RED: Expired / Critical / Escalation
                        description="Contract at immediate risk of termination without management intervention.",
                        requires_escalation=True,
                    )
                )

            elif c.status == "Active":
                events.append(
                    CalendarEventOut(
                        id=f"evt-{c.id}-status",
                        title=f"{c.name} • Vendor Follow-up",
                        event_type="renewal",
                        date="2026-09-25",  # Friday
                        time="4:00 PM",
                        end_time="5:00 PM",
                        contract_id=c.id,
                        contract_name=c.name,
                        contract_number=c.contract_number,
                        category=c.category,
                        party_name=c.party_name,
                        owner_name=c.owner_name or "Anuja",
                        status=c.status,
                        days_remaining=days_rem,
                        priority="low",
                        color_family="green",  # GREEN: Active / Normal
                        description="Routine quarterly touchpoint and compliance tracking.",
                        requires_escalation=False,
                    )
                )

        # Apply Query Filters
        filtered = events

        # Workspace Filter
        if query.workspace_filter and query.workspace_filter != "all":
            wf = query.workspace_filter.lower()
            if wf == "upcoming":
                filtered = [e for e in filtered if e.event_type in ("reminder_30", "review", "renewal")]
            elif wf == "expiring":
                filtered = [e for e in filtered if e.days_remaining <= 30 or e.event_type == "expiry"]
            elif wf == "expired":
                filtered = [e for e in filtered if e.color_family == "red" or e.status == "Expired"]
            elif wf == "escalations":
                filtered = [e for e in filtered if e.requires_escalation or e.event_type == "escalation"]

        # Category Filter
        if query.category_filter and query.category_filter != "all":
            filtered = [e for e in filtered if query.category_filter.lower() in e.category.lower()]

        # Search Query
        if query.search_query:
            sq = query.search_query.lower()
            filtered = [
                e for e in filtered
                if sq in e.contract_name.lower() or sq in e.title.lower() or sq in e.owner_name.lower() or sq in e.party_name.lower()
            ]

        return filtered
