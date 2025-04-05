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
    id: serial('id').primaryKey(),
    spotifyUri: text('spotify_uri').notNull(), // e.g. spotify:track:xyz123
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    requestedBy: text('requested_by').notNull(), // from Twitch username
    approved: boolean('approved').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  });

  export const trackRequests = pgTable('track_requests', {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    link: text('link').notNull(),
    requestedBy: text('requested_by').notNull(),
    status: text('status').default('pending'), // pending | approved | rejected
    createdAt: timestamp('created_at').defaultNow(),
  });
