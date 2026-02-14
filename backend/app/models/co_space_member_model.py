from sqlalchemy import Column, String, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class CoSpaceMember(Base):
    __tablename__ = "co_space_members"

    co_space_member_id = Column(UUID(as_uuid=True), primary_key=True)

    co_space_id = Column(
        UUID(as_uuid=True),
        ForeignKey("co_spaces.co_space_id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    co_space_member_status = Column(String, nullable=False)
    co_space_member_joined_at = Column(TIMESTAMP, server_default=func.now())
    co_space_member_updated_at = Column(TIMESTAMP, onupdate=func.now())
