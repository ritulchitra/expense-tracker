from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class ExpenseApprovals(Base):
    __tablename__ = "expense_approvals"

    approval_uuid = Column(UUID(as_uuid=True), primary_key=True)
    approval_pending_expense_uuid = Column(UUID(as_uuid=True), nullable=False)
    approval_user_uuid = Column(UUID(as_uuid=True), nullable=False)
    approval_decision = Column(String, nullable=False)
    approval_timestamp = Column(DateTime, default=datetime.utcnow)

