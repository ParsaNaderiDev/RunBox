from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

from ..schemas.project import Project, ProjectCreate, ProjectUpdate


@dataclass
class InMemoryProject:
    id: str
    slug: str
    title: str
    description: str
    language: str
    tags: List[str] = field(default_factory=list)
    cover_url: Optional[str] = None
    readme_md: Optional[str] = None
    build_cmd: Optional[str] = None
    run_cmd: Optional[str] = None
    status: str = "draft"
    created_at: str = "2024-03-01T00:00:00Z"
    updated_at: str = "2024-03-01T00:00:00Z"


class ProjectService:
    """
    Development placeholder service storing projects in-memory.
    Replace with real database interactions once migrations land.
    """

    def __init__(self) -> None:
        self._projects: Dict[str, InMemoryProject] = {
            "realtime-chatbot": InMemoryProject(
                id="1",
                slug="realtime-chatbot",
                title="Realtime Chatbot",
                description="LangChain-powered chatbot streaming responses via WebSocket.",
                language="python",
                tags=["ai", "websocket", "langchain"],
                cover_url="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80",
                status="published",
            )
        }

    def list(self) -> List[Project]:
        return [Project.model_validate(vars(project)) for project in self._projects.values()]

    def get_by_slug(self, slug: str) -> Optional[Project]:
        project = self._projects.get(slug)
        if not project:
            return None
        return Project.model_validate(vars(project))

    def create(self, payload: ProjectCreate) -> Project:
        project = InMemoryProject(
            id=str(len(self._projects) + 1),
            slug=payload.slug,
            title=payload.title,
            description=payload.description,
            language=payload.language,
            tags=payload.tags,
            cover_url=payload.cover_url,
            readme_md=payload.readme_md,
            build_cmd=payload.build_cmd,
            run_cmd=payload.run_cmd,
            status=payload.status,
        )
        self._projects[project.slug] = project
        return Project.model_validate(vars(project))

    def update(self, slug: str, payload: ProjectUpdate) -> Optional[Project]:
        project = self._projects.get(slug)
        if not project:
            return None

        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(project, key, value)
        self._projects[slug] = project
        return Project.model_validate(vars(project))

    def delete(self, slug: str) -> bool:
        return self._projects.pop(slug, None) is not None


project_service = ProjectService()

