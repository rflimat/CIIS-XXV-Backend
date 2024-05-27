const { Router } = require('express');
const sessionRouter = Router();
const userLoginDTO=require('../../DTO/user.login.event.dto');
const { startSession, endSession }=require('../../controllers/session.controller');
const {checkSession}=require("../../middlewares/auth")
sessionRouter.post('/', checkSession,userLoginDTO, startSession);
sessionRouter.delete('/', endSession);

module.exports = sessionRouter;