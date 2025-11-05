from fastapi import APIRouter, HTTPException, status

from ..schemas.user import User, UserCreate
from ..services.users import user_service

router = APIRouter(prefix="/admin/users", tags=["users"])


@router.get("/", response_model=list[User])
def list_users() -> list[User]:
    return user_service.list()


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate) -> User:
    return user_service.create(payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str) -> None:
    deleted = user_service.delete(user_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
