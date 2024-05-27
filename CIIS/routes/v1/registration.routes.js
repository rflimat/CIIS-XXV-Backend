const { Router } = require("express");
const fileUpload = require("express-fileupload");
const registrationRouter = Router();
const {
  getRegistrations,
  getImagesOfTheReserve,
  updateEnrollmentStatus,
  updateRegistrationObserved,
  sendQRToUser
} = require("../../controllers/registration.controller");
const { checkAuth, checkRole } = require("../../middlewares/auth");
const {uploadFile} = require("../../middlewares/upload.file");
const { validateFileOptional, validateFileUniversity } = require("../../middlewares/validateExistenceOfRecord");
const reservationViewImagesDTO = require("../../DTO/reservation.view.image.dto");
const { reservationUpdateStatusDTO } = require("../../DTO/reservation.update.dto");
const userUpdateDTO = require("../../DTO/user.update.event.dto");

registrationRouter.post("/send-qr",sendQRToUser);
registrationRouter.patch(
  "/:idReserve/status",
  checkAuth,
  checkRole(["Administrador"]),
  reservationUpdateStatusDTO,
  updateEnrollmentStatus
);
registrationRouter.get(
  "/:idReserve/files/:folder",
  checkAuth,
  checkRole(["Administrador"]),
  reservationViewImagesDTO,
  getImagesOfTheReserve
);
registrationRouter.get(
  "/",
  checkAuth,
  checkRole(["Administrador"]),
  getRegistrations
);
registrationRouter.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
registrationRouter.put(
  "/:idReserve",
  checkAuth,
  checkRole(["Administrador"]),
  validateFileOptional("filevoucher",["jpg", "jpeg", "png"]),
  validateFileUniversity,
  userUpdateDTO,
  updateRegistrationObserved
);

module.exports = registrationRouter;