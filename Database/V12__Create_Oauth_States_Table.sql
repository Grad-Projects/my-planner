-- Create State table
CREATE TABLE "OauthStates" (
    "id" SERIAL PRIMARY KEY,
    "state" VARCHAR(255) UNIQUE NOT NULL,
    "code_verifier" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);