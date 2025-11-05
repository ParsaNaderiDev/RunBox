from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4

from jose import jwt
from passlib.context import CryptContext

from ..core.config import settings
from ..schemas.auth import LoginRequest, Token, User

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


class AuthService:
    """
    Minimal in-memory auth service.
    Replace with proper persistence and NextAuth adapter integration later.
    """

    def __init__(self) -> None:
        hashed_password = pwd_context.hash("runbox")
        self._users = {
            "owner@runbox.dev": User(id=str(uuid4()), email="owner@runbox.dev", role="owner", last_login=None)
        }
        self._passwords = {"owner@runbox.dev": hashed_password}

    def authenticate(self, payload: LoginRequest) -> Optional[Token]:
        user = self._users.get(payload.email)
        if not user:
            return None

        hashed = self._passwords[payload.email]
        if not pwd_context.verify(payload.password, hashed):
            return None

        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
        expire = datetime.now(timezone.utc) + expires_delta
        token = jwt.encode(
            {"sub": user.id, "exp": int(expire.timestamp())}, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
        )
        self._users[payload.email] = User(**user.model_dump(), last_login=datetime.now(timezone.utc))
        return Token(access_token=token, expires_at=expire)


auth_service = AuthService()
