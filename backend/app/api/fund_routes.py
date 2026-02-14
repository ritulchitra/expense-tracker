from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.services import fund_service
from app.schemas.fund_schema import UserFundCreate, UserFundResponse

router = APIRouter(tags=["User Fund"])


# ============================================
# GET CURRENT USER FUND
# ============================================

@router.get("/users/me/fund", response_model=UserFundResponse)
def get_my_fund(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return fund_service.get_user_fund(db, current_user.user_id)


# ============================================
# INITIALIZE FUND
# ============================================

@router.post("/users/me/fund", response_model=UserFundResponse)
def create_my_fund(
    data: UserFundCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return fund_service.create_user_fund(
        db,
        current_user.user_id,
        data
    )


# ============================================
# UPDATE FUND
# ============================================

@router.put("/users/me/fund", response_model=UserFundResponse)
def update_my_fund(
    data: UserFundCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return fund_service.update_user_fund(
        db,
        current_user.user_id,
        data
    )
