from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class ProjectMembers(Base):
    __tablename__ = "project_members"

    project_member_project_uuid = Column(UUID(as_uuid=True), primary_key=True)
    project_member_user_uuid = Column(UUID(as_uuid=True), primary_key=True)
    project_member_joined_timestamp = Column(DateTime, default=datetime.utcnow)
