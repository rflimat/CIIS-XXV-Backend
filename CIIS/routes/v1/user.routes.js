const fileUpload = require("express-fileupload");
const { Router } = require("express");
const routerUser = Router();
const { checkAuth, checkRole, checkTokenTemporary, checkTokenTemporaryToCreateAccount } = require("../../middlewares/auth");
const { userRegisterDTO, userEmailDTO, userCheckEmailCodeDTO, userCreateAccountDTO } = require("../../DTO/user.register.dto");
const { createUserOrganizer, createAccountUser, checkEmailToCreateAccount, checkCodeToCreateAccount, getPreviousInfoUser } = require("../../controllers/user.controller");
const { validateExistAccountUser } = require("../../middlewares/validateExistenceOfRecord");

routerUser.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

routerUser.post('/previous-register', userEmailDTO, validateExistAccountUser, checkEmailToCreateAccount);
routerUser.get('/check-code', userCheckEmailCodeDTO, checkCodeToCreateAccount);
routerUser.get('/info', checkTokenTemporary, getPreviousInfoUser);
//routerUser.post('/register',checkTokenTemporaryToCreateAccount,validateExistAccountUser,userCreateAccountDTO,createAccountUser);
routerUser.post('/register', createAccountUser);
routerUser.post('/', checkAuth, checkRole(["Administrador"]), userRegisterDTO, createUserOrganizer); // si funciona

module.exports = routerUser;

/*
organizador 3
administrador 1
// asistente
*/
