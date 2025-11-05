from __future__ import annotations

import json
import logging

from celery import Celery

from .config import settings
from .docker_runner import sandbox

logger = logging.getLogger(__name__)

celery_app = Celery(__name__, broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.update(task_default_queue=settings.queue_name)


@celery_app.task(name="runner.execute")
def execute_run(payload: dict) -> str:
    logger.info("Executing run %s", payload.get("id"))
    files = payload.get("files", [])
    build_cmd = payload.get("build_cmd")
    run_cmd = payload.get("run_cmd")
    language = payload.get("language", "python")

    output = sandbox.run(language=language, files=files, build_cmd=build_cmd, run_cmd=run_cmd)
    logger.info("Run %s finished", payload.get("id"))
    return json.dumps({"output": output})


if __name__ == "__main__":
    celery_app.worker_main()
