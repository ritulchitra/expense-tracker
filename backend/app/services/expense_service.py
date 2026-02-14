import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.expense_model import Expense
from app.models.expense_approval_model import ExpenseApproval
from app.models.co_space_member_model import CoSpaceMember
from app.models.user_fund_model import UserFund
from decimal import Decimal


# ============================================
# Create Expense (Identity Enforced Version)
# ============================================

def create_expense(db: Session, data, payer_user_id):

    try:

        expense_id = uuid.uuid4()

        # ============================================
        # PERSONAL EXPENSE (Immediate Deduction)
        # ============================================

        if data.expense_from_fund_type == "personal":

            fund = db.query(UserFund).filter(
                UserFund.user_id == payer_user_id
            ).first()

            if not fund:
                raise HTTPException(status_code=404, detail="User fund not found")

            if fund.user_fund_remaining_amount < data.expense_amount:
                raise HTTPException(status_code=400, detail="Insufficient personal funds")

            # Deduct immediately
            fund.user_fund_remaining_amount -= data.expense_amount
            fund.user_fund_monthly_expense_total += data.expense_amount
            fund.user_fund_yearly_expense_total += data.expense_amount

            status = "approved"

        # ============================================
        # CO-SPACE EXPENSE (Requires Approval)
        # ============================================

        elif data.expense_from_fund_type == "co_space":

            if not data.co_space_id:
                raise HTTPException(status_code=400, detail="Co-space ID required")

            # 🔐 Enforce Membership
            membership = db.query(CoSpaceMember).filter(
                CoSpaceMember.co_space_id == data.co_space_id,
                CoSpaceMember.user_id == payer_user_id,
                CoSpaceMember.co_space_member_status == "accepted"
            ).first()

            if not membership:
                raise HTTPException(
                    status_code=403,
                    detail="You are not a member of this co-space"
                )

            status = "pending"

        else:
            raise HTTPException(status_code=400, detail="Invalid fund type")

        # ============================================
        # Create Expense Record
        # ============================================

        expense = Expense(
            expense_id=expense_id,
            expense_payer_user_id=payer_user_id,
            co_space_id=data.co_space_id,
            expense_amount=data.expense_amount,
            expense_message=data.expense_message,
            expense_from_fund_type=data.expense_from_fund_type,
            expense_is_for_type=data.expense_is_for_type,
            expense_related_user_id=data.expense_related_user_id,
            expense_status=status
        )

        db.add(expense)

        # ============================================
        # Create Approval Records (Co-space Only)
        # ============================================

        if data.expense_from_fund_type == "co_space":

            members = db.query(CoSpaceMember).filter(
                CoSpaceMember.co_space_id == data.co_space_id,
                CoSpaceMember.co_space_member_status == "accepted"
            ).all()

            for member in members:
                if member.user_id != payer_user_id:
                    approval = ExpenseApproval(
                        expense_approval_id=uuid.uuid4(),
                        expense_id=expense_id,
                        user_id=member.user_id,
                        expense_approval_status="pending"
                    )
                    db.add(approval)

        db.commit()
        db.refresh(expense)

        return expense

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Expense creation failed")
