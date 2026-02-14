from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional


# ============================
# Request Schema (Create User)
# ============================

class UserCreate(BaseModel):
    user_name: str
    user_email: EmailStr
    user_gender: Optional[str] = None
    user_age: Optional[int] = None


# ============================
# Request Schema (Update User)
# ============================

class UserUpdate(BaseModel):
    user_name: Optional[str] = None
    user_gender: Optional[str] = None
    user_age: Optional[int] = None
    user_is_active: Optional[bool] = None


# ============================
# Response Schema
# ============================

class UserResponse(BaseModel):
    user_id: UUID
    user_name: str
    user_email: EmailStr
    user_gender: Optional[str]
    user_age: Optional[int]
    user_is_active: bool
    user_created_at: Optional[datetime]
    user_updated_at: Optional[datetime]

    class Config:
        from_attributes = True
