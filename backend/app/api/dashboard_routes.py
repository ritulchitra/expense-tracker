from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.services import dashboard_service
from app.schemas.dashboard_schema import (
    UserDashboardResponse,
    CoSpaceDashboardResponse
)

router = APIRouter(tags=["Dashboard"])


@router.get("/users/{user_id}/dashboard", response_model=UserDashboardResponse)
def user_dashboard(user_id: UUID, db: Session = Depends(get_db)):
    return dashboard_service.get_user_dashboard(db, user_id)


@router.get("/co-spaces/{co_space_id}/dashboard", response_model=CoSpaceDashboardResponse)
def co_space_dashboard(co_space_id: UUID, db: Session = Depends(get_db)):
    return dashboard_service.get_co_space_dashboard(db, co_space_id)
