const { Router } = require("express");
const conferenceRouter = Router();
const {
  registerAttendanceByUser,
  registerAttendanceConferenceCurrent,
  getConferenceDayUser,
  POST_ANY_ATTENDANCE,
  createConference,
  getConferences,
  getOneConference,
  updateConference,
  deleteConference,
} = require("../../controllers/v2/conference.controller");
const {
  authMid,
  isAtLeastOrganizer,
  isAdmin,
  isAtLeastContentManager,
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


// CRUD
conferenceRouter.route("/").post(authMid, isAtLeastContentManager, createConference)
conferenceRouter.route("/").get(getConferences)
conferenceRouter.route("/:idConference").get(getOneConference)
conferenceRouter.route("/:idConference").put(authMid, isAtLeastContentManager, updateConference)
conferenceRouter.route("/:idConference").delete(authMid, isAdmin, deleteConference)

module.exports = conferenceRouter;
