CREATE TYPE "public"."site_slide_kind" AS ENUM('gotech', 'mikro');--> statement-breakpoint
CREATE TABLE "site_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "site_slide_kind" DEFAULT 'gotech' NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"gradient" text DEFAULT 'from-red-600 via-red-500 to-orange-500' NOT NULL,
	"badge" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_texts" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
