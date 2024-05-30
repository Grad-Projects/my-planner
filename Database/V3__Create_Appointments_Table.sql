-- Create Appointments table with length constraint in hours
CREATE TABLE "Appointments" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" text,
  "start_time" TIMESTAMP NOT NULL,
  "length" int NOT NULL, -- length in hours
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  CHECK ("length" < EXTRACT(EPOCH FROM (end_of_day("start_time") - "start_time")) / 3600)
);