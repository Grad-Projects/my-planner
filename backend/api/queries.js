const getUserNotes = `
  SELECT * FROM "public"."notes" 
  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND "is_deleted" = false
`;

const getUserTodoItems = `
  SELECT * FROM "public"."todo_items" 
  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND "is_deleted" = false
`;

const getUserTimeTrackerItems = `
  SELECT t.*, u.description AS time_unit_description 
  FROM "public"."time_tracker_items" t
  INNER JOIN "public"."time_units" u ON t.time_unit = u.id
  WHERE t."user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND t."is_deleted" = false
`;

const getUserAppointments = `
  SELECT * FROM "public"."appointments" 
  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND "is_deleted" = false
`;


const updateIsDeleted = (table) => `
  UPDATE "public"."${table}" 
  SET "is_deleted" = true 
  WHERE "id" = $1 
  AND "is_deleted" = false
  AND "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $2)
  RETURNING *;
`;


const updateTodoItemCompleted = `
  UPDATE "public"."todo_items"
  SET "is_completed" = CASE 
                          WHEN "is_completed" = true THEN false
                          ELSE true
                       END
  WHERE "id" = $1
  AND "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $2)
  AND "is_deleted" = false
  RETURNING *;
`;


const updateTimeUnit = `
  UPDATE "public"."time_tracker_items" 
  SET "time_unit" = $1 
  WHERE "id" = $2 
  AND "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $3)
  AND "is_deleted" = false
  RETURNING *;
`;

const updateTimeTrackerItemLength = `
  UPDATE "public"."time_tracker_items" 
  SET "length" = $1 
  WHERE "id" = $2 
  AND "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $3)
  AND "is_deleted" = false
  RETURNING *;
`;

const createAppointment = `
  INSERT INTO Appointments (user_id, title, description, start_time, length, is_deleted, created_at)
  VALUES ((SELECT id FROM Users WHERE email = $1), $2, $3, $4, $5, false, CURRENT_TIMESTAMP)
  RETURNING *;
`;

const createNote = `
  INSERT INTO Notes (user_id, title, content, is_deleted, created_at)
  VALUES ((SELECT id FROM Users WHERE email = $1), $2, $3, false, CURRENT_TIMESTAMP)
  RETURNING *;
`;

const createTodoItem = `
  INSERT INTO Todo_Items (user_id, item, is_completed, is_deleted, created_at)
  VALUES ((SELECT id FROM Users WHERE email = $1), $2, false, false, CURRENT_TIMESTAMP)
  RETURNING *;
`;

const createTimeTrackerItem = `
  INSERT INTO Time_Tracker_Items (user_id, description, length, time_unit, is_deleted, created_at)
  VALUES ((SELECT id FROM Users WHERE email = $1), $2, $3, $4, false, CURRENT_TIMESTAMP)
  RETURNING *;
`;

const createUser = `
  INSERT INTO Users (email)
  VALUES ($1)
`;


//TODO: Any missing update endpoints for appointments

module.exports = {
    getUserNotes,
    getUserTodoItems,
    getUserTimeTrackerItems,
    getUserAppointments,
    updateIsDeleted,
    updateTodoItemCompleted,
    updateTimeUnit,
    updateTimeTrackerItemLength,
    createAppointment,
    createNote,
    createTodoItem,
    createTimeTrackerItem,
    createUser,
}