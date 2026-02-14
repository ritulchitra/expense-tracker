from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from typing import List
from datetime import datetime


class ExpenseSummary(BaseModel):
    expense_id: UUID
    expense_amount: Decimal
    expense_message: str | None
    expense_created_at: datetime

    class Config:
        from_attributes = True


class UserDashboardResponse(BaseModel):
    total_fund: Decimal
    remaining_fund: Decimal
    monthly_expense_total: Decimal
    yearly_expense_total: Decimal
    pending_approvals: int
    recent_expenses: List[ExpenseSummary]


class CoSpaceMemberSummary(BaseModel):
    user_id: UUID
    total_contributed: Decimal
    remaining_amount: Decimal


class CoSpaceDashboardResponse(BaseModel):
    total_pool_contribution: Decimal
    total_pool_remaining: Decimal
    total_expense_spent: Decimal
    pending_approvals: int
    members: List[CoSpaceMemberSummary]
