-- Drop tables if they exist
DROP TABLE IF EXISTS "Appointments" CASCADE;
DROP TABLE IF EXISTS "Notes" CASCADE;
DROP TABLE IF EXISTS "TodoItems" CASCADE;
DROP TABLE IF EXISTS "TimeTrackerItems" CASCADE;
DROP TABLE IF EXISTS "TimeUnits" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Create Users table
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL
);

-- Create end_of_day function
CREATE OR REPLACE FUNCTION end_of_day(ts TIMESTAMP)
RETURNS TIMESTAMP AS $$
BEGIN
  RETURN date_trunc('day', ts) + INTERVAL '1 day' - INTERVAL '1 second';
END;
$$ LANGUAGE plpgsql;

-- Create Appointments table
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

-- Create Notes table
CREATE TABLE "Notes" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" text,
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now())
);

-- Create TodoItems table
CREATE TABLE "TodoItems" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "item" VARCHAR(255) NOT NULL,
  "is_completed" bool NOT NULL DEFAULT false,
  "is_deleted" bool NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now())
);

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

-- Create TimeUnits table
CREATE TABLE "TimeUnits" (
  "id" SERIAL PRIMARY KEY,
  "description" VARCHAR(255) NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "Appointments" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "Notes" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TodoItems" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TimeTrackerItems" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TimeTrackerItems" ADD FOREIGN KEY ("time_unit") REFERENCES "TimeUnits" ("id");

-- Create prevent_email_update function
CREATE OR REPLACE FUNCTION prevent_email_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email IS DISTINCT FROM NEW.email THEN
    RAISE EXCEPTION 'The email column is immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce immutability of email column
CREATE TRIGGER prevent_email_update_trigger
BEFORE UPDATE ON "Users"
FOR EACH ROW
EXECUTE FUNCTION prevent_email_update();

-- Insert test user
INSERT INTO "Users" ("email")
VALUES ('user@example.com');

-- Insert hours time unit
INSERT INTO "TimeUnits" ("description")
VALUES ('Hours');

-- Insert minutes time unit
INSERT INTO "TimeUnits" ("description")
VALUES ('Minutes');

-- Insert seconds time unit
INSERT INTO "TimeUnits" ("description")
VALUES ('Seconds');

-- Insert a new appointment into the Appointments table
INSERT INTO "Appointments" ("user_id", "title", "description", "start_time", "length", "is_deleted")
VALUES (
    (SELECT "id" FROM "Users" ORDER BY "id" LIMIT 1),
    'Meeting',
    'Discuss project plans',
    now(),
    1,
    false
);

-- Insert a new note into the Notes table
INSERT INTO "Notes" ("user_id", "title", "content", "is_deleted")
VALUES (
    (SELECT "id" FROM "Users" ORDER BY "id" LIMIT 1),
    'Meeting Notes',
    'Discussed project milestones.',
    false
);

-- Insert a new item into the TimeTrackerItems table
INSERT INTO "TimeTrackerItems" ("user_id", "description", "length", "time_unit", "is_deleted")
VALUES (
    (SELECT "id" FROM "Users" ORDER BY "id" LIMIT 1),
    'Worked on project XYZ',
    2,
    (SELECT "id" FROM "TimeUnits" where description = 'Hours'  LIMIT 1),
    false
);

-- Insert a new item into the TodoItems table
INSERT INTO "TodoItems" ("user_id", "item", "is_completed", "is_deleted")
VALUES (
    (SELECT "id" FROM "Users" ORDER BY "id" LIMIT 1),
    'Finish report',
    false,
    false
);
