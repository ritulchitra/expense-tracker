from sqlalchemy import Column, String, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class CoSpace(Base):
    __tablename__ = "co_spaces"

    co_space_id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    co_space_name = Column(String, nullable=False)

    co_space_created_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    co_space_created_at = Column(TIMESTAMP, server_default=func.now())
    co_space_updated_at = Column(TIMESTAMP, onupdate=func.now())
