from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.project_fund_service import get_project_fund_balance

router = APIRouter(prefix="/project-fund", tags=["project-fund"])


@router.get("/{project_uuid}")
def project_fund_balance(project_uuid, db: Session = Depends(get_db)):
    return {
        "project_uuid": project_uuid,
        "fund_balance": get_project_fund_balance(db, project_uuid)
    }
