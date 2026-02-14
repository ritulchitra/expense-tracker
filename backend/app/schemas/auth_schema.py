from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    user_name: str
    user_email: EmailStr
    user_password: str


class LoginRequest(BaseModel):
    user_email: EmailStr
    user_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
