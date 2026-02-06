from sqlalchemy.orm import Session
from uuid import UUID
from app.models.pending_expenses import PendingExpenses


def create_pending_expense(
    db: Session,
    pending_expense_uuid: UUID,
    pending_project_uuid: UUID,
    pending_paid_by_user_uuid: UUID,
    pending_amount: int,
    pending_expense_scope: str,       # 'personal' | 'project'
    pending_payment_source: str,       # 'user_pocket' | 'project_fund'
    pending_category: str | None = None,
    pending_note: str | None = None
) -> PendingExpenses:

    # --- Hard validation (business critical) ---
    if pending_amount <= 0:
        raise ValueError("Expense amount must be greater than zero")

    if pending_expense_scope not in ("personal", "project"):
        raise ValueError("Invalid expense scope")

    if pending_payment_source not in ("user_pocket", "project_fund"):
        raise ValueError("Invalid payment source")

    # Rule: personal expense cannot be paid from project fund
    if pending_expense_scope == "personal" and pending_payment_source == "project_fund":
        raise ValueError("Personal expense cannot be paid from project fund")

    expense = PendingExpenses(
        pending_expense_uuid=pending_expense_uuid,
        pending_project_uuid=pending_project_uuid,
        pending_paid_by_user_uuid=pending_paid_by_user_uuid,
        pending_amount=pending_amount,
        pending_expense_scope=pending_expense_scope,
        pending_payment_source=pending_payment_source,
        pending_category=pending_category,
        pending_note=pending_note,
        pending_status="pending"
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense
