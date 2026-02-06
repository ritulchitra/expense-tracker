from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class ProjectFundEntries(Base):
    __tablename__ = "project_fund_entries"

    fund_entry_uuid = Column(UUID(as_uuid=True), primary_key=True)
    fund_project_uuid = Column(UUID(as_uuid=True), nullable=False)
    fund_contributor_user_uuid = Column(UUID(as_uuid=True), nullable=False)
    fund_amount = Column(Integer, nullable=False)
    fund_created_timestamp = Column(DateTime, default=datetime.utcnow)
