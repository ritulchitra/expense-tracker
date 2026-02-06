from sqlalchemy.orm import Session
from uuid import UUID
from app.models.pending_expenses import PendingExpenses
from app.models.expense_approvals import ExpenseApprovals
from app.models.expenses_final import ExpensesFinal


def finalize_pending_expense(
    db: Session,
    final_expense_uuid: UUID,
    pending_expense_uuid: UUID
):
    pending_expense = (
        db.query(PendingExpenses)
        .filter(PendingExpenses.pending_expense_uuid == pending_expense_uuid)
        .first()
    )

    if not pending_expense:
        raise ValueError("Pending expense not found")

    if pending_expense.pending_status != "pending":
        raise ValueError("Pending expense already finalized or rejected")

    approvals = (
        db.query(ExpenseApprovals)
        .filter(ExpenseApprovals.approval_pending_expense_uuid == pending_expense_uuid)
        .all()
    )

    if not approvals:
        raise ValueError("No approvals found for this expense")

    if any(a.approval_decision == "rejected" for a in approvals):
        pending_expense.pending_status = "rejected"
        db.commit()
        raise ValueError("Expense was rejected")

    # --- FINALIZE ---
    final_expense = ExpensesFinal(
        final_expense_uuid=final_expense_uuid,
        final_project_uuid=pending_expense.pending_project_uuid,
        final_paid_by_user_uuid=pending_expense.pending_paid_by_user_uuid,
        final_amount=pending_expense.pending_amount,
        final_expense_scope=pending_expense.pending_expense_scope,
        final_payment_source=pending_expense.pending_payment_source,
        final_category=pending_expense.pending_category,
        final_note=pending_expense.pending_note
    )

    pending_expense.pending_status = "approved"

    db.add(final_expense)
    db.commit()
    db.refresh(final_expense)

    return final_expense
