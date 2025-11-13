import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

// Spotify tokens table
export const spotifyTokens = createTable(
  "spotify_tokens",
  (d) => ({
    id: d.text("id").primaryKey(), // Always 'singleton'
    access_token: d.text("access_token").notNull(),
    refresh_token: d.text("refresh_token").notNull(),
    updated_at: d.timestamp("updated_at").notNull(),
  })
);

// Twitch events table
export const twitchEvents = createTable(
  "twitch_events",
  (d) => ({
    id: d.serial("id").primaryKey(),
    type: d.text("type").notNull(),            // like "stream.online"
    data: d.text("data").notNull(),            // raw JSON stringified
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  })
);

// Song requests table
export const songRequests = createTable(
  "song_requests",
  (d) => ({
    id: d.text("id").primaryKey().default(sql`gen_random_uuid()`),
    spotifyUri: d.text("spotify_uri").notNull(),
    title: d.text("title").notNull(),
    artist: d.text("artist").notNull(),
    requestedBy: d.text("requested_by").notNull(),
    approved: d.boolean("approved").default(false),
    rejected: d.boolean("rejected").default(false),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  })
);

// Track requests table
export const trackRequests = createTable(
  "track_requests",
  (d) => ({
    id: d.text("id").primaryKey().default(sql`gen_random_uuid()`),
    link: d.text("link").notNull(),
    requestedBy: d.text("requested_by").notNull(),
    status: d.text("status").default("pending"), // pending | approved | rejected
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  })
);

// User roles table
export const userRoles = createTable(
  "user_roles",
  (d) => ({
    id: d.text("id").primaryKey(), // Discord ID
    username: d.text("username"),
    avatar: d.text("avatar"), // Discord avatar hash
    isModerator: d.boolean("is_moderator").default(false),
    isStreamer: d.boolean("is_streamer").default(false),
    isBanned: d.boolean("is_banned").default(false),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  })
);

// Track logs table - now using position numbers instead of serial IDs
export const trackLogs = createTable(
  "track_logs",
  (d) => ({
    // Position from 1-150, where 1 is the newest track
    position: d.integer("position").primaryKey(),
    track: d.text("track").notNull(),
    artist: d.text("artist").notNull(),
    albumArt: d.text("album_art").notNull(),
    duration: d.text("duration").notNull(),
    loggedAt: d.timestamp("logged_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  })
);

// Spotify themes table
export const spotifyThemes = createTable(
  "spotify_themes",
  (d) => ({
    id: d.serial("id").primaryKey(),
    name: d.text("name").notNull().unique(),
    css: d.text("css").notNull(),
    isActive: d.boolean("is_active").default(false),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  })
);

// Request logs table - auto-deletes after 7 days
export const requestLogs = createTable(
  "request_logs",
  (d) => ({
    id: d.text("id").primaryKey().default(sql`gen_random_uuid()`),
    requestId: d.text("request_id").notNull(),
    action: d.text("action").notNull(), // 'approved' | 'rejected' | 'banned'
    moderatorId: d.text("moderator_id").notNull(),
    moderatorUsername: d.text("moderator_username").notNull(),
    requestedBy: d.text("requested_by").notNull(),
    songTitle: d.text("song_title").notNull(),
    songArtist: d.text("song_artist").notNull(),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  })
);

// Ban logs table - permanent record of all bans and unbans
export const banLogs = createTable(
  "ban_logs",
  (d) => ({
    id: d.text("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: d.text("user_id").notNull(), // Discord ID of banned/unbanned user
    username: d.text("username").notNull(),
    action: d.text("action").notNull(), // 'banned' | 'unbanned'
    reason: d.text("reason"), // Optional reason for ban/unban
    moderatorId: d.text("moderator_id").notNull(),
    moderatorUsername: d.text("moderator_username").notNull(),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  })
);
