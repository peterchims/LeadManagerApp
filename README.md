# Lead Manager

A simple lead management app: an Express + Prisma REST API backed by PostgreSQL, and a Next.js frontend to view and create leads.

## Architecture

```
LeadManagerApp/
├── backend/          Express API (TypeScript, Prisma, PostgreSQL)
│   ├── prisma/schema.prisma   Lead model + migrations
│   └── src/
│       ├── index.ts           App entry, middleware, error handling
│       ├── routes/leads.ts    GET /leads, POST /leads
│       ├── schemas/lead.ts    Zod input validation (shared status enum)
│       └── lib/prisma.ts      Singleton PrismaClient
├── frontend/         Next.js app (App Router, TypeScript, Tailwind)
│   └── src/
│       ├── app/page.tsx       Page composition
│       ├── components/        LeadForm, LeadTable, StatusBadge
│       ├── hooks/useLeads.ts  SWR data hook (fetch + optimistic create)
│       ├── lib/api.ts         Typed fetch client for the backend API
│       └── types/lead.ts      Shared Lead / LeadStatus types
└── docker-compose.yml         Postgres for local dev
```

The frontend never talks to Prisma/Postgres directly — all data access goes through the typed `leadsApi` client in `frontend/src/lib/api.ts`, which calls the Express API. This keeps the two apps independently deployable (see Deployment below).

## Prerequisites

- Node.js 20+
- A PostgreSQL instance — either:
  - Docker (`docker compose up -d`), or
  - A local Postgres install (`brew install postgresql@16`)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # adjust DATABASE_URL if not using docker-compose defaults
npm install
npm run prisma:migrate    # creates the leads table
npm run dev                # http://localhost:4000
```

If you're using the provided `docker-compose.yml`, start Postgres first from the repo root:

```bash
docker compose up -d
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

Open http://localhost:3000 — you should see the lead list and the "Add a new lead" form.

## API

| Method | Path      | Description                          |
|--------|-----------|---------------------------------------|
| GET    | `/leads`  | Returns all leads, newest first       |
| POST   | `/leads`  | Creates a lead. Body: `{ name, email, status? }` |
| GET    | `/health` | Health check                          |

`status` must be one of: `New`, `Engaged`, `Proposal Sent`, `Closed-Won`, `Closed-Lost` (defaults to `New`). `email` must be unique — a duplicate returns `409`.

**Example:**

```bash
curl -X POST http://localhost:4000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","status":"Engaged"}'
```

## Deployment

- **Frontend → Vercel**: import the `frontend/` directory as the project root, set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- **Backend → Railway/Render**: deploy the `backend/` directory, set `DATABASE_URL` (a managed Postgres add-on works well) and `CORS_ORIGIN` to your Vercel frontend URL. Run `npm run build && npm start`, and run `npx prisma migrate deploy` once against the production database.
