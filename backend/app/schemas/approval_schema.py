from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional


# ============================================
# Approval Response (Approve / Reject)
# ============================================

class ExpenseApprovalResponse(BaseModel):
    expense_approval_id: UUID
    expense_id: UUID
    user_id: UUID
    expense_approval_status: str
    expense_approval_responded_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================
# Pending Approval Listing
# ============================================

class PendingApprovalResponse(BaseModel):
    expense_id: UUID
    expense_payer_user_id: UUID
    co_space_id: Optional[UUID]
    expense_amount: Decimal
    expense_message: Optional[str]
    expense_created_at: datetime

    class Config:
        from_attributes = True
