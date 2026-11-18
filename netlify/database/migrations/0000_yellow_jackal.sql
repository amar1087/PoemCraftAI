CREATE TABLE "poems" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"names" text,
	"style" text NOT NULL,
	"content" text NOT NULL,
	"children_theme" text,
	"children_options" text[],
	"learning_topic" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
