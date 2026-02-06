from sqlalchemy.orm import Session
from uuid import UUID
from app.models.users import Users

def create_user(
    db: Session,
    user_uuid: UUID,
    user_name: str,
    user_salary: int | None = None
) -> Users:
    user = Users(
        user_uuid=user_uuid,
        user_name=user_name,
        user_salary=user_salary
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
