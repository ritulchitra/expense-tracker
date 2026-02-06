from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.services.pending_expenses_service import create_pending_expense

router = APIRouter(prefix="/pending-expenses", tags=["pending-expenses"])


class CreatePendingExpenseRequest(BaseModel):
    pending_expense_uuid: UUID
    pending_project_uuid: UUID
    pending_paid_by_user_uuid: UUID
    pending_amount: int
    pending_expense_scope: str
    pending_payment_source: str
    pending_category: str | None = None
    pending_note: str | None = None


@router.post("/")
def create_pending_expense_api(
    payload: CreatePendingExpenseRequest,
    db: Session = Depends(get_db)
):
    try:
        expense = create_pending_expense(
            db=db,
            pending_expense_uuid=payload.pending_expense_uuid,
            pending_project_uuid=payload.pending_project_uuid,
            pending_paid_by_user_uuid=payload.pending_paid_by_user_uuid,
            pending_amount=payload.pending_amount,
            pending_expense_scope=payload.pending_expense_scope,
            pending_payment_source=payload.pending_payment_source,
            pending_category=payload.pending_category,
            pending_note=payload.pending_note
        )
        return expense

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
