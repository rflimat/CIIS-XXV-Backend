const { Router } = require("express");
const eventRouter = Router();

const { authMid, isAdmin, isAtLeastContentManager } = require("../../middlewares/v2/auth");
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
const { getSpeakersByEvent } = require("../../controllers/speaker.controller");
const { getSponsorsByEvent, createSponsorsByEvent, getSponsorsByEventJSON } = require("../../controllers/sponsor.controller");
const sponsorCreateDTO = require("../../DTO/sponsor.create.dto");
const { ConferencebyEvent, getJsonConference } = require("../../controllers/v2/conference.controller");
const CONTROLLER_SPEAKER = require("../../controllers/v2/speaker.controller");

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
eventRouter.route("/").post(authMid, isAdmin, createEvent)
// PUT EVENT
eventRouter.route("/:idEvent").put(authMid, isAdmin, updateEvent)
// DELETE EVENT
eventRouter.route("/:id").delete(authMid, isAdmin, deleteEvent)

eventRouter.route("/:id/report").get(isAdmin, getEventReport);


eventRouter.route('/:idEvent/gallery').post(authMid, isAdmin, validateExistEvent, uploadMultipleOrSingleFile("image", ["jpg", "jpeg", "png"]), validateFormDataToUploadImages(["name", "priority", "image"]), createGalleryEvent);
eventRouter.route('/:idEvent/gallery').get(getGalleryEvent)
eventRouter.route("/gallery/:id").delete(authMid, isAdmin, deleteGalleryEvent)


eventRouter.route('/:idEvent/speakers').get(getSpeakersByEvent);
// sponsors

eventRouter.route('/:idEvent/sponsors').get(getSponsorsByEvent);
eventRouter.route('/:idEvent/sponsors').post(authMid, isAtLeastContentManager, validateFileOptional("avatar", ["jpg", "jpeg", "png"]), sponsorCreateDTO, createSponsorsByEvent);

eventRouter.route('/:idEvent/conferences').get(ConferencebyEvent)
eventRouter.route('/:idEvent/conferences/json').get(getJsonConference)
eventRouter.route('/:idEvent/speakers/json').get(CONTROLLER_SPEAKER.GET_JSON_BY_EVENT)
eventRouter.route('/:idEvent/sponsors/json').get(getSponsorsByEventJSON)
module.exports = eventRouter;
