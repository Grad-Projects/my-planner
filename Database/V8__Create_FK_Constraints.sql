-- Add foreign key constraints
ALTER TABLE "Appointments" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "Notes" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TodoItems" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TimeTrackerItems" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");
ALTER TABLE "TimeTrackerItems" ADD FOREIGN KEY ("time_unit") REFERENCES "TimeUnits" ("id");