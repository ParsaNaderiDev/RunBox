# RunBox Web

Next.js 14 frontend for the RunBox playground, portfolio, and admin dashboard.

## Development

```bash
cd apps/web
pnpm install
pnpm dev
```

Environment variables live in `.env.local`. Copy from `.env.example` to get started.

## Scripts

- `pnpm dev` — start local dev server
- `pnpm build` — production build (used by Vercel)
- `pnpm lint` — run Next.js linting

## Notes

- Monaco editor and xterm.js are loaded with dynamic imports and wired to stubbed API handlers.
- When the FastAPI backend is online, update `NEXT_PUBLIC_API_BASE_URL` to point at it and remove the stubbed `/api/runs` route handler.

