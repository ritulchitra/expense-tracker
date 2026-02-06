from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class Projects(Base):
    __tablename__ = "projects"

    project_uuid = Column(UUID(as_uuid=True), primary_key=True)
    project_name = Column(String, nullable=False)
    project_creator_uuid = Column(UUID(as_uuid=True), nullable=False)
    project_created_timestamp = Column(DateTime, default=datetime.utcnow)
