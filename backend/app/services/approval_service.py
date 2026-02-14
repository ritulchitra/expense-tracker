from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP

from app.models.expense_model import Expense
from app.models.expense_approval_model import ExpenseApproval
from app.models.user_fund_model import UserFund
from app.models.co_space_fund_model import CoSpaceFund
from app.models.co_space_member_model import CoSpaceMember


# ============================================
# Approve Expense (Identity + Financial Safe)
# ============================================

def approve_expense(db: Session, expense_id, user_id):

    try:

        # Ensure expense exists
        expense = db.query(Expense).filter(
            Expense.expense_id == expense_id
        ).first()

        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        if expense.expense_status != "pending":
            raise HTTPException(
                status_code=400,
                detail="Expense is not pending approval"
            )

        # Ensure approval record exists for this user
        approval = db.query(ExpenseApproval).filter(
            ExpenseApproval.expense_id == expense_id,
            ExpenseApproval.user_id == user_id
        ).first()

        if not approval:
            raise HTTPException(
                status_code=404,
                detail="Approval record not found"
            )

        if approval.expense_approval_status != "pending":
            raise HTTPException(
                status_code=400,
                detail="Approval already processed"
            )

        # Mark approval
        approval.expense_approval_status = "approved"
        approval.expense_approval_responded_at = datetime.utcnow()

        # Check if any approvals still pending
        pending = db.query(ExpenseApproval).filter(
            ExpenseApproval.expense_id == expense_id,
            ExpenseApproval.expense_approval_status == "pending"
        ).first()

        if not pending:

            # ============================================
            # PERSONAL FUND DEDUCTION
            # ============================================

            if expense.expense_from_fund_type == "personal":

                fund = db.query(UserFund).filter(
                    UserFund.user_id == expense.expense_payer_user_id
                ).first()

                if not fund:
                    raise HTTPException(
                        status_code=404,
                        detail="User fund not found"
                    )

                if fund.user_fund_remaining_amount < expense.expense_amount:
                    raise HTTPException(
                        status_code=400,
                        detail="Insufficient personal funds"
                    )

                fund.user_fund_remaining_amount -= expense.expense_amount
                fund.user_fund_monthly_expense_total += expense.expense_amount
                fund.user_fund_yearly_expense_total += expense.expense_amount

            # ============================================
            # CO-SPACE FUND DEDUCTION
            # ============================================

            elif expense.expense_from_fund_type == "co_space":

                members = db.query(CoSpaceMember).filter(
                    CoSpaceMember.co_space_id == expense.co_space_id,
                    CoSpaceMember.co_space_member_status == "accepted"
                ).all()

                if not members:
                    raise HTTPException(
                        status_code=400,
                        detail="No accepted members in co-space"
                    )

                member_funds = []
                total_pool_remaining = Decimal("0.00")

                for member in members:
                    fund = db.query(CoSpaceFund).filter(
                        CoSpaceFund.co_space_id == expense.co_space_id,
                        CoSpaceFund.user_id == member.user_id
                    ).first()

                    if not fund:
                        raise HTTPException(
                            status_code=400,
                            detail="Member fund not initialized"
                        )

                    total_pool_remaining += fund.co_space_fund_remaining_amount
                    member_funds.append(fund)

                # Only block if TOTAL pool insufficient
                if total_pool_remaining < expense.expense_amount:
                    raise HTTPException(
                        status_code=400,
                        detail="Insufficient total co-space funds"
                    )

                total_members = len(member_funds)

                raw_split = expense.expense_amount / Decimal(total_members)

                rounded_split = raw_split.quantize(
                    Decimal("0.01"),
                    rounding=ROUND_HALF_UP
                )

                total_rounded = rounded_split * total_members
                remainder = expense.expense_amount - total_rounded

                # Deduct equal split (negative allowed)
                for fund in member_funds:
                    fund.co_space_fund_remaining_amount -= rounded_split
                    fund.co_space_fund_monthly_expense_total += rounded_split
                    fund.co_space_fund_yearly_expense_total += rounded_split

                # Adjust remainder to first member to preserve exact total
                if remainder != Decimal("0.00"):
                    member_funds[0].co_space_fund_remaining_amount -= remainder
                    member_funds[0].co_space_fund_monthly_expense_total += remainder
                    member_funds[0].co_space_fund_yearly_expense_total += remainder

            expense.expense_status = "approved"

        db.commit()
        db.refresh(approval)

        return approval

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Approval processing failed"
        )


# ============================================
# Reject Expense (Safe + Identity Enforced)
# ============================================

def reject_expense(db: Session, expense_id, user_id):

    try:

        expense = db.query(Expense).filter(
            Expense.expense_id == expense_id
        ).first()

        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        if expense.expense_status != "pending":
            raise HTTPException(
                status_code=400,
                detail="Expense is not pending approval"
            )

        approval = db.query(ExpenseApproval).filter(
            ExpenseApproval.expense_id == expense_id,
            ExpenseApproval.user_id == user_id
        ).first()

        if not approval:
            raise HTTPException(
                status_code=404,
                detail="Approval record not found"
            )

        if approval.expense_approval_status != "pending":
            raise HTTPException(
                status_code=400,
                detail="Approval already processed"
            )

        approval.expense_approval_status = "rejected"
        approval.expense_approval_responded_at = datetime.utcnow()

        expense.expense_status = "rejected"

        db.commit()
        db.refresh(approval)

        return approval

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Rejection processing failed"
        )


# ============================================
# Get Pending Approvals (Identity Enforced)
# ============================================

def get_pending_approvals(db: Session, user_id):

    approvals = db.query(ExpenseApproval).filter(
        ExpenseApproval.user_id == user_id,
        ExpenseApproval.expense_approval_status == "pending"
    ).all()

    pending_expenses = []

    for approval in approvals:
        expense = db.query(Expense).filter(
            Expense.expense_id == approval.expense_id,
            Expense.expense_status == "pending"
        ).first()

        if expense:
            pending_expenses.append(expense)

    return pending_expenses
