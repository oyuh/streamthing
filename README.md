
# 🎧 Spotify + 🟣 Twitch Overlay (StreamThing)

A slick, dark-mode-ready stream overlay that shows:

- ✅ Currently playing Spotify track
- ✅ Live Twitch stream status (via EventSub)
- ✅ Real-time updates
- ✅ Designed for Streamlabs / OBS browser sources
- ✅ Discord-authenticated control panel

---

## 🚀 Features

- 🎵 **Spotify Widget**
  Shows currently playing song with title, artist, and album cover.

- 🟣 **Twitch Integration**
  Uses `stream.online` EventSub webhook to display live status.

- 🔐 **Discord Login System**
  Only you can connect Spotify & Twitch through the dashboard.

- 🖼️ **Streamlabs-Ready**
  All overlays render on full-screen dark background, with optional transparency.

---

## 📦 Tech Stack

- [Next.js 15+](https://nextjs.org)
- TypeScript
- Drizzle ORM + Neon Postgres
- Spotify Web API
- Twitch EventSub Webhooks
- Discord OAuth2 (for just general access to everything)
- TailwindCSS / Inline Styles (kinda)

---

## 🔧 Setup Instructions

### 1. **Clone the repo**

```bash
git clone https://github.com/your-username/streamthing.git
cd streamthing
npm install
```

---

### 2. **Environment Variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update it with your keys:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Discord
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
DISCORD_REDIRECT_URI=https://yourdomain.com/api/discord/callback
NEXT_PUBLIC_ALLOWED_DISCORD_USERS=your_discord_id_here

# Spotify
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/auth/callback

# Twitch
TWITCH_CLIENT_ID=xxx
TWITCH_CLIENT_SECRET=xxx
TWITCH_REDIRECT_URI=https://yourdomain.com/api/twitch/callback
TWITCH_SECRET=some_super_secret_string

# Postgres (Neon or Vercel DB)
DATABASE_URL=postgres://...
```

---

### 3. **Database**

Make sure your `DATABASE_URL` points to a working Postgres DB (Neon recommended).
Run Drizzle migrations if needed (I personally don't use that).

---

### 4. **Deploy**

Use [Vercel](https://vercel.com) for instant hosting.

```bash
vercel
```

Or link manually:

```bash
vercel link
vercel env pull .env.local
vercel deploy
```

---

## 🔑 Admin Access (Discord Auth)

Only Discord user IDs in `NEXT_PUBLIC_ALLOWED_DISCORD_USERS` can:

- Access the main panel `/`
- Connect Spotify and Twitch accounts

---

## 🌐 Overlay URLs (Use in Streamlabs/OBS)

| Feature        | URL                            |
|----------------|---------------------------------|
| Spotify Overlay| `https://yourdomain.com/spotify` |
| Twitch Events  | `https://yourdomain.com/events`  |

> 💡 Add these as **browser sources** in OBS / Streamlabs with resolution: `1920x1080`, background transparent.

---

## 🧪 Test Locally

```bash
npm run dev
```

Preview at `http://localhost:3000`

---

## 🧼 TODO / Improvements

- [ ] Stream event queueing / animation
- [ ] Twitch `stream.offline` support
- [ ] Follow event tracking (when Affiliate)
- [ ] Manual log viewer for debug
- [ ] Actually make the twitch shit work lol

---

## 💬 Need Help?

Reach out to [@lawson](https://github.com/oyuh), [@wthlaw](https://discord.com/users/527167786200465418) or fork the project.

---

## 📜 License

MIT
