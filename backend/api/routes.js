const { Router } = require('express');
const controller = require("./controller");
const router = Router();

router.get("/notes",  controller.getUserNotes);
router.get("/todo-items",  controller.getUserTodoItems);
router.get("/time-tracker-items",  controller.getUserTimeTrackerItems);


module.exports = router;