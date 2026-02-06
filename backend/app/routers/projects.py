from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.services.projects_service import (
    create_project,
    add_member_to_project
)

router = APIRouter(prefix="/projects", tags=["projects"])


class CreateProjectRequest(BaseModel):
    project_uuid: UUID
    project_name: str
    project_creator_uuid: UUID


class AddMemberRequest(BaseModel):
    project_uuid: UUID
    user_uuid: UUID


@router.post("/")
def create_project_api(
    payload: CreateProjectRequest,
    db: Session = Depends(get_db)
):
    project = create_project(
        db=db,
        project_uuid=payload.project_uuid,
        project_name=payload.project_name,
        project_creator_uuid=payload.project_creator_uuid
    )
    return project


@router.post("/add-member")
def add_member_api(
    payload: AddMemberRequest,
    db: Session = Depends(get_db)
):
    member = add_member_to_project(
        db=db,
        project_uuid=payload.project_uuid,
        user_uuid=payload.user_uuid
    )
    return member
