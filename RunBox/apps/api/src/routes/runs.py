from fastapi import APIRouter, status

from ..schemas.run import RunResult, RunCreate
from ..services.runs import run_service


router = APIRouter(prefix="/runs", tags=["runs"])


@router.get("/", response_model=list[RunResult])
def list_runs() -> list[RunResult]:
    return run_service.list_recent()


@router.post("/", response_model=RunResult, status_code=status.HTTP_200_OK)
def create_run(payload: RunCreate) -> RunResult:
    return run_service.create(payload)
