# IU Order Tracker

A shared order tracker for two people. Every read and write goes straight to a
Supabase Postgres database — there is no local-only state. Changes made on one
device show up on the other within a second or two via Supabase Realtime.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (v4, via `@tailwindcss/vite`)
- Supabase (Postgres + Realtime), accessed with `@supabase/supabase-js`
- Deployed on Vercel

No state management library, no UI component library, no auth provider —
just React state, one Supabase table, and a shared passcode gate.

## Where the data actually lives

Everything is in the `orders` table in your Supabase project
(Project → **Table Editor** → `orders`, or the **SQL Editor** for ad-hoc
queries). To export it: Table Editor → `orders` → **Export data** (CSV), or
run `select * from orders;` in the SQL Editor and download the results.

Nothing is stored in the browser except two small localStorage flags: whether
this device has entered the passcode, and the display name typed in on first
visit. Clearing browser data on a device just means re-entering the passcode
and name — it does not touch any order data.

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` file (gitignored, never commit it) with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_PASSCODE=whatever-you-picked
```

See `.env.example` for the shape.

```bash
npm run build      # production build, output in dist/
npx tsc --noEmit   # type-check only
```

## Redeploying after a change

This repo is connected to Vercel for auto-deploy: push to `main` and Vercel
builds and deploys automatically.

```bash
git add -A
git commit -m "describe the change"
git push
```

No manual Vercel step needed unless you're changing environment variables —
those are set in the Vercel project's **Settings → Environment Variables** and
require a redeploy (Vercel dashboard → Deployments → ⋯ → Redeploy) to take
effect if changed.

## The passcode

`VITE_APP_PASSCODE` is a shared password baked into the built JS bundle and
checked entirely in the browser. It is a speed bump, not access control:
anyone who inspects the deployed site's source can read it. It does not
protect the data itself — the Supabase `anon` key and the `orders` table's
row-level-security policy (`anon full access`) mean anyone with the project
URL and anon key can read and write every row, passcode or not. If that ever
matters (e.g. this becomes more than two trusted people), replace it with
real Supabase Auth (email/password or magic link) and rewrite the RLS policy
to check `auth.uid()` instead of allowing anyone.

## Known limitations

- **Free Supabase projects pause after 7 days with no activity.** If both of
  you go quiet for a week, the next person to open the app will see a
  connection error until the project is manually resumed from the Supabase
  dashboard (takes under a minute).
- Conflict handling is last-write-wins per field save, stamped with
  `updated_at` / `updated_by` — there's no merge if two people edit the same
  field within the same second.
