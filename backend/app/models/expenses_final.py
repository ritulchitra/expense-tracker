from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class ExpensesFinal(Base):
    __tablename__ = "expenses_final"

    final_expense_uuid = Column(UUID(as_uuid=True), primary_key=True)

    final_project_uuid = Column(UUID(as_uuid=True), nullable=False)
    final_paid_by_user_uuid = Column(UUID(as_uuid=True), nullable=False)

    final_amount = Column(Integer, nullable=False)

    final_expense_scope = Column(String, nullable=False)
    final_payment_source = Column(String, nullable=False)

    final_category = Column(String)
    final_note = Column(String)

    final_approved_timestamp = Column(DateTime, default=datetime.utcnow)
