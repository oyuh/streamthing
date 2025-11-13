# streamthing

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.41-blue?logo=drizzle)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Postgres](https://img.shields.io/badge/Postgres-3.4-blue?logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-black?logo=vercel)](https://vercel.com/)
[![pnpm](https://img.shields.io/badge/pnpm-8.x-orange?logo=pnpm)](https://pnpm.io/)

---

## Overview

streamthing is a self-hosted streaming overlay and management platform that brings real-time Spotify integration, request moderation, dynamic themes, and secure user roles into a single dashboard. Each deployment is designed for a single creator so you can stay in control of your data and branding.

Deploy the full stack for free on Vercel (hosting and serverless functions) with Neon providing the managed PostgreSQL database.

---

## Feature Highlights

### Spotify Integration
- Real-time “now playing” overlays designed for OBS and browser sources
- Dynamic theme system powered by database-stored CSS
- Track history logging with a public API
- Viewer song requests with moderator approval flow

### Authentication and Access
- Discord OAuth login with JWT-backed sessions
- Role-based control for streamers, moderators, and viewers
- Self-service logout and access revocation endpoints
- Tamper-resistant cookies and expiry handling

### Interface and Experience
- Responsive dark UI built with Next.js App Router and Tailwind CSS
- Focused landing experience for new viewers
- Unified look and feel across dashboard, admin, and public pages
- Built-in overlay preview and theme editing workflow

### Operations and Security
- Drizzle ORM for type-safe queries and migrations
- PostgreSQL schema tuned for low-latency lookups
- HttpOnly cookie enforcement and rate-limited API routes
- Ready for single-tenant, self-hosted deployments

---

## Application Pages

| Route | Audience | Purpose |
|-------|----------|---------|
| `/` | Authenticated users | Dashboard entry point with quick links, role badges, and version info |
| `/spotify` | OBS/browser source | Minimal "now playing" overlay with automatic marquee text |
| `/request-song` | Authenticated viewers | Submit Spotify links that feed the moderation queue |
| `/requests` | Moderators | Review, approve, and reject viewer song requests |
| `/admin/users` | Streamer or moderators | Promote, demote, and ban users with audit-friendly controls |
| `/admin/themes` | Streamer | Edit CSS themes and activate the overlay design you want |

Back-end routes under `/api` expose the same functionality for custom integrations.

---

## Customizing the Landing Page

The default landing page (`app/components/LandingPage.tsx`) is a simple temporary placeholder that shows a warning banner and two action buttons (Login with Discord, Request a Song).

### To Remove or Replace the Landing Page

**Option 1: Replace with your own design**
1. Open `app/components/LandingPage.tsx`
2. Replace the entire component with your custom landing page
3. Keep the same component name and export: `export default function LandingPage()`

**Option 2: Remove it entirely and redirect**
1. Open `app/page.tsx`
2. Remove the `<LandingPage />` component
3. Add a redirect or alternative content for non-authenticated users

The landing page only appears when users are not logged in. Authenticated users see the dashboard automatically.

---

## API Surface

All route handlers are implemented with the Next.js App Router using TypeScript.

**Spotify**
- `GET /api/spotify/track` returns the active track
- `GET /api/spotify/track-logs` supports pagination and 7-day range filters
- `POST /api/spotify/submit-link` submits a new request (auth required)
- `PATCH /api/spotify/requests` processes queue actions (moderators)
- `GET /api/spotify/themes` fetches themes; `POST`/`PUT` manage them

**Authentication and Users**
- `GET /api/user` returns session details
- `GET /api/discord/login|callback|logout` handle OAuth lifecycle
- `GET /api/users` and nested routes manage roles and bans

**Utility**
- `GET /api/version` surfaces the deployed git commit
- Twitch placeholders are stubbed at `/api/twitch/*` for upcoming work

---

## Data Model

Drizzle ORM models the core tables:
- `track_logs` captures historical playback details
- `song_requests` stores incoming viewer submissions
- `spotify_themes` houses overlay CSS and activation state
- `userRoles` maps Discord identities to permissions

Run migrations and schema updates with `pnpm run db:push` or `pnpm migrate`.

---

## Tech Stack

- Next.js 15 with the App Router and React Server Components
- React 19 with TypeScript strict mode
- Tailwind CSS 4 and PostCSS for styling
- Drizzle ORM on top of PostgreSQL (Neon or self-hosted)
- JWT for session integrity and Discord OAuth for identity
- pnpm for fast, deterministic installs

---

## Quick Start

### Free Deployment (Vercel + Neon)
1. Fork the repository.
2. Import the repo into Vercel and deploy with the default Next.js settings.
3. Provision a Neon PostgreSQL project and copy the connection string.
4. Populate environment variables in the Vercel dashboard (see below).
5. Create Discord and Spotify applications and configure redirect URIs.

### Local Development
```bash
git clone https://github.com/oyuh/streamthing.git
cd streamthing
pnpm install
cp .env.local.example .env.local
# fill in environment variables
pnpm run db:push
pnpm dev
```

Create a production build with `pnpm build` and run it locally using `pnpm start`.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and provide the following values:

```
JWT_SECRET=long_random_string
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Discord OAuth
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=https://yourdomain.com/api/discord/callback

# Spotify OAuth
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/auth/callback

# Database (Neon, Vercel Postgres, or self-hosted)
DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require

# Optional Twitch placeholders
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
TWITCH_REDIRECT_URI=https://yourdomain.com/api/twitch/callback
TWITCH_SECRET=...
```

---

## Development Tasks

- `pnpm dev` launches the Next.js development server.
- `pnpm lint` and `pnpm lint:fix` run ESLint.
- `pnpm type-check` verifies the TypeScript project.
- `pnpm run db:push` synchronizes the Drizzle schema.

---

## Roadmap

Current capabilities include live Spotify overlays, viewer song submissions, role-aware dashboards, and theme editing. Upcoming work focuses on Twitch event ingestion, richer analytics, and customizable widgets.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit with a concise message.
4. Push and open a pull request.

Bug reports and feature ideas are welcome via GitHub issues.

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for the full text.

---

## Support

If streamthing improves your stream, consider starring the repo, filing issues, or sharing it with other creators.
