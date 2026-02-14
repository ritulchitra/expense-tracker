from sqlalchemy import Column, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class UserFund(Base):
    __tablename__ = "user_funds"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )

    user_fund_total_amount = Column(DECIMAL(15, 2), default=0)
    user_fund_monthly_expense_total = Column(DECIMAL(15, 2), default=0)
    user_fund_yearly_expense_total = Column(DECIMAL(15, 2), default=0)
    user_fund_remaining_amount = Column(DECIMAL(15, 2), default=0)

    user_fund_updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
