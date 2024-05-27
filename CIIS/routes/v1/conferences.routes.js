const {Router}=require("express");
const routeConference=Router();
const {validateExistUser,validateExistEvent}=require("../../middlewares/validateExistenceOfRecord");
const { checkAuth, checkRole } = require("../../middlewares/auth");
const {getConferenceDayUser} =require("../../controllers/conference.controller");

routeConference.get('/',checkAuth,getConferenceDayUser);

module.exports=routeConference;