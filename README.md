# 🎧 Spotify Song Request Panel

A full-stack web app that lets users submit Spotify song links for approval via a clean frontend UI. Moderators can approve or reject requests, ban/unban users, and manage user roles — all protected with Discord OAuth2. Supports external integration with a simple API for use in bots or companion tools.

Built with:
- 🔥 Next.js 15 (App Router)
- 🐘 PostgreSQL (Vercel/Neon)
- 🎵 Spotify API
- 🧑‍💻 Discord OAuth2
- 🎨 TailwindCSS
- 🍡 Drizzle ORM

---

## ✨ Features

- 🔐 Discord Login (OAuth2)
- 🎵 Submit Spotify song links
- 🧑‍⚖️ Admin panel to manage user roles
- ✅ Moderators can approve/deny requests
- ❌ Banned users cannot submit
- 📃 History of requests
- 🧠 Rate limiting (5s per IP)
- 🔌 API access for Discord bots / external tools
- 🔒 Fully protected routes

---

## 🧠 Database Schema (PostgreSQL)

```sql
CREATE TABLE spotify_tokens (
  id TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE twitch_events (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE song_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_uri TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  rejected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE track_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  link TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  username TEXT,
  is_moderator BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

# 🚀 Getting Started (Dev)

## 1. Clone & Install

```bash
git clone https://github.com/yourname/spotify-overlay-nextjs.git
cd spotify-overlay-nextjs
npm install

```

## 2. Environment Variables
Create a `.env.local` file:

```
# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/discord/callback
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Spotify Auth
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

# Database
DATABASE_URL=your_postgresql_connection_string
```

## 3. Start Dev Server

```
npm run dev
```

# 🤖 Discord Bot Integration
You can use the song request API externally from a Discord bot like this:

```ts
// discord-bot/src/commands/request.ts
import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
  data: new SlashCommandBuilder()
    .setName('request')
    .setDescription('Request a Spotify song')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Spotify track link')
        .setRequired(true)
    ),
  async execute(interaction) {
    const link = interaction.options.getString('link');
    const user = interaction.user;

    const res = await fetch('https://your-app-url/api/spotify/submit-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link,
        requestedBy: `${user.username} (${user.id})`,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      await interaction.reply(`✅ Song request submitted!`);
    } else {
      await interaction.reply(`❌ Error: ${data.error}`);
    }
  },
};

```

# 🧪 API Endpoints
| Method      | Endpoint | Description     |
| :---        |    :----:   |          ---: |
| POST      | /api/spotify/submit-link      | 	Submit a song  |
| PATCH   | /api/spotify/requests    | 	Approve/Reject song (mod only)  |
| GET   | 	/api/spotify/requests  | 	List requests (mod only)  |
| PATCH   |/api/users/:id/role | Update role/ban status (admin) |
| GET   |	/api/users/:id/role |	Get user role info |
| GET   |/api/user | Current user info from cookie |

# 🐛 Common Errors & Fixes
| ❗ Error    | ✅ Fix |
| ----------- | ----------- |
| params.id must be awaited in route handlers     | Use proper { params }: { params: { id: string } } type |
| cookies().get(...) is not awaited  | Use const cookieStore = cookies(); NOT async |
| Spotify 401 error  | Refresh token is auto-handled — verify in .env |
| Vercel deploy fails  | 	Ensure route typing is correct (see this repo's route.ts) |


-- Contributions welcome! PRs & Issues appreciated.
