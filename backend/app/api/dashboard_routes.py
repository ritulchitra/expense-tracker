from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.models.co_space_member_model import CoSpaceMember
from app.services import dashboard_service
from app.schemas.dashboard_schema import (
    UserDashboardResponse,
    CoSpaceDashboardResponse
)

router = APIRouter(tags=["Dashboard"])


# ============================================
# USER DASHBOARD (Token-Based Identity)
# ============================================

@router.get("/users/me/dashboard", response_model=UserDashboardResponse)
def user_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return dashboard_service.get_user_dashboard(db, current_user.user_id)


# ============================================
# CO-SPACE DASHBOARD (Membership Enforced)
# ============================================

@router.get("/co-spaces/{co_space_id}/dashboard", response_model=CoSpaceDashboardResponse)
def co_space_dashboard(
    co_space_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure current user is accepted member
    membership = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == current_user.user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this co-space"
        )

    return dashboard_service.get_co_space_dashboard(db, co_space_id)
