from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.services.users_service import create_user

router = APIRouter(prefix="/users", tags=["users"])


class CreateUserRequest(BaseModel):
    user_uuid: UUID
    user_name: str
    user_salary: int | None = None


@router.post("/")
def create_user_api(
    payload: CreateUserRequest,
    db: Session = Depends(get_db)
):
    user = create_user(
        db=db,
        user_uuid=payload.user_uuid,
        user_name=payload.user_name,
        user_salary=payload.user_salary
    )
    return user
