# CLAUDE.md

Agent context file for the **English** project — a personal English-learning web app.

## Project vision

A single-user (no login) web app to study English comprehensively:
- **Grammar library**: topics with clear explanations, examples, organized by level (A1–C2).
- **Lessons**: structured reading tied to grammar topics.
- **Exercises**: practice questions per topic, answered freely (not just multiple choice), graded in detail by AI with explanations of what's right/wrong.
- **Duolingo quick-launch**: a button that opens `duolingo.com` in a new tab, relying on the browser's existing Duolingo session cookie to skip a manual login.
- **Progress**: every attempt, score, and piece of content persists reliably in a real database — never relies on browser-only storage.

## Key decisions (locked — do not silently reverse; see `~/.claude/rules/review-audit-self-decision.md`)

| Decision | Choice | Why |
|---|---|---|
| Duolingo integration | Quick-launch button opening `https://www.duolingo.com/learn` in a new tab | `duolingo.com` sends `X-Frame-Options: SAMEORIGIN` (verified via `curl -I`), so iframe embedding is blocked by the browser regardless of implementation. A same-browser new-tab link keeps the existing Duolingo session (cookies are per-domain, not per-tab) without violating Duolingo's ToS. Reverse-engineered/unofficial API integration was explicitly rejected by the user as too risky. |
| Auth | **None.** Single-user personal app. | User explicitly said no login is needed — this app is for personal use only. |
| Progress persistence | Real hosted database (Postgres), not `localStorage`. | User explicitly required data to always be saved/persisted, which browser-only storage cannot guarantee across devices/browser resets. |
| AI grading provider | **OpenAI API (GPT)** | User's explicit choice over Anthropic/Claude API. |
| Hosting | Vercel | Confirmed by user's existing Vercel account/project setup screenshots. |
| Source control | GitHub repo `https://github.com/Snoww-dev/English.git` (already created, empty) | Confirmed by user's existing repo screenshot. |

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Postgres (Neon / Vercel Postgres) + Drizzle ORM
- **AI grading**: OpenAI API, called from a server-side API route (`/api/grade`); never expose the API key client-side
- **Deployment**: Vercel (Next.js zero-config)

## Environment variables

Defined in `.env.example`, set locally in `.env.local` (gitignored) and in Vercel Project Settings → Environment Variables:

- `DATABASE_URL` — Postgres connection string (provision via Vercel Storage tab or neon.tech)
- `OPENAI_API_KEY` — from platform.openai.com

These are **not provisioned by the agent** — the user must create the DB instance and OpenAI key themselves; the agent wires the app to read them from env.

## Non-goals

- No multi-user accounts, auth, or roles.
- No real Duolingo lesson-solving embedded in-page (technically blocked by Duolingo's frame policy — see decision table).
- No claim of "complete" grammar coverage of the English language in the first build — content is seeded with a solid extensible curriculum (schema-driven, stored in DB) that's meant to grow over time, not a one-shot exhaustive dump.

## Content model

Grammar topics, lessons, and exercises are **data**, not hardcoded JSX — stored in Postgres via Drizzle schema and a seed script (`db/seed.ts`), so new content can be added later without code changes to the UI.

## Repo conventions

- Markdown docs: `docs/`; plans: `plans/` (see `~/.claude/rules/documentation-management.md`). `README.md` and this `CLAUDE.md` are the only markdown files that live at the repo root.
- Kebab-case file names.
- No comments explaining *what* code does — only non-obvious *why* (see global dev rules).
