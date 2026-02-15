from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from typing import Optional


class ExpenseCreate(BaseModel):
    co_space_id: Optional[UUID] = None
    expense_amount: Decimal
    expense_message: Optional[str] = None
    expense_from_fund_type: str
    expense_is_for_type: str
    expense_related_user_id: Optional[UUID] = None


class ExpenseResponse(BaseModel):
    expense_id: UUID
    expense_payer_user_id: UUID
    co_space_id: Optional[UUID]
    expense_amount: Decimal
    expense_status: str

    class Config:
        from_attributes = True
