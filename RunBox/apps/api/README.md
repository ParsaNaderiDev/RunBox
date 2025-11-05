# RunBox API

FastAPI backend exposing REST and WebSocket endpoints for RunBox.

## Running locally

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/dev.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment

Copy `.env.example` to `.env` and adjust secrets. Key defaults include PostgreSQL, Redis, and MinIO connection strings used in docker-compose.

## Tests

```bash
pytest
```
