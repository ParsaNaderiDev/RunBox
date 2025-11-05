from fastapi import APIRouter, HTTPException, status

from ..schemas.auth import LoginRequest, Token
from ..services.auth import auth_service


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest) -> Token:
    token = auth_service.authenticate(payload)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return token

