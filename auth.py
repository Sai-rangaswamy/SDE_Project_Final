from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud.user import get_user_by_email, get_user_by_phone, create_user
from app.schemas import UserCreate, UserResponse

router = APIRouter()

@router.get("/me")
def read_users_me():
    # In a real app, you would verify the JWT here.
    return {"username": "current_user"}

@router.get("/migrate")
def migrate_db(db: Session = Depends(get_db)):
    from sqlalchemy import text
    try:
        db.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR UNIQUE;"))
        db.commit()
    except:
        db.rollback()
    try:
        db.execute(text("ALTER TABLE users ALTER COLUMN email DROP NOT NULL;"))
        db.commit()
    except:
        db.rollback()
    return {"status": "Migration complete"}

@router.get("/users/{role}")
def get_users_by_role(role: str, db: Session = Depends(get_db)):
    from app.models import User
    users = db.query(User).filter(User.role == role).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if user.email:
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    if user.phone:
        db_user_phone = get_user_by_phone(db, phone=user.phone)
        if db_user_phone:
            raise HTTPException(status_code=400, detail="Phone number already registered")
    
    if not user.email and not user.phone:
        raise HTTPException(status_code=400, detail="Must provide email or phone number")

    return create_user(db=db, user=user)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username will contain either the email or phone number
    identifier = form_data.username
    user = get_user_by_email(db, email=identifier)
    if not user:
        user = get_user_by_phone(db, phone=identifier)
        
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email/phone or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email or user.phone, "role": user.role.value}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value
        }
    }
