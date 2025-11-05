from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
import logging
from typing import Dict, List
from uuid import uuid4

from ..schemas.run import RunResult, RunCreate
from .executor import sandbox

logger = logging.getLogger(__name__)


@dataclass
class InMemoryRun:
    id: str
    status: str
    language: str
    started_at: datetime
    finished_at: datetime | None = None
    runtime_ms: int | None = None
    files: List[dict] = field(default_factory=list)
    project_slug: str | None = None
    output: str = ""
    error: str | None = None


class RunService:
    """
    Development placeholder service that pretends to enqueue jobs on the runner queue.
    It returns synthetic run identifiers to unblock the frontend.
    """

    def __init__(self) -> None:
        self._runs: Dict[str, InMemoryRun] = {}

    def create(self, payload: RunCreate) -> RunResult:
        run_id = str(uuid4())
        run = InMemoryRun(
            id=run_id,
            status="queued",
            language=payload.language,
            started_at=datetime.now(timezone.utc),
            files=[file.model_dump() for file in payload.files],
            project_slug=payload.project_slug,
        )
        self._runs[run_id] = run

        execution = sandbox.run(
            language=payload.language,
            files=[file.model_dump() for file in payload.files],
            build_cmd=payload.build_cmd,
            run_cmd=payload.run_cmd,
        )

        run.finished_at = datetime.now(timezone.utc)
        run.runtime_ms = int((run.finished_at - run.started_at).total_seconds() * 1000)
        run.status = "completed" if execution.exit_code == 0 else "failed"
        run.output = execution.output
        run.error = execution.stderr if execution.exit_code != 0 else None
        self._runs[run_id] = run

        return RunResult.model_validate({**vars(run), "output": run.output, "error": run.error})

    def list_recent(self) -> List[RunResult]:
        sorted_runs = sorted(self._runs.values(), key=lambda run: run.started_at, reverse=True)
        return [RunResult.model_validate({**vars(run), "output": run.output, "error": run.error}) for run in sorted_runs[:50]]


run_service = RunService()
