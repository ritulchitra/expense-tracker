from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.approval_schema import ApprovalAction
from app.services import approval_service
from app.schemas.approval_schema import PendingApprovalResponse


router = APIRouter(prefix="/expenses", tags=["Approvals"])


@router.post("/{expense_id}/approve")
def approve(expense_id: UUID, data: ApprovalAction, db: Session = Depends(get_db)):
    return approval_service.approve_expense(db, expense_id, data.user_id)


@router.post("/{expense_id}/reject")
def reject(expense_id: UUID, data: ApprovalAction, db: Session = Depends(get_db)):
    return approval_service.reject_expense(db, expense_id, data.user_id)


@router.get("/users/{user_id}/pending-approvals", response_model=list[PendingApprovalResponse])
def pending_approvals(user_id: UUID, db: Session = Depends(get_db)):
    return approval_service.get_pending_approvals(db, user_id)

