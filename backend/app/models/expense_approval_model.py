from sqlalchemy import Column, VARCHAR, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class ExpenseApproval(Base):
    __tablename__ = "expense_approvals"

    expense_approval_id = Column(UUID(as_uuid=True), primary_key=True)

    expense_id = Column(
        UUID(as_uuid=True),
        ForeignKey("expenses.expense_id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    expense_approval_status = Column(VARCHAR, nullable=False)

    expense_approval_responded_at = Column(TIMESTAMP, nullable=True)
