from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.services.expense_approval_service import approve_pending_expense

router = APIRouter(prefix="/expense-approvals", tags=["expense-approvals"])


class ApproveExpenseRequest(BaseModel):
    approval_uuid: UUID
    pending_expense_uuid: UUID
    approval_user_uuid: UUID
    approval_decision: str


@router.post("/")
def approve_expense_api(
    payload: ApproveExpenseRequest,
    db: Session = Depends(get_db)
):
    try:
        approval = approve_pending_expense(
            db=db,
            approval_uuid=payload.approval_uuid,
            pending_expense_uuid=payload.pending_expense_uuid,
            approval_user_uuid=payload.approval_user_uuid,
            approval_decision=payload.approval_decision
        )
        return approval

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
