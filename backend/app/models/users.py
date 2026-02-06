from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.models.base import Base

class Users(Base):
    __tablename__ = "users"

    user_uuid = Column(UUID(as_uuid=True), primary_key=True)
    user_name = Column(String, nullable=False)
    user_salary = Column(Integer)
    user_created_timestamp = Column(DateTime, default=datetime.utcnow)
