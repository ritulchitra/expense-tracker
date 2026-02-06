from sqlalchemy.orm import Session
from app.models.expenses_final import ExpensesFinal
from app.models.project_members import ProjectMembers


def calculate_project_balances(
    db: Session,
    project_uuid
):
    members = (
        db.query(ProjectMembers)
        .filter(ProjectMembers.project_member_project_uuid == project_uuid)
        .all()
    )

    member_ids = [m.project_member_user_uuid for m in members]

    expenses = (
        db.query(ExpensesFinal)
        .filter(
            ExpensesFinal.final_project_uuid == project_uuid,
            ExpensesFinal.final_expense_scope == "project",
            ExpensesFinal.final_payment_source == "user_pocket"
        )
        .all()
    )

    total_expense = sum(e.final_amount for e in expenses)
    share_per_person = total_expense / len(member_ids)

    paid_map = {uid: 0 for uid in member_ids}

    for e in expenses:
        paid_map[e.final_paid_by_user_uuid] += e.final_amount

    balance = {}

    for uid in member_ids:
        balance[uid] = round(paid_map[uid] - share_per_person, 2)

    return {
        "total_expense": total_expense,
        "share_per_person": share_per_person,
        "balances": balance
    }
