const fileUpload = require("express-fileupload");
const {Router}=require("express");
const routerSpeaker=Router();
const {checkAuth,checkRole}=require("../../middlewares/auth");
const {validateFileOptional} = require("../../middlewares/validateExistenceOfRecord");
const createSpeakerDTO=require("../../DTO/speaker.create.dto");
const speakerUpdateDTO=require("../../DTO/speaker.update.dto");
const {createSpeaker, updateSpeaker}=require("../../controllers/speaker.controller");

routerSpeaker.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

routerSpeaker.post('/',checkAuth,checkRole(["Administrador","Organizador"]),validateFileOptional("avatar",["jpg", "jpeg", "png"]),createSpeakerDTO,createSpeaker);
routerSpeaker.put('/:idSpeaker',checkAuth,checkRole(["Administrador","Organizador"]),validateFileOptional("avatar",["jpg", "jpeg", "png"]),speakerUpdateDTO,updateSpeaker);

module.exports=routerSpeaker;