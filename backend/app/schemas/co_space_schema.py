from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List
from decimal import Decimal


class CoSpaceCreate(BaseModel):
    co_space_name: str
    co_space_created_by_user_id: UUID


class CoSpaceResponse(BaseModel):
    co_space_id: UUID
    co_space_name: str
    co_space_created_by_user_id: UUID
    co_space_created_at: datetime

    class Config:
        from_attributes = True


class InviteMember(BaseModel):
    user_id: UUID


class CoSpaceMemberResponse(BaseModel):
    co_space_member_id: UUID
    co_space_id: UUID
    user_id: UUID
    co_space_member_status: str

    class Config:
        from_attributes = True


class CoSpaceFundCreate(BaseModel):
    user_id: UUID
    co_space_fund_total_amount: Decimal


class CoSpaceFundResponse(BaseModel):
    co_space_fund_id: UUID
    co_space_id: UUID
    user_id: UUID
    co_space_fund_total_amount: Decimal
    co_space_fund_monthly_expense_total: Decimal
    co_space_fund_yearly_expense_total: Decimal
    co_space_fund_remaining_amount: Decimal

    class Config:
        from_attributes = True
