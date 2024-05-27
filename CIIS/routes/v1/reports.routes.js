const {Router}=require("express");
const routerReports=Router();
const {getReportsRegistrations,getReportsAttendanceEvent}=require("../../controllers/reports.controller");
const reportReservationDTO=require("../../DTO/reports.reservations.dto");
const {checkAuth,checkRole}=require("../../middlewares/auth");
routerReports.get('/event/:idEvent/registrations',checkAuth,checkRole(["Administrador"]),reportReservationDTO,getReportsRegistrations);
routerReports.get('/event/:idEvent/attendance',checkAuth,checkRole(["Administrador"]),reportReservationDTO,getReportsAttendanceEvent);

module.exports=routerReports;