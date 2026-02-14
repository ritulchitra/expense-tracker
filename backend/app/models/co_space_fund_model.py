from sqlalchemy import Column, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class CoSpaceFund(Base):
    __tablename__ = "co_space_funds"

    co_space_fund_id = Column(UUID(as_uuid=True), primary_key=True)

    co_space_id = Column(
        UUID(as_uuid=True),
        ForeignKey("co_spaces.co_space_id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    co_space_fund_total_amount = Column(DECIMAL(15, 2), default=0)
    co_space_fund_monthly_expense_total = Column(DECIMAL(15, 2), default=0)
    co_space_fund_yearly_expense_total = Column(DECIMAL(15, 2), default=0)
    co_space_fund_remaining_amount = Column(DECIMAL(15, 2), default=0)

    co_space_fund_updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
