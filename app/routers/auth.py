from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserLogin, UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Default enterprise demo sign-in
        return {
            "access_token": "demo-jwt-token-contract-renewal",
            "token_type": "bearer",
            "user": {
                "name": "Anuja",
                "email": payload.email,
                "role": "Admin",
            },
        }
    return {
        "access_token": "demo-jwt-token-contract-renewal",
        "token_type": "bearer",
        "user": {
            "name": user.full_name,
            "email": user.email,
            "role": user.role,
        },
    }


@router.get("/me", response_model=UserOut)
def get_current_user_profile(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not initialized")
    return user
