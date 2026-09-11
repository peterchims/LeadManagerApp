# Lead Manager

A lead management app: a hardened Express + Prisma REST API on PostgreSQL, and a Next.js dashboard to search, filter, and create leads. Backend and frontend are independently deployable — backend on Render, frontend on Netlify.

## Architecture

```
LeadManagerApp/
├── backend/                Express API (TypeScript, Prisma, PostgreSQL)
│   ├── prisma/schema.prisma      Lead model + migrations
│   └── src/
│       ├── app.ts                Express app: middleware, routes, error handling
│       ├── index.ts              Server entry: listen + graceful shutdown
│       ├── config/env.ts         Zod-validated environment config (fails fast)
│       ├── routes/leads.ts       GET /leads (filter/search), POST /leads
│       ├── routes/leads.test.ts  Vitest + Supertest route tests (mocked Prisma)
│       ├── schemas/lead.ts       Zod input validation, shared status enum
│       ├── errors/AppError.ts    Typed error classes (Validation/NotFound/Conflict)
│       ├── middleware/           asyncHandler, centralized errorHandler/404
│       └── lib/                  Singleton PrismaClient, Pino logger
├── frontend/                Next.js app (App Router, TypeScript, Tailwind v4)
│   └── src/
│       ├── app/page.tsx          Page composition
│       ├── components/           Header, StatsCards, Toolbar, LeadTable,
│       │                         AddLeadDialog (Radix), StatusBadge, ThemeToggle
│       ├── hooks/                useLeads (SWR + filters), useDebouncedValue
│       ├── lib/api.ts            Typed fetch client for the backend API
│       └── types/lead.ts         Shared Lead / LeadStatus types
├── render.yaml               Render Blueprint (backend + managed Postgres)
├── netlify.toml               Netlify build config (frontend)
└── docker-compose.yml         Postgres for local dev
```

The frontend never touches Prisma/Postgres directly — everything goes through the typed `leadsApi` client, which talks to the Express API over HTTP. That boundary is what makes hosting them on two different platforms straightforward.

## Features

- **Backend**: input validation (Zod), unique-email conflict handling, status/search filtering (`GET /leads?status=&q=`), structured JSON logging (Pino), security headers (Helmet), rate limiting, gzip compression, environment validation at boot, graceful shutdown, DB-aware health check, and a Vitest/Supertest test suite.
- **Frontend**: live search + status filter, sortable columns, summary stat cards, an accessible "Add lead" dialog (Radix UI) with inline field errors, toast notifications, loading skeletons, empty states, and light/dark theme support.

## Prerequisites

- Node.js 20+
- A PostgreSQL instance — either Docker (`docker compose up -d`) or a local Postgres install.

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # adjust DATABASE_URL if not using docker-compose defaults
npm install
npm run prisma:migrate    # creates the leads table
npm test                  # optional: run the route test suite
npm run dev                # http://localhost:4000
```

If using the provided `docker-compose.yml`, start Postgres first from the repo root: `docker compose up -d`.

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

Open http://localhost:3000.

## API

| Method | Path                        | Description                                   |
|--------|------------------------------|------------------------------------------------|
| GET    | `/leads`                    | List leads, newest first                       |
| GET    | `/leads?status=Engaged`     | Filter by status                                |
| GET    | `/leads?q=jane`              | Search by name/email (case-insensitive)         |
| POST   | `/leads`                    | Create a lead. Body: `{ name, email, status? }` |
| GET    | `/health`                   | Health check (pings the database)               |

`status` is one of: `New`, `Engaged`, `Proposal Sent`, `Closed-Won`, `Closed-Lost` (defaults to `New`). `email` must be unique.

**Error shape** (all non-2xx responses):

```json
{ "error": { "message": "...", "code": "VALIDATION_ERROR", "details": { "email": ["..."] } } }
```

**Example:**

```bash
curl -X POST http://localhost:4000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","status":"Engaged"}'
```

## Deployment

The apps are split intentionally: the backend is a stateful API talking to Postgres (Render), the frontend is a static/SSR client (Netlify). They communicate purely over HTTPS/CORS, so each redeploys independently.

### Backend → Render

**Option A — Blueprint (recommended):** In the Render dashboard, "New" → "Blueprint", point it at this repo. `render.yaml` provisions the web service (rooted at `backend/`) and a managed Postgres database, and wires `DATABASE_URL` automatically.

**Option B — Manual:**
1. New Web Service → root directory `backend`.
2. Build command: `npm install && npm run build`
3. Start command: `npm start` (run `npm run prisma:deploy` once via the Render shell, or set it as a pre-deploy command, before first boot)
4. Health check path: `/health`
5. Add a managed Postgres instance and set `DATABASE_URL` to its connection string.

Either way, after the Netlify site exists, set `CORS_ORIGIN` on the Render service to your Netlify URL (e.g. `https://your-app.netlify.app`) — comma-separate multiple origins if needed.

### Frontend → Netlify

1. New site from Git, pick this repo. `netlify.toml` sets the base directory to `frontend` and enables the official Next.js runtime — no extra config needed.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to your Render service URL (e.g. `https://lead-manager-api.onrender.com`).
3. Deploy. Netlify's Next.js plugin handles the App Router build automatically.

**Note:** Netlify deploy previews get random subdomains; `CORS_ORIGIN` only allowlists the origins you list explicitly, so previews won't be able to reach a production backend unless you add them too.
