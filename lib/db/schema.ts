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
    isModerator: d.boolean("is_moderator").default(false),
    isBanned: d.boolean("is_banned").default(false),
    createdAt: d.timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  })
);

// Track logs table
export const trackLogs = createTable(
  "track_logs",
  (d) => ({
    id: d.serial("id").primaryKey(),
    track: d.text("track").notNull(),
    artist: d.text("artist").notNull(),
    albumArt: d.text("album_art").notNull(),
    duration: d.text("duration").notNull(),
    loggedAt: d.timestamp("logged_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (table) => {
    return {
      loggedAtIdx: sql`CREATE INDEX IF NOT EXISTS "track_logs_logged_at_idx" ON "track_logs" ("logged_at" DESC)`
    };
  }
);
