from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User


def get_current_user(db: Session = Depends(get_db)) -> User:
    # MVP default user session (Anuja - Admin)
    user = db.query(User).filter(User.email == "anuja@enterprise.com").first()
    if not user:
        user = User(
            email="anuja@enterprise.com",
            full_name="Anuja",
            role="Admin",
            department="Legal Operations & Procurement",
            hashed_password="hashed_demo_pw",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
