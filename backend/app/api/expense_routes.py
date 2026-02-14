from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.expense_schema import ExpenseCreate, ExpenseResponse
from app.services import expense_service

router = APIRouter(prefix="/expenses", tags=["Expenses"])


# ============================================
# CREATE EXPENSE (Identity Enforced)
# ============================================

@router.post("", response_model=ExpenseResponse)
def create_expense(
    data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return expense_service.create_expense(
        db,
        data,
        current_user.user_id
    )
