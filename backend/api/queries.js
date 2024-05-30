const getUserNotesQuery = `
  SELECT * FROM "public"."notes" 
  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND "is_deleted" = false
`;

const getUserTodoItems = `
  SELECT * FROM "public"."todoitems" 
  WHERE "user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND "is_deleted" = false
`;

const getUserTimeTrackerItems = `
  SELECT t.*, u.description AS time_unit_description 
  FROM "public"."timetrackeritems" t
  INNER JOIN "public"."timeunits" u ON t.time_unit = u.id
  WHERE t."user_id" = (SELECT id FROM "public"."users" WHERE "email" = $1) 
  AND t."is_deleted" = false
`;

//TODO: get appointments and update checklist boolean, time tracker time units, and is_deleted bools

module.exports = {
    getUserNotesQuery,
    getUserTodoItems,
    getUserTimeTrackerItems,
}