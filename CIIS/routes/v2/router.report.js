const { Router } = require("express");
const routerReport = Router();
const {
  getReportsRegistrations,
  getReportsAttendanceEvent,
} = require("../../controllers/v2/reports.controller");
const reportReservationDTO = require("../../DTO/reports.reservations.dto");
const { isAdmin } = require("../../middlewares/v2/auth");

routerReport.get(
  "/event/:idEvent/registrations",
  isAdmin,
  reportReservationDTO,
  getReportsRegistrations
);
routerReport.get(
  "/event/:idEvent/attendance",
  isAdmin,
  reportReservationDTO,
  getReportsAttendanceEvent
);

module.exports = routerReport;
