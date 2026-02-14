from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.co_space_schema import (
    CoSpaceCreate,
    CoSpaceResponse,
    InviteMember,
    CoSpaceMemberResponse
)
from app.services import co_space_service
from app.schemas.co_space_schema import CoSpaceFundCreate, CoSpaceFundResponse


router = APIRouter(prefix="/co-spaces", tags=["Co-Spaces"])


@router.post("", response_model=CoSpaceResponse)
def create_space(data: CoSpaceCreate, db: Session = Depends(get_db)):
    return co_space_service.create_co_space(db, data)


@router.get("/user/{user_id}")
def get_user_spaces(user_id: UUID, db: Session = Depends(get_db)):
    return co_space_service.get_user_co_spaces(db, user_id)


@router.post("/{co_space_id}/invite", response_model=CoSpaceMemberResponse)
def invite(co_space_id: UUID, data: InviteMember, db: Session = Depends(get_db)):
    return co_space_service.invite_member(db, co_space_id, data.user_id)


@router.post("/{co_space_id}/accept", response_model=CoSpaceMemberResponse)
def accept(co_space_id: UUID, data: InviteMember, db: Session = Depends(get_db)):
    return co_space_service.accept_invite(db, co_space_id, data.user_id)


@router.get("/{co_space_id}/members", response_model=list[CoSpaceMemberResponse])
def members(co_space_id: UUID, db: Session = Depends(get_db)):
    return co_space_service.get_members(db, co_space_id)

@router.post("/{co_space_id}/fund", response_model=CoSpaceFundResponse)
def add_fund(co_space_id: UUID, data: CoSpaceFundCreate, db: Session = Depends(get_db)):
    return co_space_service.add_co_space_fund(db, co_space_id, data)


@router.get("/{co_space_id}/fund", response_model=list[CoSpaceFundResponse])
def get_funds(co_space_id: UUID, db: Session = Depends(get_db)):
    return co_space_service.get_co_space_funds(db, co_space_id)

