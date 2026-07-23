# مَعلم (Ma'lam)

A developer dashboard for real-estate companies — projects, units, leads,
buyer conversations, and analytics — built with Next.js, Prisma, and
Supabase Postgres.

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

Populates a demo company, projects, units, leads, and conversations so the
dashboard has something to render.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000/dashboard/developer](http://localhost:3000/dashboard/developer).

## Project structure

```
src/app/dashboard/developer/
├── page.tsx           # overview
├── projects/          # project listings
├── units/             # unit inventory
├── leads/             # buyer leads
├── messages/          # buyer conversations
├── analytics/         # traffic & performance
└── settings/          # notification preferences
```

## Other scripts

| Script | Purpose |
|---|---|
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:migrate:dev` | Create a new migration during local development |
| `npm run db:reset` | Drop and recreate the database, re-running migrations + seed |
| `npm run lint` | ESLint |
| `npm run build` / `npm run start` | Production build / serve |
