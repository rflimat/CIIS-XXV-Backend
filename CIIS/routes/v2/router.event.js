const { Router } = require("express");
const eventRouter = Router();

const { authMid, isAtLeastOrganizer } = require("../../middlewares/v2/auth");
const {
  validateExistUser,
  validateExistEvent,
} = require("../../middlewares/validateExistenceOfRecord");
const {
  getCountAttendances,
  getEventReport,
} = require("../../controllers/v2/events.controller");

eventRouter.get(
  "/:idEvent/attendances",
  authMid,
  validateExistEvent,
  getCountAttendances
);

eventRouter.route("/:id/report").get(isAtLeastOrganizer, getEventReport);

module.exports = eventRouter;
