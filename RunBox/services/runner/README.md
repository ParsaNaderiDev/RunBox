# RunBox Runner Service

Celery worker that receives sandbox jobs, launches Docker containers, and streams output.

## Local development

```bash
cd services/runner
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
celery -A src.worker.celery_app worker --loglevel=info
```

Update `.env` for Redis connection and sandbox resource limits.
