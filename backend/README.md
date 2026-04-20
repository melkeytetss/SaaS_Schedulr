# SaaS Schedulr — Backend

Supabase-powered backend. No custom Node server; everything is Postgres + RLS + Edge Functions.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) — install globally, or run `npx supabase <cmd>`.
- Docker Desktop (required for local Supabase stack).
- Deno (bundled with the Supabase CLI for function runtime).

## Local development

```bash
# From this directory (backend/)
npm install
npx supabase start     # spins up Postgres, GoTrue, Storage, Studio, Realtime
npx supabase db reset  # applies migrations + seed.sql
```

The CLI prints the local API URL, anon key, service-role key, and Studio URL. Copy the URL + anon key into `frontend/.env.local`.

## Generating frontend types

After editing migrations, regenerate the typed DB schema used by the frontend:

```bash
npm run types:gen
```

## Applying migrations to a remote project

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```

## Edge Functions

```bash
npm run functions:serve                     # serve locally
npx supabase functions serve send-booking-email --env-file .env.local
npm run functions:deploy -- send-booking-email
```

## Structure

- `supabase/migrations/` — timestamped SQL files; run in order.
- `supabase/seed.sql` — demo data loaded on `db reset`.
- `supabase/functions/` — Deno Edge Functions, one folder per function.
- `supabase/config.toml` — CLI project config.
