const { Router } = require("express");
const fileUpload = require("express-fileupload");
const routerRegister = Router();
const userRegisterDTO = require("../../DTO/user.register.event.dto");
const {
  createPreRegisterUser,
} = require("../../controllers/reservation.controller");
const {uploadFile} = require("../../middlewares/upload.file");
const handleRecaptcha = require("../../middlewares/handleRecaptcha");
const {
  validateKeyTypeAttende,
} = require("../../middlewares/validateExistenceOfRecord");
const { handleErrorResponse } = require("../../middlewares/handleError");

routerRegister.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/**
 * En producción
 */
// routerRegister.post(
//   "/",
//   handleRecaptcha,
//   uploadFile("imgvoucher", ["jpg", "jpeg", "png"]),
//   userRegisterDTO,
//   validateKeyTypeAttende,
//   createPreRegisterUser
// );

// routerRegister.post("/",(req,res)=>{
//   handleErrorResponse(res,'Ya no se aceptan inscripciones virtuales',400);
// });
/**
 * En desarrollo (desactivamos el handleRecaptcha)
 */
routerRegister.post(
  "/",
  uploadFile("imgvoucher", ["jpg", "jpeg", "png"]),
  userRegisterDTO,
  validateKeyTypeAttende,
  createPreRegisterUser
);

module.exports = routerRegister;
