from pydantic import BaseModel
from uuid import UUID


from datetime import datetime
from decimal import Decimal
from typing import Optional


class ApprovalAction(BaseModel):
    user_id: UUID


class PendingApprovalResponse(BaseModel):
    expense_id: UUID
    expense_payer_user_id: UUID
    co_space_id: Optional[UUID]
    expense_amount: Decimal
    expense_message: Optional[str]
    expense_created_at: datetime

    class Config:
        from_attributes = True
