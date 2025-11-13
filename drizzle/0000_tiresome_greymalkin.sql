CREATE TABLE "request_logs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" text NOT NULL,
	"action" text NOT NULL,
	"moderator_id" text NOT NULL,
	"moderator_username" text NOT NULL,
	"requested_by" text NOT NULL,
	"song_title" text NOT NULL,
	"song_artist" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "song_requests" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_uri" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"requested_by" text NOT NULL,
	"approved" boolean DEFAULT false,
	"rejected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "spotify_themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"css" text NOT NULL,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "spotify_themes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "spotify_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track_logs" (
	"position" integer PRIMARY KEY NOT NULL,
	"track" text NOT NULL,
	"artist" text NOT NULL,
	"album_art" text NOT NULL,
	"duration" text NOT NULL,
	"logged_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track_requests" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link" text NOT NULL,
	"requested_by" text NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "twitch_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"is_moderator" boolean DEFAULT false,
	"is_streamer" boolean DEFAULT false,
	"is_banned" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
