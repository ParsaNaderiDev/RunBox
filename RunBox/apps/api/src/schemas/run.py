from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class RunFile(BaseModel):
    name: str
    content: str


class RunCreate(BaseModel):
    language: str
    files: List[RunFile]
    build_cmd: Optional[str] = None
    run_cmd: Optional[str] = None
    env: dict[str, str] = Field(default_factory=dict)
    project_slug: Optional[str] = None


class Run(BaseModel):
    id: str
    status: str
    language: str
    started_at: datetime
    finished_at: Optional[datetime]
    runtime_ms: Optional[int]

    class Config:
        from_attributes = True


class RunResult(Run):
    output: str
    error: Optional[str] = None

    class Config:
        from_attributes = True
