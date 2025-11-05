from fastapi import APIRouter, HTTPException, status

from ..schemas.project import Project, ProjectCreate, ProjectUpdate
from ..services.projects import project_service


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=list[Project])
def list_projects() -> list[Project]:
    return project_service.list()


@router.get("/{slug}", response_model=Project)
def get_project(slug: str) -> Project:
    project = project_service.get_by_slug(slug)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate) -> Project:
    return project_service.create(payload)


@router.put("/{slug}", response_model=Project)
def update_project(slug: str, payload: ProjectUpdate) -> Project:
    project = project_service.update(slug, payload)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(slug: str) -> None:
    deleted = project_service.delete(slug)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

