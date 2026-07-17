# Name That Tune

Live audience quiz for the hackathon presentation. Songs get played out loud;
attendees visit this app on their phones, enter their name, guess the artist
+ title for each song in `answers.csv`, and submit. Fuzzy matching tolerates
minor typos. The host can view all submissions and scores at `/results`,
behind a shared password.

## Local development

Requires a Postgres database (the schema is in `migrations/001_init.sql`).

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`,
   `RESULTS_PASSWORD`, `SESSION_SECRET`.
3. Run the migration once: `psql "$DATABASE_URL" -f migrations/001_init.sql`
4. `npm run dev`, visit `http://localhost:3000`.

## Deploying to Vercel (free tier)

1. Vercel dashboard → Add New Project → import this GitHub repo → set
   **Root Directory** to `quiz` (important — the repo root is a separate
   Python project).
2. Project Settings → Environment Variables: add `RESULTS_PASSWORD` and
   `SESSION_SECRET` (e.g. `openssl rand -hex 32`).
3. Storage tab → Create Database → Neon (free tier) → connect to the
   project. This injects a DB connection env var automatically — check the
   dashboard's quickstart tab for the exact variable name and align it with
   `DATABASE_URL` if it differs (see `src/lib/db.ts`).
4. Run `migrations/001_init.sql` once against the new database (Neon SQL
   editor, or `vercel env pull .env.local` then `psql` locally).
5. Deploy (push to `main`, or `vercel --prod` from this directory).

## Notes

- The answer key (`answers.csv`) is only ever read server-side — the quiz
  form only receives song numbers, never the answers.
- Fuzzy-match threshold lives in `src/lib/scoring.ts` — spot-check it by hand
  against plausible misspellings of these specific songs before the live
  event.
- Resubmitting overwrites your previous answers (matched by a browser-local
  `clientId`, not by name), so changing your mind before time's up is fine.
