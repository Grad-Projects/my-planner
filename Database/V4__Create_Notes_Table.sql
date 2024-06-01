-- Create Notes table
CREATE TABLE "Notes" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" text,
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now())
);