Deploy options
 - Option A (recommended): Render blueprint for API + Web + Postgres
 - Option B: One VPS with Docker Compose + Nginx (HTTP; add TLS with certbot)

Option A — Render
1) Push the repo to GitHub (history already cleaned). Ensure `render.yaml` exists at repo root.
2) In Render, click New > Blueprint and select your repo. Review and deploy.
   - Services:
     - runbox-api (Docker): FastAPI on port 8000
     - runbox-web (Node): Next.js 14 on port 3000
     - runbox-db: managed Postgres
   - Env vars provided by render.yaml:
     - API: RUNBOX_DATABASE_URL (from DB), RUNBOX_JWT_SECRET_KEY, RUNBOX_BACKEND_CORS_ORIGINS
     - Web: NEXT_PUBLIC_API_BASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET
3) After the first deploy:
   - Copy the actual API URL (runbox-api.onrender.com) into the Web env var `NEXT_PUBLIC_API_BASE_URL`.
   - Copy the actual Web URL (runbox-web.onrender.com) into API `RUNBOX_BACKEND_CORS_ORIGINS` (comma-separated) instead of `*`.
   - Redeploy both services.

Option B — VPS with Docker Compose
Prereqs: Docker + Docker Compose, a server with ports 80/443 open.

1) Copy the repo to the server.
2) From `RunBox/infra`, run:
   - `docker compose -f docker-compose.prod.yml pull` (first time, just pulls base images)
   - `export NEXT_PUBLIC_API_BASE_URL=http://<server-domain-or-ip>`
   - `export RUNBOX_CORS_ORIGINS=http://<server-domain-or-ip>`
   - `export NEXTAUTH_URL=http://<server-domain-or-ip>`
   - `docker compose -f docker-compose.prod.yml up -d --build`
3) Add TLS (optional but recommended):
   - Install certbot + nginx plugin on the host and issue a cert for your domain, then update Nginx to listen 443 with the cert files (or swap to a Caddy/Traefik setup).

Notes
 - The API image bundles Go/Node/Rust toolchains for the executor. Ensure the target has enough RAM/CPU (e.g., 1–2 vCPU, 1–2GB RAM minimum).
 - For production harden secrets: set strong values for `RUNBOX_JWT_SECRET_KEY`, `NEXTAUTH_SECRET`.
 - If/when object storage is used, configure `RUNBOX_MINIO_*` to point to a MinIO/S3 endpoint and set `RUNBOX_MINIO_SECURE=true` for HTTPS endpoints.

