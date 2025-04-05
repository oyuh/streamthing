import { pgTable, text, serial, boolean, timestamp, } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm'; // ✅ Add this line!

export const spotifyTokens = pgTable('spotify_tokens', {
    id: text('id').primaryKey(), // Always 'singleton'
    access_token: text('access_token').notNull(),
    refresh_token: text('refresh_token').notNull(),
    updated_at: timestamp('updated_at').notNull(),
  });

export const twitchEvents = pgTable('twitch_events', {
    id: serial('id').primaryKey(),
    type: text('type').notNull(),            // like "stream.online"
    data: text('data').notNull(),            // raw JSON stringified
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });


  export const songRequests = pgTable('song_requests', {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    spotifyUri: text('spotify_uri').notNull(),
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    requestedBy: text('requested_by').notNull(),
    approved: boolean('approved').default(false),
    rejected: boolean('rejected').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  });

  export const trackRequests = pgTable('track_requests', {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    link: text('link').notNull(),
    requestedBy: text('requested_by').notNull(),
    status: text('status').default('pending'), // pending | approved | rejected
    createdAt: timestamp('created_at').defaultNow(),
  });

  export const userRoles = pgTable('user_roles', {
    id: text('id').primaryKey(), // Discord ID
    username: text('username'),
    isModerator: boolean('is_moderator').default(false),
    isBanned: boolean('is_banned').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  });
