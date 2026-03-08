# Rookery — Wingspan Score Tracker

A web app for tracking [Wingspan](https://stonemaiergames.com/games/wingspan/) board game scores with your friends. Replaces the messy shared spreadsheet with a proper dashboard, leaderboards, player profiles, and charts.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)

## Features

- **Dashboard** — Summary cards, leaderboard, recent games, score trend chart, win distribution donut, and metric radar chart
- **Game log** — Browse all games with date, location, players, winner, and winning score
- **Game detail** — Full score grid across all Wingspan scoring categories with winner highlight and awards
- **New game / edit** — Score entry grid with player selection, awards, and historical context
- **Player profiles** — Individual stats, score trends, radar breakdown, head-to-head records, and game history
- **Responsive** — Works on desktop and mobile with a collapsible sidebar

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| UI | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| Database | PostgreSQL ([Neon](https://neon.tech/) serverless or local Postgres) |
| Charts | [Recharts](https://recharts.org/) |
| Validation | [Zod](https://zod.dev/) |
| Data Fetching | [SWR](https://swr.vercel.app/) (client), React Server Components (server) |
| Icons | [Lucide](https://lucide.dev/) |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** — either a local instance or a [Neon](https://neon.tech/) database (free tier works fine)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/wingspan.git
cd wingspan
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wingspan
```

If you're using [Neon](https://neon.tech/), grab the connection string from your Neon dashboard.

### 3. Run database migrations

```bash
node scripts/migrate.mjs
```

This creates the `players`, `metrics`, `games`, `game_players`, and `results` tables.

### 4. Seed data (optional)

If you have a `seed-data.json` file with your game history, place it at the project root and run:

```bash
npm run seed
```

Alternatively, you can use the SQL seed file directly:

```bash
psql $DATABASE_URL -f scripts/002-seed-data.sql
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start tracking games.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Run migrations + production build |
| `npm start` | Start production server |
| `npm run lint` | Lint with ESLint |
| `npm run seed` | Seed the database |
| `npm run db:reset` | Reset and re-seed the database |

## Project Structure

```
app/                  → Next.js App Router pages
  games/              → Game list, detail, edit, new
  players/            → Player list and profiles
components/
  game/               → Game-related components (score grid, forms)
  player/             → Player charts and stats
  stats/              → Dashboard widgets (leaderboard, charts)
  layout/             → Sidebar, breadcrumbs, nav
  ui/                 → shadcn/ui primitives
lib/
  db.ts               → Database client (Neon / Postgres.js)
  queries.ts          → Data fetching functions
  actions.ts          → Server Actions (create, update, delete)
  schemas.ts          → Zod validation schemas
  types.ts            → TypeScript types
scripts/
  001-create-tables.sql → Database schema
  002-seed-data.sql     → Sample seed data
  migrate.mjs           → Migration runner
  seed.mjs              → Seed runner
```

## Database Schema

The app uses five tables:

- **players** — Player identifiers and display names
- **metrics** — Wingspan scoring categories (birds, bonus cards, end-of-round goals, etc.)
- **games** — Game metadata (date, location, notes)
- **game_players** — Junction table tracking who played each game
- **results** — Individual scores per player per metric per game

## Deployment

The app deploys easily on [Vercel](https://vercel.com/):

1. Push your repo to GitHub
2. Import the project in Vercel
3. Set the `DATABASE_URL` environment variable to your Neon (or other hosted Postgres) connection string
4. Deploy — migrations run automatically during `npm run build`

## Analytics (Optional)

The app supports [PostHog](https://posthog.com/) for basic analytics. To enable it, add these to your `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us-i.posthog.com
```

## License

MIT

---

If you found this useful, consider supporting the project:

<a href="https://buymeacoffee.com/sebvargo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="48"></a>
