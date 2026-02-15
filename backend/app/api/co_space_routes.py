from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.models.co_space_model import CoSpace
from app.models.co_space_member_model import CoSpaceMember
from app.services import co_space_service
from app.schemas.co_space_schema import (
    CoSpaceCreate,
    CoSpaceResponse,
    CoSpaceMemberResponse
)

router = APIRouter(prefix="/co-spaces", tags=["Co-Spaces"])


# ============================================
# CREATE CO-SPACE (Authenticated)
# ============================================

@router.post("", response_model=CoSpaceResponse)
def create_co_space(
    data: CoSpaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return co_space_service.create_co_space(
        db,
        data,
        current_user.user_id
    )


# ============================================
# GET MY CO-SPACES (Only Accepted)
# ============================================

@router.get("", response_model=list[CoSpaceResponse])
def get_my_co_spaces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return co_space_service.get_user_co_spaces(
        db,
        current_user.user_id
    )


# ============================================
# INVITE MEMBER (Admin Only)
# ============================================

@router.post("/{co_space_id}/invite")
def invite_member(
    co_space_id: UUID,
    invited_user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure current user is creator/admin
    co_space = db.query(CoSpace).filter(
        CoSpace.co_space_id == co_space_id
    ).first()

    if not co_space:
        raise HTTPException(status_code=404, detail="Co-space not found")

    if co_space.co_space_created_by_user_id != current_user.user_id:
        raise HTTPException(
            status_code=403,
            detail="Only co-space admin can invite members"
        )

    return co_space_service.invite_member(
        db,
        co_space_id,
        invited_user_id
    )


# ============================================
# ACCEPT INVITE (Only Invited User)
# ============================================

@router.post("/{co_space_id}/accept")
def accept_invite(
    co_space_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return co_space_service.accept_invite(
        db,
        co_space_id,
        current_user.user_id
    )


# ============================================
# VIEW MEMBERS (Accepted Members Only)
# ============================================

@router.get("/{co_space_id}/members", response_model=list[CoSpaceMemberResponse])
def get_members(
    co_space_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    membership = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == current_user.user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this co-space"
        )

    return co_space_service.get_members(db, co_space_id)
