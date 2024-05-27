const {Router}=require("express");
const fileUpload=require("express-fileupload");
const routerEvent=Router();
const {getEvents,getOneEvent,getEventImages,registerAttendance,getCountAttendances}=require("../../controllers/event.controller");
const {getSpeakersByEvent}=require("../../controllers/speaker.controller");
const {getSponsorsByEvent}=require("../../controllers/sponsor.controller");
const {getTopicsToEvent}=require("../../controllers/topics.controller");
const {createGalleryEvent}=require("../../controllers/galleryEvent.controller");
const conferenceAttendanceDTO=require("../../DTO/conference.attendance.dto");
const {validateFileOptional,validateExistUser,validateExistEvent,validateFormDataToUploadImages}=require("../../middlewares/validateExistenceOfRecord");
const { checkAuth, checkRole } = require("../../middlewares/auth");
const {uploadMultipleOrSingleFile}=require("../../middlewares/upload.file");
const {createSponsorsByEvent}=require("../../controllers/sponsor.controller");
const sponsorCreateDTO=require("../../DTO/sponsor.create.dto");

routerEvent.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

routerEvent.post('/:idEvent/attendance',checkAuth,
checkRole(["Administrador","Organizador"]),conferenceAttendanceDTO,validateExistUser,registerAttendance);
routerEvent.get('/:idEvent/topics',validateExistEvent,getTopicsToEvent);
routerEvent.post('/:idEvent/gallery',checkAuth,checkRole(["Administrador"]),validateExistEvent,uploadMultipleOrSingleFile("image",["jpg","jpeg","png"]),validateFormDataToUploadImages(["name","priority","image"]),createGalleryEvent);
routerEvent.get('/gallery',getEventImages);
routerEvent.get('/:idEvent/sponsors',getSponsorsByEvent);
routerEvent.post('/:idEvent/sponsors',checkAuth,checkRole(["Administrador","Organizador"]),validateFileOptional("avatar",["jpg", "jpeg", "png"]),sponsorCreateDTO,createSponsorsByEvent);
routerEvent.get('/:idEvent/speakers',getSpeakersByEvent);
routerEvent.get('/:idEvent',getOneEvent);
routerEvent
.get('/',getEvents);

routerEvent.get('/:idEvent/attendances',checkAuth,validateExistEvent,getCountAttendances);

module.exports=routerEvent;