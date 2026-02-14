from sqlalchemy import Column, DECIMAL, TEXT, VARCHAR, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    expense_id = Column(UUID(as_uuid=True), primary_key=True)

    expense_payer_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    co_space_id = Column(
        UUID(as_uuid=True),
        ForeignKey("co_spaces.co_space_id", ondelete="CASCADE"),
        nullable=True
    )

    expense_amount = Column(DECIMAL(15, 2), nullable=False)
    expense_message = Column(TEXT)

    expense_from_fund_type = Column(VARCHAR, nullable=False)
    expense_is_for_type = Column(VARCHAR, nullable=False)

    expense_related_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True
    )

    expense_status = Column(VARCHAR, nullable=False)

    expense_created_at = Column(TIMESTAMP, server_default=func.now())
    expense_updated_at = Column(TIMESTAMP, onupdate=func.now())
