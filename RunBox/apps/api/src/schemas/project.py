from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    language: str
    tags: List[str] = []
    cover_url: Optional[str] = None
    readme_md: Optional[str] = None
    build_cmd: Optional[str] = None
    run_cmd: Optional[str] = None
    status: str = "draft"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    tags: Optional[List[str]] = None
    cover_url: Optional[str] = None
    readme_md: Optional[str] = None
    build_cmd: Optional[str] = None
    run_cmd: Optional[str] = None
    status: Optional[str] = None


class Project(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

