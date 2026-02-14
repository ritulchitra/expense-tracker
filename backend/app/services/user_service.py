import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import User
from app.models.user_fund_model import UserFund
from app.schemas.user_schema import UserCreate, UserUpdate


# ============================================
# Create User (with automatic fund creation)
# ============================================

def create_user(db: Session, user_data: UserCreate):

    # Check if email already exists
    existing_user = db.query(User).filter(User.user_email == user_data.user_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    try:
        # Generate UUID (Backend responsibility)
        new_user_id = uuid.uuid4()

        # Create user
        new_user = User(
            user_id=new_user_id,
            user_name=user_data.user_name,
            user_email=user_data.user_email,
            user_gender=user_data.user_gender,
            user_age=user_data.user_age,
            user_is_active=True
        )

        # Create user fund with zero values
        new_user_fund = UserFund(
            user_id=new_user_id,
            user_fund_total_amount=0,
            user_fund_monthly_expense_total=0,
            user_fund_yearly_expense_total=0,
            user_fund_remaining_amount=0
        )

        # Add both to session
        db.add(new_user)
        db.add(new_user_fund)

        # Single commit for atomic transaction
        db.commit()

        # Refresh user object
        db.refresh(new_user)

        return new_user

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="User creation failed")


# ============================================
# Get User by ID
# ============================================

def get_user_by_id(db: Session, user_id: uuid.UUID):

    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ============================================
# Update User
# ============================================

def update_user(db: Session, user_id: uuid.UUID, user_data: UserUpdate):

    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


# ============================================
# Deactivate User
# ============================================

def deactivate_user(db: Session, user_id: uuid.UUID):

    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.user_is_active = False

    db.commit()
    db.refresh(user)

    return user
