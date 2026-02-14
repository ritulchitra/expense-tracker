from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user_fund_model import UserFund
from app.models.expense_model import Expense
from app.models.expense_approval_model import ExpenseApproval
from app.models.co_space_fund_model import CoSpaceFund
from decimal import Decimal


# ============================================
# USER DASHBOARD
# ============================================

def get_user_dashboard(db: Session, user_id):

    fund = db.query(UserFund).filter(
        UserFund.user_id == user_id
    ).first()

    if not fund:
        return None

    recent_expenses = db.query(Expense).filter(
        Expense.expense_payer_user_id == user_id
    ).order_by(Expense.expense_created_at.desc()).limit(5).all()

    pending_count = db.query(ExpenseApproval).filter(
        ExpenseApproval.user_id == user_id,
        ExpenseApproval.expense_approval_status == "pending"
    ).count()

    return {
        "total_fund": fund.user_fund_total_amount,
        "remaining_fund": fund.user_fund_remaining_amount,
        "monthly_expense_total": fund.user_fund_monthly_expense_total,
        "yearly_expense_total": fund.user_fund_yearly_expense_total,
        "pending_approvals": pending_count,
        "recent_expenses": recent_expenses
    }


# ============================================
# CO-SPACE DASHBOARD
# ============================================

def get_co_space_dashboard(db: Session, co_space_id):

    funds = db.query(CoSpaceFund).filter(
        CoSpaceFund.co_space_id == co_space_id
    ).all()

    if not funds:
        return None

    total_contribution = Decimal("0.00")
    total_remaining = Decimal("0.00")
    total_spent = Decimal("0.00")

    members_summary = []

    for fund in funds:
        total_contribution += fund.co_space_fund_total_amount
        total_remaining += fund.co_space_fund_remaining_amount
        total_spent += fund.co_space_fund_yearly_expense_total

        members_summary.append({
            "user_id": fund.user_id,
            "total_contributed": fund.co_space_fund_total_amount,
            "remaining_amount": fund.co_space_fund_remaining_amount
        })

    pending_count = db.query(Expense).filter(
        Expense.co_space_id == co_space_id,
        Expense.expense_status == "pending"
    ).count()

    return {
        "total_pool_contribution": total_contribution,
        "total_pool_remaining": total_remaining,
        "total_expense_spent": total_spent,
        "pending_approvals": pending_count,
        "members": members_summary
    }
