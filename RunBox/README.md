# RunBox Monorepo

RunBox is a full-stack platform that lets visitors explore curated projects and experiment in an authentic browser-based terminal that connects to isolated Docker sandboxes. The system is composed of a Next.js frontend, a FastAPI backend, and a Celery-powered runner service that orchestrates ephemeral containers.

## Structure

- `apps/web` — Next.js 14 frontend deployed on Vercel (playground, portfolio, admin dashboard)
- `apps/api` — FastAPI backend exposing REST and WebSocket endpoints
- `services/runner` — Celery worker that spins the sandbox containers
- `infra` — Docker Compose manifests, reverse proxy configuration, database migrations

## Getting Started

1. Install prerequisites:
   - Node.js 20+, pnpm 8+
   - Python 3.11+
   - Docker & Docker Compose
2. Install dependencies:
   ```bash
   pnpm install
   cd apps/api && pip install -r requirements/dev.txt
   ```
3. Copy `.env.example` files to `.env` and adjust secrets.
4. Start the stack:
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build
   ```

Refer to the per-app READMEs for detailed instructions.

