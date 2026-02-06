from sqlalchemy.orm import Session
from uuid import UUID
from app.models.expense_approvals import ExpenseApprovals
from app.models.pending_expenses import PendingExpenses
from app.models.project_members import ProjectMembers


def approve_pending_expense(
    db: Session,
    approval_uuid: UUID,
    pending_expense_uuid: UUID,
    approval_user_uuid: UUID,
    approval_decision: str   # 'approved' | 'rejected'
):
    if approval_decision not in ("approved", "rejected"):
        raise ValueError("Invalid approval decision")

    pending_expense = (
        db.query(PendingExpenses)
        .filter(PendingExpenses.pending_expense_uuid == pending_expense_uuid)
        .first()
    )

    if not pending_expense:
        raise ValueError("Pending expense not found")

    if pending_expense.pending_paid_by_user_uuid == approval_user_uuid:
        raise ValueError("User cannot approve their own expense")

    # Check if user is project member
    is_member = (
        db.query(ProjectMembers)
        .filter(
            ProjectMembers.project_member_project_uuid == pending_expense.pending_project_uuid,
            ProjectMembers.project_member_user_uuid == approval_user_uuid
        )
        .first()
    )

    if not is_member:
        raise ValueError("User is not a member of this project")

    # Prevent duplicate approval
    existing = (
        db.query(ExpenseApprovals)
        .filter(
            ExpenseApprovals.approval_pending_expense_uuid == pending_expense_uuid,
            ExpenseApprovals.approval_user_uuid == approval_user_uuid
        )
        .first()
    )

    if existing:
        raise ValueError("User has already approved/rejected this expense")

    approval = ExpenseApprovals(
        approval_uuid=approval_uuid,
        approval_pending_expense_uuid=pending_expense_uuid,
        approval_user_uuid=approval_user_uuid,
        approval_decision=approval_decision
    )

    db.add(approval)
    db.commit()
    db.refresh(approval)

    return approval
