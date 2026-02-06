from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel

from app.core.database import get_db
from app.services.finalize_expense_service import finalize_pending_expense

router = APIRouter(prefix="/finalize-expense", tags=["finalize-expense"])


class FinalizeExpenseRequest(BaseModel):
    final_expense_uuid: UUID
    pending_expense_uuid: UUID


@router.post("/")
def finalize_expense_api(
    payload: FinalizeExpenseRequest,
    db: Session = Depends(get_db)
):
    try:
        expense = finalize_pending_expense(
            db=db,
            final_expense_uuid=payload.final_expense_uuid,
            pending_expense_uuid=payload.pending_expense_uuid
        )
        return expense

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
