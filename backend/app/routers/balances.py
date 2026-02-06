from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.balance_service import calculate_project_balances

router = APIRouter(prefix="/balances", tags=["balances"])


@router.get("/{project_uuid}")
def project_balances(project_uuid, db: Session = Depends(get_db)):
    return calculate_project_balances(db, project_uuid)
