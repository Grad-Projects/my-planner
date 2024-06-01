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