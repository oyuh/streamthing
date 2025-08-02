# streamthing 🎵

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

**streamthing** is a powerful streaming overlay and management system built for modern content creators. This self-hosted platform provides real-time Spotify integration, dynamic themes, song request management, and secure user authentication. Each deployment is designed for a single creator to ensure optimal security and performance.

**🚀 Deploy for free:** Use [Vercel](https://vercel.com) for hosting and [Neon](https://neon.tech) for PostgreSQL database - no credit card required!

---

## ✨ Features

### 🎵 Spotify Integration
- **Real-time now playing overlays** with customizable themes
- **Dynamic CSS theming system** with live editor and preview
- **Track history logging** with public API access
- **Song request system** with moderation tools

### 🔐 Secure Authentication
- **JWT-based authentication** with encrypted tokens
- **Discord OAuth login** with role-based permissions
- **User management** with moderator and ban capabilities
- **Tamper-proof sessions** - users cannot fake their identity

### 🎨 Modern UI
- **Beautiful gradient design** with React Icons
- **Responsive layout** that works on all devices
- **Professional landing page** for non-authenticated users
- **Dark theme** optimized for streaming

### 🛡️ Security & Performance
- **Self-hosted architecture** - each deployment for one creator
- **HttpOnly cookies** with secure JWT tokens
- **Role-based access control** for admin features
- **Automatic token expiration** and cleanup

---

## 📱 Pages & Features

### 🏠 Dashboard (`/`)
- **Authentication status** and user information
- **Quick access buttons** to all features (role-based visibility)
- **Version information** with live git commit hash
- **Beautiful landing page** for non-authenticated users
- **Secure logout** functionality

### 🎵 Spotify Overlay (`/spotify`)
- **Real-time now playing display** for OBS/streaming software
- **Dynamic theme loading** from database
- **Resilient API handling** with graceful error recovery
- **Hover effects** and smooth animations
- **Customizable CSS** for any streaming setup

### 🎨 Theme Editor (`/admin/themes`)
- **Live CSS editor** with syntax highlighting
- **Real-time preview** of theme changes
- **Multiple pre-built themes** (neon, retro, minimalist, etc.)
- **Save and activate themes** instantly
- **Theme management** with create, edit, delete

### 🎤 Song Requests (`/request-song`)
- **Public song request form** for viewers
- **Spotify URL validation** and track info parsing
- **User authentication** required for requests
- **Ban protection** - banned users cannot submit
- **Beautiful error handling** and success messages

### 🛡️ Request Moderation (`/requests`)
- **Moderator-only access** with role verification
- **Review pending requests** with full track info
- **Approve or reject** songs with one click
- **Search and filter** requests by title, artist, or user
- **Real-time stats** and queue management

### 👥 User Management (`/admin/users`)
- **Admin-only user panel** with search functionality
- **Promote/demote moderators** with role management
- **Ban/unban users** with instant effect
- **User statistics** and role overview
- **Secure role updates** with database persistence

---

## 🔌 API Routes

All API routes use Next.js App Router with TypeScript and proper error handling.

### 🎵 Spotify Integration
- **`GET /api/spotify/track`** - Current playing track (public)
- **`GET /api/spotify/track-logs`** - Track history with pagination
  - Query params: `limit`, `page`, `start`, `end` (max 7 days)
- **`GET /api/spotify/auth`** - Spotify OAuth login redirect
- **`GET /api/spotify/auth/callback`** - OAuth callback handler
- **`POST /api/spotify/submit-link`** - Submit song request
- **`GET /api/spotify/requests`** - Get pending requests (mods only)
- **`PATCH /api/spotify/requests`** - Approve/reject requests (mods only)
- **`GET /api/spotify/themes`** - Get active theme CSS
- **`POST /api/spotify/themes`** - Create/update themes (admin only)

### 🔐 Authentication & Users
- **`GET /api/user`** - Current user info (JWT-secured)
- **`GET /api/discord/login`** - Discord OAuth login
- **`GET /api/discord/callback`** - Discord OAuth callback
- **`GET /api/discord/logout`** - Secure logout with token cleanup
- **`GET /api/users`** - List all users (admin only)
- **`GET /api/users/[id]/role`** - Get user role info
- **`PATCH /api/users/[id]/role`** - Update user roles (admin only)

### 🎯 Twitch Integration (Coming Soon)
- **`GET /api/twitch/auth`** - Twitch OAuth (placeholder)
- **`GET /api/twitch/callback`** - OAuth callback (placeholder)
- **`POST /api/twitch/webhook`** - Event webhooks (placeholder)
- **`GET /api/twitch/events`** - Recent events (placeholder)
- **`GET /api/twitch/status`** - Connection status (placeholder)

### 📊 Utility
- **`GET /api/version`** - Git commit hash and version info

---

## 🗄️ Database Schema

Using **Drizzle ORM** with **PostgreSQL** for type-safe database operations:

### Tables
- **`track_logs`** - Spotify track history
  - `id`, `track`, `artist`, `albumArt`, `duration`, `loggedAt`
- **`userRoles`** - User authentication and permissions
  - `id`, `username`, `isModerator`, `isBanned`
- **`song_requests`** - Song request queue
  - `id`, `spotifyUri`, `title`, `artist`, `requestedBy`, `createdAt`
- **`spotify_themes`** - Dynamic CSS themes
  - `id`, `name`, `css`, `isActive`, `createdAt`, `updatedAt`

### ORM Features
- **Type-safe queries** with full TypeScript support
- **Automatic migrations** with `drizzle-kit`
- **Connection pooling** for optimal performance
- **Prepared statements** for security

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with modern features
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety throughout
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[React Icons](https://react-icons.github.io/react-icons/)** - Professional icon library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless functions
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database queries
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[JWT](https://jwt.io/)** - Secure token-based authentication

### Integrations
- **[Spotify Web API](https://developer.spotify.com/documentation/web-api/)** - Music data and authentication
- **[Discord API](https://discord.com/developers/docs/)** - User authentication via OAuth
- **Twitch API** - Future integration for stream events

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting and serverless functions (free tier)
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (free tier)
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

---

## 🚀 Quick Start

### Free Deployment (Recommended)

1. **Fork this repository** on GitHub
2. **Deploy to Vercel:**
   - Connect your GitHub account to Vercel
   - Import your forked repository
   - Vercel will automatically detect Next.js settings
3. **Set up Neon database:**
   - Create free account at [neon.tech](https://neon.tech)
   - Create a new project and copy the connection string
4. **Configure environment variables** in Vercel dashboard
5. **Set up Discord/Spotify apps** (see setup section below)

### Local Development

#### Prerequisites
- **Node.js 20+**
- **pnpm 8+** (recommended) or npm/yarn
- **PostgreSQL database** (local or cloud)

#### Setup Steps

1. **Clone and install:**
   ```bash
   git clone https://github.com/oyuh/streamthing.git
   cd streamthing
   pnpm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials (see section below)
   ```

3. **Database setup:**
   ```bash
   pnpm run db:push
   ```

4. **Start development:**
   ```bash
   pnpm dev
   ```

5. **Production build:**
   ```bash
   pnpm build
   pnpm start
   ```

---

## ⚙️ Configuration

### Required Environment Variables

Create `.env.local` from `.env.local.example` and configure:

#### Authentication & Security
```bash
# JWT secret for secure authentication (generate a long random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Discord OAuth (create app at https://discord.com/developers/applications)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/discord/callback
```

#### Spotify Integration
```bash
# Spotify Web API (create app at https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/auth/callback

# Optional: Development access token for testing
DEV_SPOTIFY_ACCESS_TOKEN=your_dev_token_here
```

#### Database
```bash
# PostgreSQL connection string (Neon, Vercel Postgres, or self-hosted)
DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
```

#### Optional: Twitch (Coming Soon)
```bash
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_REDIRECT_URI=https://yourdomain.com/api/twitch/callback
TWITCH_SECRET=webhook_secret_string
```

#### Site Configuration
```bash
# Your domain (for redirects and CORS)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Setting Up OAuth Apps

#### Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Go to OAuth2 → General
4. Add redirect URL: `https://yourdomain.com/api/discord/callback`
5. Copy Client ID and Client Secret

#### Spotify Application
1. Go to [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Create new app
3. Add redirect URL: `https://yourdomain.com/api/spotify/auth/callback`
4. Copy Client ID and Client Secret

---

## 📦 Package Manager Migration

This project uses **pnpm** for better performance and disk efficiency.

### Migrating from npm to pnpm

#### Automatic Migration
- **Windows**: Run `migrate-to-pnpm.bat`
- **macOS/Linux**: Run `./migrate-to-pnpm.sh`

#### Manual Migration
```bash
# Install pnpm globally
npm install -g pnpm

# Clean npm artifacts
rm -rf node_modules package-lock.json

# Install with pnpm
pnpm install
```

### Why pnpm?
- **Faster installs** - Links packages instead of copying
- **Disk space efficient** - Shared package store
- **Strict dependency resolution** - Better security
- **Lockfile consistency** - Reliable builds

---

## 🔒 Security Features

- **JWT Authentication** - Tamper-proof tokens with expiration
- **HttpOnly Cookies** - Protected from XSS attacks
- **Role-based Access** - Moderator and admin permissions
- **CSRF Protection** - Secure cookie settings
- **Input Validation** - Sanitized user inputs
- **Rate Limiting** - API abuse prevention (via Vercel)

---

## 🎯 Roadmap

### Current Features ✅
- Spotify integration with real-time overlays
- Dynamic CSS theming system
- Song request management
- Secure JWT authentication
- User role management
- Beautiful modern UI

### Coming Soon 🚧
- **Twitch integration** - Events, chat commands, webhooks
- **Advanced analytics** - Play counts, user statistics
- **Custom widgets** - Follower goals, donation tracking
- **Mobile app** - React Native companion
- **Plugin system** - Third-party integrations

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 💝 Support

If streamthing helped your streaming setup, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🔗 Sharing with other creators

---

**Built with ❤️ by [Lawson Hart](https://github.com/oyuh) for the streaming community.**
