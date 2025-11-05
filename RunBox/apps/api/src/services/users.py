from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import uuid4

from ..schemas.user import User, UserCreate


@dataclass
class InMemoryUser:
    id: str
    email: str
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None


class UserService:
    def __init__(self) -> None:
        now = datetime.now(timezone.utc)
        self._users: Dict[str, InMemoryUser] = {
            "owner": InMemoryUser(
                id=str(uuid4()),
                email="owner@runbox.dev",
                role="owner",
                created_at=now,
                last_login=now,
            ),
            "admin": InMemoryUser(
                id=str(uuid4()),
                email="admin@runbox.dev",
                role="admin",
                created_at=now,
                last_login=now,
            ),
        }

    def list(self) -> List[User]:
        return [User.model_validate(vars(user)) for user in self._users.values()]

    def create(self, payload: UserCreate) -> User:
        user = InMemoryUser(
            id=str(uuid4()),
            email=payload.email,
            role=payload.role,
            created_at=datetime.now(timezone.utc),
            last_login=None,
        )
        self._users[user.id] = user
        return User.model_validate(vars(user))

    def delete(self, user_id: str) -> bool:
        return self._users.pop(user_id, None) is not None


user_service = UserService()
