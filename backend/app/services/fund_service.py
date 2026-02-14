from sqlalchemy.orm import Session
from fastapi import HTTPException
from decimal import Decimal

from app.models.user_model import User
from app.models.user_fund_model import UserFund
from app.schemas.fund_schema import UserFundCreate, UserFundUpdate


# ============================================
# GET User Fund
# ============================================

def get_user_fund(db: Session, user_id):

    fund = db.query(UserFund).filter(UserFund.user_id == user_id).first()

    if not fund:
        raise HTTPException(status_code=404, detail="User fund not found")

    return fund


# ============================================
# POST Initialize or Add Fund
# ============================================

def initialize_user_fund(db: Session, user_id, fund_data: UserFundCreate):

    fund = db.query(UserFund).filter(UserFund.user_id == user_id).first()

    if not fund:
        raise HTTPException(status_code=404, detail="User fund not found")

    if fund.user_fund_total_amount > 0:
        raise HTTPException(status_code=400, detail="User fund already initialized")

    fund.user_fund_total_amount = fund_data.user_fund_total_amount
    fund.user_fund_remaining_amount = fund_data.user_fund_total_amount

    db.commit()
    db.refresh(fund)

    return fund


# ============================================
# PUT Update Fund Amount
# ============================================

def update_user_fund(db: Session, user_id, fund_data: UserFundUpdate):

    fund = db.query(UserFund).filter(UserFund.user_id == user_id).first()

    if not fund:
        raise HTTPException(status_code=404, detail="User fund not found")

    difference = fund_data.user_fund_total_amount - fund.user_fund_total_amount

    fund.user_fund_total_amount = fund_data.user_fund_total_amount
    fund.user_fund_remaining_amount += difference

    if fund.user_fund_remaining_amount < 0:
        raise HTTPException(status_code=400, detail="Updated fund causes negative remaining amount")

    db.commit()
    db.refresh(fund)

    return fund
