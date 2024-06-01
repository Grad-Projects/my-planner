-- Create TodoItems table
CREATE TABLE "TodoItems" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "item" VARCHAR(255) NOT NULL,
  "is_completed" bool NOT NULL DEFAULT false,
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now())
);