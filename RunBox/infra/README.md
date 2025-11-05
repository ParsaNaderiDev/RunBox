# Infrastructure

This folder holds local development and deployment configuration for the RunBox stack.

## Local development

1. Copy env templates:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   cp services/runner/.env.example services/runner/.env
   ```
2. Launch dependencies:
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build
   ```
3. Access services:
   - Frontend: http://localhost:3000
   - API (FastAPI docs): http://localhost:8000/api/docs
   - MinIO console: http://localhost:9001 (user/pass in env file)

The `web` container mounts the repository so edits on the host trigger hot reloads.
