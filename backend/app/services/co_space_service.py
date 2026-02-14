import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.co_space_model import CoSpace
from app.models.co_space_member_model import CoSpaceMember
from app.models.user_model import User
from app.models.co_space_fund_model import CoSpaceFund


# ============================================
# Create Co-Space
# ============================================

def create_co_space(db: Session, data):

    creator = db.query(User).filter(User.user_id == data.co_space_created_by_user_id).first()
    if not creator:
        raise HTTPException(status_code=404, detail="Creator user not found")

    co_space_id = uuid.uuid4()

    new_space = CoSpace(
        co_space_id=co_space_id,
        co_space_name=data.co_space_name,
        co_space_created_by_user_id=data.co_space_created_by_user_id
    )

    creator_member = CoSpaceMember(
        co_space_member_id=uuid.uuid4(),
        co_space_id=co_space_id,
        user_id=data.co_space_created_by_user_id,
        co_space_member_status="accepted"
    )

    db.add(new_space)
    db.add(creator_member)
    db.commit()
    db.refresh(new_space)

    return new_space


# ============================================
# Get User Co-Spaces
# ============================================

def get_user_co_spaces(db: Session, user_id):

    spaces = db.query(CoSpaceMember).filter(
        CoSpaceMember.user_id == user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).all()

    return spaces


# ============================================
# Invite Member
# ============================================

def invite_member(db: Session, co_space_id, user_id):

    member = CoSpaceMember(
        co_space_member_id=uuid.uuid4(),
        co_space_id=co_space_id,
        user_id=user_id,
        co_space_member_status="pending"
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


# ============================================
# Accept Invitation
# ============================================

def accept_invite(db: Session, co_space_id, user_id):

    member = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == user_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Invitation not found")

    member.co_space_member_status = "accepted"
    db.commit()
    db.refresh(member)

    return member


# ============================================
# Get Members
# ============================================

def get_members(db: Session, co_space_id):

    members = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).all()

    return members


# ============================================
# Add or Initialize Co-Space Fund (Per User)
# ============================================

def add_co_space_fund(db: Session, co_space_id, data):

    # Check membership and ensure accepted
    membership = db.query(CoSpaceMember).filter(
        CoSpaceMember.co_space_id == co_space_id,
        CoSpaceMember.user_id == data.user_id,
        CoSpaceMember.co_space_member_status == "accepted"
    ).first()

    if not membership:
        raise HTTPException(status_code=400, detail="User not an accepted member of this co-space")

    fund = db.query(CoSpaceFund).filter(
        CoSpaceFund.co_space_id == co_space_id,
        CoSpaceFund.user_id == data.user_id
    ).first()

    if fund:
        # Increase existing fund
        fund.co_space_fund_total_amount += data.co_space_fund_total_amount
        fund.co_space_fund_remaining_amount += data.co_space_fund_total_amount
    else:
        # Create new contribution record
        fund = CoSpaceFund(
            co_space_fund_id=uuid.uuid4(),
            co_space_id=co_space_id,
            user_id=data.user_id,
            co_space_fund_total_amount=data.co_space_fund_total_amount,
            co_space_fund_monthly_expense_total=0,
            co_space_fund_yearly_expense_total=0,
            co_space_fund_remaining_amount=data.co_space_fund_total_amount
        )
        db.add(fund)

    db.commit()
    db.refresh(fund)

    return fund


# ============================================
# Get All Co-Space Funds
# ============================================

def get_co_space_funds(db: Session, co_space_id):

    funds = db.query(CoSpaceFund).filter(
        CoSpaceFund.co_space_id == co_space_id
    ).all()

    return funds

