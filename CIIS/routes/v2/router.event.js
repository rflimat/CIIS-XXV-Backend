const { Router } = require("express");
const eventRouter = Router();

const { authMid, isAtLeastOrganizer, isAdmin } = require("../../middlewares/v2/auth");
const {
  validateExistUser,
  validateExistEvent,
  validateFormDataToUploadImages,
  validateFileOptional,
} = require("../../middlewares/validateExistenceOfRecord");
const { createGalleryEvent } = require("../../controllers/galleryEvent.controller");
const {
  getCountAttendances,
  getEventReport,
  createEvent,
  deleteEvent,
  updateEvent,
} = require("../../controllers/v2/events.controller");
const { getEvents, getOneEvent } = require("../../controllers/event.controller");
const { uploadMultipleOrSingleFile } = require("../../middlewares/upload.file");
const { getGalleryEvent, deleteGalleryEvent } = require("../../controllers/v2/galleryEvent.controller");
const { getSponsorsByEvent, createSponsorsByEvent } = require("../../controllers/sponsor.controller");
const sponsorCreateDTO = require("../../DTO/sponsor.create.dto");

eventRouter.route("/:idEvent/attendances")
  .get(
    authMid,
    validateExistEvent,
    getCountAttendances
  );


// GET EVENTS
eventRouter.route("/").get(getEvents)

// GET ONE EVENT
eventRouter.route("/:idEvent").get(getOneEvent)
// POST EVENT
eventRouter.route("/").post(authMid, isAtLeastOrganizer, createEvent)
// PUT EVENT
eventRouter.route("/:idEvent").put(authMid, isAtLeastOrganizer, updateEvent)
// DELETE EVENT
eventRouter.route("/:id").delete(authMid, isAdmin, deleteEvent)

eventRouter.route("/:id/report").get(isAtLeastOrganizer, getEventReport);


eventRouter.route('/:idEvent/gallery').post(authMid, isAtLeastOrganizer, validateExistEvent, uploadMultipleOrSingleFile("image", ["jpg", "jpeg", "png"]), validateFormDataToUploadImages(["name", "priority", "image"]), createGalleryEvent);
eventRouter.route('/:idEvent/gallery').get(getGalleryEvent)
eventRouter.route("/gallery/:id").delete(authMid, isAdmin, deleteGalleryEvent)


// sponsors

eventRouter.route('/:idEvent/sponsors').get(getSponsorsByEvent);
eventRouter.route('/:idEvent/sponsors').post(authMid, isAtLeastOrganizer, validateFileOptional("avatar", ["jpg", "jpeg", "png"]), sponsorCreateDTO, createSponsorsByEvent);


module.exports = eventRouter;
