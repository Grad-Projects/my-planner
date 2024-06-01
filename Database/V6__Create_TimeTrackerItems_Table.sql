-- Create TimeTrackerItems table
CREATE TABLE "TimeTrackerItems" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "length" int NOT NULL,
  "time_unit" int NOT NULL,
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now())
);