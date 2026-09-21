# English Study

A personal, single-user English-learning web app: a grammar library, lessons, and
exercises graded in detail by AI — plus a one-click shortcut into Duolingo.

## Features

- **Grammar library** — 15 topics from A1 to C2 (tenses, articles, conditionals,
  passive voice, reported speech, relative clauses, inversion, and more), each with
  a clear explanation and examples. English words and complete example sentences
  can be clicked to hear their pronunciation through the browser's English voice.
- **Lessons** — a reading page tied to each grammar topic.
- **Exercises with AI grading** — free-text answers (fill-in-the-blank, sentence
  correction, translation, free response, multiple choice) graded by OpenAI's API,
  with a score, an explanation of what's right/wrong, and a corrected version.
- **Duolingo shortcut** — a button that opens `duolingo.com` in a new tab. Duolingo
  sends `X-Frame-Options: SAMEORIGIN`, so it cannot be embedded in-page; opening a
  new tab in the same browser keeps your existing Duolingo session automatically.
- **Progress that persists** — every attempt is saved to a real Postgres database
  (not browser storage), with per-topic completion and score tracking. No login —
  this is a single-user app.

## Tech stack

Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Drizzle ORM + Postgres,
OpenAI API for grading. Deploys to Vercel.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string. Provision via Vercel dashboard → Storage → Postgres, or a free instance at [neon.tech](https://neon.tech). |
| `OPENAI_API_KEY` | From [platform.openai.com](https://platform.openai.com/api-keys). |
| `OPENAI_GRADING_MODEL` | Optional, defaults to `gpt-4o-mini`. |

### 3. Push the schema and seed content

```bash
npm run db:push   # creates tables from src/db/schema.ts
npm run db:seed   # loads the initial grammar/lesson/exercise content
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push the Drizzle schema to `DATABASE_URL` |
| `npm run db:generate` | Generate SQL migration files from schema changes |
| `npm run db:studio` | Open Drizzle Studio to browse the database |
| `npm run db:seed` | (Re)load the seed grammar/lesson/exercise content |

## Deploying to Vercel

1. Import this repository at [vercel.com/new](https://vercel.com/new) (Next.js is
   auto-detected, no config needed).
2. In the project's **Settings → Environment Variables**, add `DATABASE_URL` and
   `OPENAI_API_KEY` (same values as `.env.local`).
3. Deploy. Run `npm run db:push` and `npm run db:seed` once (locally, pointed at
   the same `DATABASE_URL`) so the production database has its schema and content.

## Project structure

```
src/
  app/            Routes: grammar, lessons, exercises, progress, api/grade
  components/      UI components (shadcn/ui in components/ui/)
  db/             Drizzle schema, client, and seed script
  lib/            Content queries and the OpenAI grading call
```

## Content scope

The seed data covers a solid set of core English grammar (~15 topics, ~60
exercises) rather than a claimed-exhaustive curriculum. Content is stored in the
database, not hardcoded in the UI — add more by extending `src/db/seed.ts` and
re-running `npm run db:seed`.
