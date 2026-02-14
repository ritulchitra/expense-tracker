from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


# ============================================
# POST /users
# ============================================

@router.post("", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user_data)


# ============================================
# GET /users/{user_id}
# ============================================

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(db, user_id)


# ============================================
# PUT /users/{user_id}
# ============================================

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    return user_service.update_user(db, user_id, user_data)


# ============================================
# PATCH /users/{user_id}/deactivate
# ============================================

@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(user_id: UUID, db: Session = Depends(get_db)):
    return user_service.deactivate_user(db, user_id)
