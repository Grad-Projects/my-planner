const { Router } = require('express');
const controller = require("./controller");
const router = Router();

router.get("/notes", controller.getUserNotes);
router.get("/todo-items", controller.getUserTodoItems);
router.get("/time-tracker-items", controller.getUserTimeTrackerItems);
router.get("/appointments", controller.getUserAppointments);
router.get("/oauth-state", controller.getOauthStateAndCodeVerifier);

router.patch("/remove/:table/:id", controller.updateIsDeleted);
router.patch("/update/todo-item-completion/:id", controller.updateTodoItemCompleted);
router.patch("/update/time-tracker-unit/:id", controller.updateTimeUnit);
router.patch('/update/time-tracker-length/:id', controller.updateTimeTrackerItemLength);

router.post("/create/appointments", controller.createAppointment);
router.post("/create/notes", controller.createNote);
router.post("/create/time-tracker-items", controller.createTimeTrackerItem);
router.post("/create/todo-items", controller.createTodoItem);
router.post("/create/user", controller.createUser);
router.post("/create/oauth-state", controller.createOauthStateAndCodeVerifier);
router.post('/validate-token', controller.validateToken);

module.exports = router;