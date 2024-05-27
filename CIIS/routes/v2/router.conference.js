const { Router } = require("express");
const conferenceRouter = Router();
const {
  registerAttendanceByUser,
  registerAttendanceConferenceCurrent,
  getConferenceDayUser,
  POST_ANY_ATTENDANCE,
} = require("../../controllers/v2/conference.controller");
const {
  authMid,
  isAtLeastOrganizer,
  isAdmin,
} = require("../../middlewares/v2/auth");
const {
  validateExistUser,
  validateExistEvent,
} = require("../../middlewares/validateExistenceOfRecord");
const conferenceAttendanceDTO = require("../../DTO/conference.attendance.dto");

conferenceRouter
  .post("/:conferenceId/attendance", authMid, registerAttendanceByUser)
  .post(
    "/event/:idEvent/attendance",
    authMid,
    isAtLeastOrganizer,
    conferenceAttendanceDTO,
    validateExistEvent,
    validateExistUser,
    registerAttendanceConferenceCurrent
  )
  .get("/schedule-day", authMid, getConferenceDayUser);

conferenceRouter.route("/:id").post(authMid, isAdmin, POST_ANY_ATTENDANCE);

module.exports = conferenceRouter;
