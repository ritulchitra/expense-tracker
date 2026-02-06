from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class PendingExpenses(Base):
    __tablename__ = "pending_expenses"

    pending_expense_uuid = Column(UUID(as_uuid=True), primary_key=True)
    pending_project_uuid = Column(UUID(as_uuid=True), nullable=False)
    pending_paid_by_user_uuid = Column(UUID(as_uuid=True), nullable=False)

    pending_amount = Column(Integer, nullable=False)

    pending_expense_scope = Column(String, nullable=False)
    pending_payment_source = Column(String, nullable=False)

    pending_category = Column(String)
    pending_note = Column(String)

    pending_created_timestamp = Column(DateTime, default=datetime.utcnow)
    pending_status = Column(String, default="pending")
