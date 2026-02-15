import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException
from decimal import Decimal

from app.models.co_space_model import CoSpace
from app.models.co_space_member_model import CoSpaceMember
from app.models.user_model import User
from app.models.co_space_fund_model import CoSpaceFund


# ============================================
# Create Co-Space (Identity Enforced)
# ============================================

def create_co_space(db: Session, data, creator_user_id):

    creator = db.query(User).filter(
        User.user_id == creator_user_id
    ).first()

    if not creator:
        raise HTTPException(status_code=404, detail="Creator user not found")

    co_space_id = uuid.uuid4()

    new_space = CoSpace(
        co_space_id=co_space_id,
        co_space_name=data.co_space_name,
        co_space_created_by_user_id=creator_user_id
    )

    creator_member = CoSpaceMember(
        co_space_member_id=uuid.uuid4(),
        co_space_id=co_space_id,
        user_id=creator_user_id,
        co_space_member_status="accepted"
    )

    db.add(new_space)
    db.add(creator_member)
    db.commit()
    db.refresh(new_space)

    return new_space


# ============================================
# Get User Co-Spaces (Only Accepted)
# ============================================

def get_user_co_spaces(db: Session, user_id):

    memberships = db.query(CoSpaceMember).filter(
        CoSpaceMember.user_id == user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).all()

    co_space_ids = [m.co_space_id for m in memberships]

    spaces = db.query(CoSpace).filter(
        CoSpace.co_space_id.in_(co_space_ids)
    ).all()

    return spaces


# ============================================
# Invite Member (Admin Only - route enforces admin)
# ============================================

def invite_member(db: Session, co_space_id, invited_user_id):

    # Check user exists
    user = db.query(User).filter(
        User.user_id == invited_user_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent duplicate invites
    existing = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == invited_user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already invited or member"
        )

    member = CoSpaceMember(
        co_space_member_id=uuid.uuid4(),
        co_space_id=co_space_id,
        user_id=invited_user_id,
        co_space_member_status="pending"
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


# ============================================
# Accept Invitation (Only Invited User)
# ============================================

def accept_invite(db: Session, co_space_id, user_id):

    member = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == user_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Invitation not found")

    if member.co_space_member_status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Invitation already accepted"
        )

    member.co_space_member_status = "accepted"

    db.commit()
    db.refresh(member)

    return member


# ============================================
# Get Members (Accepted Only)
# ============================================

def get_members(db: Session, co_space_id):

    members = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).all()

    return members


# ============================================
# Add Co-Space Fund (Identity Enforced)
# ============================================

def add_co_space_fund(db: Session, co_space_id, user_id, amount):

    if amount <= Decimal("0"):
        raise HTTPException(
            status_code=400,
            detail="Contribution amount must be positive"
        )

    # Ensure membership
    membership = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not an accepted member of this co-space"
        )

    fund = db.query(CoSpaceFund).filter(
        CoSpaceFund.co_space_id == co_space_id,
        CoSpaceFund.user_id == user_id
    ).first()

    if fund:
        fund.co_space_fund_total_amount += amount
        fund.co_space_fund_remaining_amount += amount
    else:
        fund = CoSpaceFund(
            co_space_fund_id=uuid.uuid4(),
            co_space_id=co_space_id,
            user_id=user_id,
            co_space_fund_total_amount=amount,
            co_space_fund_monthly_expense_total=Decimal("0.00"),
            co_space_fund_yearly_expense_total=Decimal("0.00"),
            co_space_fund_remaining_amount=amount
        )
        db.add(fund)

    db.commit()
    db.refresh(fund)

    return fund


# ============================================
# Get All Co-Space Funds (Members Only)
# ============================================

def get_co_space_funds(db: Session, co_space_id, user_id):

    membership = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).first()

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to view this co-space"
        )

    funds = db.query(CoSpaceFund).filter(
        CoSpaceFund.co_space_id == co_space_id
    ).all()

    return funds
