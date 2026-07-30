# مَعلم (Ma'lam)

A Saudi luxury real-estate platform — public property search and listings,
developer/broker company profiles, a developer dashboard (projects, units,
leads, conversations, analytics), and an admin application-approval flow —
built with Next.js, Prisma, and Supabase Postgres.

**Live:** https://web-gamma-eight-15.vercel.app

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter
- **Supabase**: Postgres (via pooler) + Storage for project imagery
- **Auth.js (NextAuth v5)** with the Prisma adapter
- **Tailwind CSS 4**, Radix UI primitives, `lucide-react`, `motion`

## Getting started

### 1. Install dependencies

```bash
cd web
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your own Supabase project's values:

| Variable | Where to find it |
|---|---|
| `DATABASE_URL` | Supabase → Project Settings → Database → Connect → **Transaction pooler** (port 6543) |
| `DIRECT_URL` | Same page → **Session/direct** connection (port 5432). Used for migrations & seeding |
| `AUTH_SECRET` | Generate with `npx auth secret` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` secret key (server-only, never expose to the browser) |
| `SUPABASE_STORAGE_BUCKET` | Defaults to `project-images` |

### 3. Apply database migrations

```bash
npm run db:migrate
```

Runs `prisma migrate deploy` against `DIRECT_URL`, creating all tables
(`User`, `Company`, `Project`, `Unit`, `Lead`, `Conversation`, `Message`,
`AnalyticsPoint`, `TrafficSource`, `AnalyticsSummary`,
`NotificationPreference`, plus Auth.js's `Account`/`Session`/
`VerificationToken`). Schema changes always go through Prisma migrations —
never edit tables by hand in the Supabase dashboard.

### 4. Seed demo data

```bash
npm run db:seed
```

Populates a demo developer company and a demo broker company — each with its
own projects, units, leads, and conversations — so both dashboards have
something to render.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo logins

| Role | Email | Password |
|---|---|---|
| Developer (dashboard access) | `salman@vision-group.sa` | `Demo12345!` |
| Broker (dashboard access) | `fahad@shammari-realty.sa` | `Demo12345!` |
| Admin (`/admin/applications`) | `admin@malam.sa` | `AdminDemo123!` |

## Project structure

```
src/app/(public)/          # homepage, /projects, /developers/[slug], auth, contact, about, faq, brokers, blog
src/app/admin/              # /admin/applications — approve/reject developer & broker signups
src/app/dashboard/developer/
├── page.tsx           # overview
├── projects/          # project listings
├── units/             # unit inventory
├── leads/             # buyer leads
├── messages/          # buyer conversations
├── analytics/         # traffic & performance
└── settings/          # notification preferences
```

## Deployment

Deployed on Vercel, connected to this repo's `main` branch for
push-to-deploy. Production points at the same Supabase project as local
dev — set the same variables from `.env` (§2 above) plus:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Enables real email delivery (password reset, account invites). Without it, links are logged server-side instead of sent |
| `RESEND_FROM_EMAIL` | Sender address — defaults to Resend's sandbox `onboarding@resend.dev` |
| `NEXT_PUBLIC_APP_URL` | Must be the deployed URL — used to build absolute links in emails |

**Pending:** `malam.sa` is the intended sending domain, but it's still mid
ownership-transfer and DNS isn't accessible yet. Until it's verified in
Resend, `RESEND_FROM_EMAIL` must stay on the sandbox sender — Resend only
delivers sandbox-sender emails to the account owner's own address, so
password-reset/invite emails to anyone else currently just log the link
server-side instead of sending. Once DNS access exists: add `malam.sa` at
resend.com/domains, add the SPF/DKIM records it generates, wait for
verification, then switch `RESEND_FROM_EMAIL` to an address on that domain
(both locally and on Vercel) and redeploy.

The repo root is one level up from this app (`web/`), so the Vercel
project's **Root Directory** setting must be `web` — otherwise git-triggered
builds clone the repo and fail to find `app/`/`pages/` (they run from the
repo root by default; only `web/` has the actual Next.js project).

## Other scripts

| Script | Purpose |
|---|---|
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:migrate:dev` | Create a new migration during local development |
| `npm run db:reset` | Drop and recreate the database, re-running migrations + seed |
| `npm run lint` | ESLint |
| `npm run build` / `npm run start` | Production build / serve |
