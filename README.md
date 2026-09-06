# Zinc

Zinc is a Next.js (App Router) web app for scheduling, recording, and monitoring
recurring home-maintenance chores across the house, garden, garage, and cars. It
tracks how often each task should happen per area, records completions with one
action, estimates each area's condition from elapsed time vs. expected frequency,
and surfaces a small prioritised list of what probably needs attention.

Part of the in-house suite (Argon, Boron, Carbon, Atlas, Neon, Oxygen). Stack:
Next.js 15 + TypeScript, Prisma + PostgreSQL, NextAuth v5 (Credentials), Tailwind
v4 + shadcn/ui, Vitest.

> **Status:** Phase 1 (foundation). Delivered: auth, full schema, the scoring
> engine (unit-tested), and Zones/Areas management. Task-type library, task
> assignment, completion logging, the suggestion scheduler, and the backlog list
> land in later phases.

## Prerequisites

- Node.js 20+ and npm
- A running PostgreSQL server with an empty database created for Zinc
- Git

## Getting started

### 1. Clone and install

```bash
git clone <repo-url> zinc
cd zinc
npm install
```

The repo ships an `.npmrc` allow-listing the packages that need install scripts
(esbuild, Prisma, Tailwind oxide). Keep it.

`npm install` also runs `prepare`, which points `core.hooksPath` at `.githooks/`.
That enables a `pre-commit` hook which auto-bumps the patch version in
`package.json` on every commit made on `main` (feature branches are left alone).
To set it up manually: `git config core.hooksPath .githooks`.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/zinc?schema=public` |
| `AUTH_SECRET` | NextAuth signing secret — generate with `npx auth secret` or `openssl rand -base64 32` |
| `AUTH_URL` | Base URL, `http://localhost:3000` in dev |
| `USER_PASSWORD_USER` | Password for the seeded `user@example.com` account |
| `USER_PASSWORD_ADMIN` | Password for the seeded `admin@example.com` account |

`.env*` is gitignored (except `.env.example`).

### 3. Build the database schema

```bash
npx prisma migrate deploy   # apply existing migrations
# or, when changing the schema:
npx prisma migrate dev
```

### 4. Seed the database

```bash
npm run seed
```

Wipes all existing data, then creates two demo accounts
(`user@example.com` / `admin@example.com`), the four zones, and a handful of
placeholder areas and task types to exercise the UI.

### 5. Run in development

```bash
npm run dev
```

Open http://localhost:3000 and sign in with `user@example.com`.

### 6. Run in production

```bash
npm run build
npm start
```

A single-stage `Dockerfile` is included (app image only — run
`npx prisma migrate deploy` yourself against the target database).

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run seed` | Wipe and reseed the database |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run test:unit` | Run Vitest once |
| `npm run test:unit:watch` | Vitest in watch mode |
| `npm run test:unit:coverage` | Vitest with a coverage report |

## Testing

Vitest, with two projects in `vitest.config.ts`:

- **node** — pure logic and server code (`lib/**`, `services/**`, `actions/**`,
  `app/api/**`). The scoring/decay/scheduling engine in `lib/scoring/` has no UI
  or data dependency and is fully covered here.
- **components** — React components (`components/**`) under jsdom with React
  Testing Library.

Prisma is mocked globally in `vitest.setup.ts` via `vitest-mock-extended`; import
`prismaMock` from `test/mocks/prisma.ts` in service tests.

## Theming

Colour tokens are defined in `app/globals.css` for light (`:root`) and dark
(`.dark`). The brand **primary is a sandy yellow**, paired with a deep warm-brown
`--primary-foreground` so text/icons on primary surfaces keep strong contrast in
both modes. Theme state is handled by `next-themes` (`ThemeProvider` in
`app/layout.tsx`); a light / dark / system switcher lives in the top nav
(`components/theme/ModeToggle.tsx`).

## Development workflow

- Never commit directly to `main`. Branch off `main` for every change; branch
  names start with `feature/`.
- Merge into `main` with `--no-ff` (`git merge --no-ff feature/…`). The merge
  commit is what triggers the version-bump `pre-commit` hook — a fast-forward
  merge creates no commit and would skip the bump.
- The patch version in `package.json` is bumped automatically on each commit to
  `main`; don't bump it by hand.
