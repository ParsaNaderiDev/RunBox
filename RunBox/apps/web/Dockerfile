# syntax=docker/dockerfile:1
FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter @runbox/web --prod --no-frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @runbox/web build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
RUN pnpm install --filter @runbox/web --prod --no-frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "--filter", "@runbox/web", "start"]
