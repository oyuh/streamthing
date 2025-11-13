CREATE TABLE "ban_logs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"moderator_id" text NOT NULL,
	"moderator_username" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
