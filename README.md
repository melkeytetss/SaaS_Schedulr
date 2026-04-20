# SaaS Schedulr

Scheduling / booking SaaS (Calendly-style). Originally exported from Figma Make; now split into a `frontend/` React app and a `backend/` Supabase project.

## Tech stack

**Frontend** — React 18, TypeScript, Vite, Tailwind v4, shadcn/ui, React Router 7, TanStack Query, react-hook-form + zod, Supabase JS.

**Backend** — Supabase: Postgres (with RLS), Auth, Storage, Realtime, Edge Functions (Deno).

## Repo layout

```
SaaS_Schedulr/
├── frontend/          # React + Vite app (UI)
│   └── src/
│       ├── app/       # App shell, routes, pages, components
│       ├── features/  # Domain hooks + services (auth, bookings, events, ...)
│       ├── lib/       # supabase client, query client
│       └── types/     # Generated DB types
├── backend/           # Supabase project
│   └── supabase/
│       ├── migrations/  # SQL schema + RLS + storage
│       ├── functions/   # Edge Functions (Deno)
│       └── seed.sql
└── guidelines/
```

## Getting started

### 1. Backend (Supabase local)

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and Docker Desktop.

```bash
cd backend
npm install
npx supabase start       # spins up Postgres, Auth, Storage, Studio
npx supabase db reset    # apply migrations + seed
```

Note the printed **API URL** and **anon key**.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # paste the URL + anon key
npm run dev                   # http://localhost:5173
```

### 3. Regenerate DB types after schema changes

```bash
cd backend
npm run types:gen
```

## Next steps

See `frontend/src/features/*` for the data-access layer that already wraps each domain. Pages in `frontend/src/app/pages/` still use hardcoded arrays and need to be wired to those hooks one by one — start with `Bookings.tsx` and `Dashboard.tsx` for the fastest visible win.

Scheduled `send-reminder` and the `send-booking-email` DB webhook need a Resend (or SMTP) API key before they do anything real.
