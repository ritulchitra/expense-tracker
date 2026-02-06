from sqlalchemy.orm import Session
from uuid import UUID
from app.models.projects import Projects
from app.models.project_members import ProjectMembers

def create_project(
    db: Session,
    project_uuid: UUID,
    project_name: str,
    project_creator_uuid: UUID
) -> Projects:
    project = Projects(
        project_uuid=project_uuid,
        project_name=project_name,
        project_creator_uuid=project_creator_uuid
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def add_member_to_project(
    db: Session,
    project_uuid: UUID,
    user_uuid: UUID
) -> ProjectMembers:
    member = ProjectMembers(
        project_member_project_uuid=project_uuid,
        project_member_user_uuid=user_uuid
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member
