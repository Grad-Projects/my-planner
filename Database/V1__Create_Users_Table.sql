-- Create Users table with auto-incrementing id
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL
);