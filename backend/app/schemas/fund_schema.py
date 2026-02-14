from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime


# ============================
# Request Schema (Initialize or Add Fund)
# ============================

class UserFundCreate(BaseModel):
    user_fund_total_amount: Decimal


# ============================
# Request Schema (Update Fund)
# ============================

class UserFundUpdate(BaseModel):
    user_fund_total_amount: Decimal


# ============================
# Response Schema
# ============================

class UserFundResponse(BaseModel):
    user_id: UUID
    user_fund_total_amount: Decimal
    user_fund_monthly_expense_total: Decimal
    user_fund_yearly_expense_total: Decimal
    user_fund_remaining_amount: Decimal
    user_fund_updated_at: datetime

    class Config:
        from_attributes = True
