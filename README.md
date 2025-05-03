# Streamthing 🎵

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.41-blue?logo=drizzle)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Postgres](https://img.shields.io/badge/Postgres-3.4-blue?logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-black?logo=vercel)](https://vercel.com/)

---

## Overview

**Streamthing** is a dashboard and overlay platform for streamers, built with Next.js, React, Drizzle ORM, and PostgreSQL. It integrates with Spotify and Twitch, allowing you to display now-playing tracks, log track history, manage song requests, and show Twitch events in real time. The app features a modern dashboard, public API endpoints, and a robust database for track logging and moderation.

---

## Table of Contents

- [Streamthing 🎵](#streamthing-)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Pages \& Navigation](#pages--navigation)
  - [API Routes](#api-routes)
    - [Spotify](#spotify)
    - [Twitch (DOES NOT WORK)](#twitch-does-not-work)
    - [Users \& Admin](#users--admin)
  - [Database](#database)
  - [Tech Stack](#tech-stack)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [License](#license)

---

## Features

- Spotify now playing overlay and track logging
- Public API for recent track history and time-based queries
- Twitch event overlay and integration
- Song request system and moderation tools
- Modern dashboard with real-time status indicators
- Discord authentication and user roles
- Responsive UI with Tailwind CSS

---

## Pages & Navigation

- `/`
  **Dashboard**: Status indicators for Spotify/Twitch, quick links to overlays, song requests, and admin panels.

- `/spotify`
  **Spotify Overlay**: Display the current Spotify track for your stream.

- `/events`
  **Twitch Event Overlay**: Show Twitch events (follows, subs, etc) on stream.

- `/request-song`
  **Song Request**: Public page for viewers to request songs.

- `/requests`
  **Song Requests Mod Panel**: Moderators can view and manage song requests.

- `/admin/users`
  **User Management**: Admin panel for managing user roles and bans.

---

## API Routes

All API routes are under `/api/` and use Next.js Route Handlers.

### Spotify

- `/api/spotify/track`
  Returns the current Spotify track (JSON). Used for overlays and status.

- `/api/spotify/track-logs?limit=30`
  Returns the last N tracks (default 30). Supports `start` and `end` query params for time-based filtering (max 7 days).

- `/api/spotify/auth`
  Spotify OAuth login.

- `/api/spotify/requests`
  Song request submission and retrieval.

- `/api/spotify/submit-link`
  Submit a Spotify link for requests.

### Twitch (DOES NOT WORK)

- `/api/twitch/events`
  Returns recent Twitch events for overlays.

- `/api/twitch/auth`
  Twitch OAuth login.

- `/api/twitch/webhook`
  Twitch event webhook receiver.

### Users & Admin

- `/api/user`
  Returns the current logged-in user.

- `/api/users/[id]/role`
  Get or update user roles (mod, ban, etc).

- `/api/admin/users`
  Admin user management.

---

## Database

- **Tables:**
  - `track_logs` (Spotify track history: track, artist, albumArt, duration, loggedAt)
  - `userRoles` (user roles and permissions)
  - (other tables for requests, Twitch events, etc)
- **ORM:**
  Uses Drizzle ORM for type-safe queries and migrations.

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Next.js Route Handlers (API), Drizzle ORM, PostgreSQL
- **Integrations:** Spotify API, Twitch API, Discord OAuth
- **Other:**
  - Vercel for hosting and serverless functions
  - Modern UI with Tailwind CSS

---

## Development

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- PostgreSQL database

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment:**
    - Copy `.env.local.example` to `.env.local` and fill in database credentials, Spotify/Twitch/Discord secrets, etc.

3. **Run database migrations:**
    ```sh
    npm run db:push
    ```

4. **Start the development server:**
    ```sh
    npm run dev
    ```

5. **Build and run in production:**
    ```sh
    npm run build
    npm run start
    ```

---

## License

MIT
