from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.services import approval_service
from app.schemas.approval_schema import (
    ExpenseApprovalResponse,
    PendingApprovalResponse
)

router = APIRouter(prefix="/expenses", tags=["Approvals"])


# ============================================
# APPROVE EXPENSE
# ============================================

@router.post("/{expense_id}/approve", response_model=ExpenseApprovalResponse)
def approve_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return approval_service.approve_expense(
        db,
        expense_id,
        current_user.user_id
    )


# ============================================
# REJECT EXPENSE
# ============================================

@router.post("/{expense_id}/reject", response_model=ExpenseApprovalResponse)
def reject_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return approval_service.reject_expense(
        db,
        expense_id,
        current_user.user_id
    )


# ============================================
# GET MY PENDING APPROVALS
# ============================================

@router.get("/pending", response_model=list[PendingApprovalResponse])
def get_my_pending_approvals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return approval_service.get_pending_approvals(
        db,
        current_user.user_id
    )
