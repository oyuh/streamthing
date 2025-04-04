import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const spotifyTokens = pgTable('spotify_tokens', {
  id: text('id').primaryKey().default('singleton'),
  access_token: text('access_token').notNull(),
  refresh_token: text('refresh_token').notNull(),
  updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

export const twitchEvents = pgTable('twitch_events', {
    id: text('id').primaryKey(), // Twitch event ID
    username: text('username').notNull(),
    type: text('type').notNull(), // "follow"
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
  });
