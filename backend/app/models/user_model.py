from sqlalchemy import Column, String, Integer, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    user_email = Column(String, unique=True, nullable=False)
    user_gender = Column(String)
    user_age = Column(Integer)
    user_is_active = Column(Boolean, default=True)
    user_created_at = Column(TIMESTAMP, server_default=func.now())
    user_updated_at = Column(TIMESTAMP, onupdate=func.now())
