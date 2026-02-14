from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import User
from app.core.security import hash_password, verify_password, create_access_token
import uuid


def signup(db: Session, data):

    existing_user = db.query(User).filter(
        User.user_email == data.user_email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        user_id=uuid.uuid4(),
        user_name=data.user_name,
        user_email=data.user_email,
        user_password=hash_password(data.user_password),
        user_is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        {"sub": str(new_user.user_id)}
    )

    return {"access_token": access_token}


def login(db: Session, data):

    user = db.query(User).filter(
        User.user_email == data.user_email
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(data.user_password, user.user_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(
        {"sub": str(user.user_id)}
    )

    return {"access_token": access_token}
