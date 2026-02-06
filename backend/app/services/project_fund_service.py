from sqlalchemy.orm import Session
from app.models.project_fund_entries import ProjectFundEntries
from app.models.expenses_final import ExpensesFinal


def get_project_fund_balance(
    db: Session,
    project_uuid
) -> int:
    fund_added = (
        db.query(ProjectFundEntries)
        .filter(ProjectFundEntries.fund_project_uuid == project_uuid)
        .all()
    )

    total_added = sum(f.fund_amount for f in fund_added)

    fund_spent = (
        db.query(ExpensesFinal)
        .filter(
            ExpensesFinal.final_project_uuid == project_uuid,
            ExpensesFinal.final_payment_source == "project_fund"
        )
        .all()
    )

    total_spent = sum(e.final_amount for e in fund_spent)

    return total_added - total_spent
