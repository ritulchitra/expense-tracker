from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.fund_schema import (
    UserFundCreate,
    UserFundUpdate,
    UserFundResponse
)
from app.services import fund_service

router = APIRouter(prefix="/users/{user_id}/fund", tags=["User Fund"])


@router.get("", response_model=UserFundResponse)
def get_fund(user_id: UUID, db: Session = Depends(get_db)):
    return fund_service.get_user_fund(db, user_id)


@router.post("", response_model=UserFundResponse)
def initialize_fund(user_id: UUID, fund_data: UserFundCreate, db: Session = Depends(get_db)):
    return fund_service.initialize_user_fund(db, user_id, fund_data)


@router.put("", response_model=UserFundResponse)
def update_fund(user_id: UUID, fund_data: UserFundUpdate, db: Session = Depends(get_db)):
    return fund_service.update_user_fund(db, user_id, fund_data)
