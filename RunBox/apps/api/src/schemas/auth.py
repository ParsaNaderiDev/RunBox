from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class TokenPayload(BaseModel):
    sub: str
    exp: int


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str
    email: EmailStr
    role: str
    last_login: Optional[datetime]

    class Config:
        from_attributes = True

