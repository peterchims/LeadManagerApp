# Lead Manager

A lead management app with authenticated, multi-user access: a hardened Express + Prisma REST API on PostgreSQL, and a Next.js dashboard to search, filter, and create leads behind a login. Backend and frontend are independently deployable — backend on Render, frontend on Netlify.

## Demo account

The dashboard sits behind a login by design (see [Why authentication](#why-authentication) below). Rather than remove that for review, a seed script provisions a ready-to-use account with realistic sample data:

| | |
|---|---|
| **URL** | _fill in your deployed frontend URL here before sharing_ |
| **Email** | `demo@example.com` |
| **Password** | `Demo1234!` |

This account comes pre-loaded with 8 sample leads spanning every status, so the dashboard, filters, and stats aren't empty on first look. It's created by `backend/prisma/seed.ts` — see [Seeding the demo account](#seeding-the-demo-account).

You're also welcome to register your own account instead; `/auth/register` is open to anyone.

## Why authentication

The original brief for this project asked for two unauthenticated endpoints (`POST /leads`, `GET /leads`) and a basic UI. Both exist exactly as specified. On top of that baseline, this build adds a full register/login system gating the dashboard, because a lead list with no access control isn't something you'd actually ship — anyone with the URL could read or write every lead. The auth layer (JWT bearer tokens, bcrypt-hashed passwords, protected routes) is there to demonstrate that judgment, not to obscure the core requirement.

## Architecture

```
LeadManagerApp/
├── backend/                Express API (TypeScript, Prisma, PostgreSQL)
│   ├── prisma/schema.prisma      Lead + User models, migrations
│   └── src/
│       ├── app.ts                Express app: middleware, routes, error handling
│       ├── index.ts              Server entry: listen + graceful shutdown
│       ├── config/env.ts         Zod-validated environment config (fails fast)
│       ├── routes/auth.ts        POST /auth/register, /auth/login, GET /auth/me
│       ├── routes/leads.ts       GET /leads (filter/search), POST /leads — auth-protected
│       ├── routes/*.test.ts      Vitest + Supertest route tests (mocked Prisma)
│       ├── schemas/               Zod input validation (auth.ts, lead.ts)
│       ├── errors/AppError.ts    Typed error classes (Validation/NotFound/Conflict/Unauthorized)
│       ├── middleware/           asyncHandler, requireAuth (JWT), errorHandler/404
│       └── lib/                  PrismaClient, Pino logger, JWT sign/verify, bcrypt hashing
├── frontend/                Next.js app (App Router, TypeScript, Tailwind v4)
│   └── src/
│       ├── app/page.tsx          Public marketing landing page
│       ├── app/login/            Login page
│       ├── app/register/         Register page
│       ├── app/dashboard/        Protected app (behind AuthGuard)
│       ├── components/landing/   Hero, feature grid, tech strip, CTA, footer
│       ├── components/           Sidebar, Header, LeadTable, AddLeadDialog (Radix),
│       │                         auth-provider (JWT session context), auth-guard
│       ├── hooks/                useLeads (SWR + filters), useDebouncedValue
│       ├── lib/                  Typed API client, token storage
│       └── types/                Shared Lead/User/Auth types
├── render.yaml               Render Blueprint (backend + managed Postgres)
├── netlify.toml               Netlify build config (frontend)
└── docker-compose.yml         Postgres for local dev
```

The frontend never touches Prisma/Postgres directly — everything goes through the typed API client, which talks to the Express API over HTTP with a JWT bearer token attached. That boundary is what makes hosting them on two different platforms straightforward.

## Features

- **Auth**: register/login/logout with bcrypt-hashed passwords and signed JWTs, a session that persists across reloads (validated via `GET /auth/me`), and every `/leads` route gated behind authentication.
- **Backend**: input validation (Zod), unique-email conflict handling, status/search filtering (`GET /leads?status=&q=`), structured JSON logging (Pino), security headers (Helmet), rate limiting (tighter on auth routes), gzip compression, environment validation at boot, graceful shutdown, DB-aware health check, and a Vitest/Supertest test suite (18 tests).
- **Frontend**: an animated public landing page, live search + status filter, sortable columns, summary stat cards, an accessible "Add lead" dialog (Radix UI) with inline field errors, toast notifications, loading skeletons, empty states, and light/dark theme support.

## Prerequisites

- Node.js 20+
- A PostgreSQL instance — either Docker (`docker compose up -d`) or a local Postgres install.

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # adjust DATABASE_URL; set a real JWT_SECRET (openssl rand -base64 48)
npm install
npm run prisma:migrate    # creates the leads + users tables
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

Open http://localhost:3000 — the landing page. Register an account to reach the dashboard at `/dashboard`, or use the demo account below.

## Seeding the demo account

```bash
cd backend
npm run prisma:seed
```

This upserts the demo user (`demo@example.com` / `Demo1234!`) and 8 sample leads by email, so it's safe to run repeatedly — it updates in place rather than erroring on duplicates or piling up copies. Run it once against whichever database `DATABASE_URL` in `backend/.env` currently points to.

To seed a deployed database instead of your local one, point `DATABASE_URL` at it for that one command:

```bash
DATABASE_URL="<your production connection string>" npm run prisma:seed
```

Treat the demo password like any other credential you're handing to a third party — it's fine for a time-boxed review, but rotate it (or delete the account) afterwards if the deployment stays up.

## API

| Method | Path                        | Auth | Description                                   |
|--------|------------------------------|------|------------------------------------------------|
| POST   | `/auth/register`            | –    | Create an account. Body: `{ name, email, password }` |
| POST   | `/auth/login`                | –    | Sign in. Body: `{ email, password }`. Both return `{ user, token }` |
| GET    | `/auth/me`                  | ✓    | Returns the current user for a valid token      |
| GET    | `/leads`                    | ✓    | List leads, newest first                        |
| GET    | `/leads?status=Engaged`     | ✓    | Filter by status                                |
| GET    | `/leads?q=jane`              | ✓    | Search by name/email (case-insensitive)         |
| POST   | `/leads`                    | ✓    | Create a lead. Body: `{ name, email, status? }` |
| GET    | `/health`                   | –    | Health check (pings the database)               |

Auth-protected routes require `Authorization: Bearer <token>`. `status` is one of: `New`, `Engaged`, `Proposal Sent`, `Closed-Won`, `Closed-Lost` (defaults to `New`). Both `Lead.email` and `User.email` must be unique. Passwords must be 8–72 characters (bcrypt's input limit).

**Error shape** (all non-2xx responses):

```json
{ "error": { "message": "...", "code": "VALIDATION_ERROR", "details": { "email": ["..."] } } }
```

**Example:**

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"supersecret123"}' | jq -r .token)

curl -X POST http://localhost:4000/leads \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"New Lead","email":"lead@example.com","status":"Engaged"}'
```

## Deployment

The apps are split intentionally: the backend is a stateful API talking to Postgres (Render), the frontend is a static/SSR client (Netlify). They communicate purely over HTTPS/CORS with a JWT bearer token, so each redeploys independently.

### Backend → Render

**Option A — Blueprint (recommended):** In the Render dashboard, "New" → "Blueprint", point it at this repo. `render.yaml` provisions the web service (rooted at `backend/`) and a managed Postgres database, wires `DATABASE_URL` automatically, and generates a `JWT_SECRET`.

**Option B — Manual:**
1. New Web Service → root directory `backend`.
2. Build command: `npm install && npm run build`
3. Start command: `npm start` (run `npm run prisma:deploy` once via the Render shell, or set it as a pre-deploy command, before first boot)
4. Health check path: `/health`
5. Add a managed Postgres instance and set `DATABASE_URL` to its connection string.
6. Set `JWT_SECRET` to a long random value (`openssl rand -base64 48`) — never reuse the local dev value.

Either way, after the Netlify site exists, set `CORS_ORIGIN` on the Render service to your Netlify URL (e.g. `https://your-app.netlify.app`) — comma-separate multiple origins if needed.

Once the backend is live, run `DATABASE_URL="<render db url>" npm run prisma:seed` locally (see [Seeding the demo account](#seeding-the-demo-account)) so the demo login works on the deployed site too.

### Frontend → Netlify

1. New site from Git, pick this repo. `netlify.toml` sets the base directory to `frontend` and enables the official Next.js runtime — no extra config needed.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to your Render service URL (e.g. `https://lead-manager-api.onrender.com`).
3. Deploy. Netlify's Next.js plugin handles the App Router build automatically.

**Note:** Netlify deploy previews get random subdomains; `CORS_ORIGIN` only allowlists the origins you list explicitly, so previews won't be able to reach a production backend unless you add them too. The JWT is stored in the browser's `localStorage`, so it's scoped per-domain — a deploy preview and production won't share a session.
