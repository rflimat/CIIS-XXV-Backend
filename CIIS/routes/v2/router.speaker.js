const { Router } = require("express");
const CONTROLLER_SPEAKER = require("../../controllers/v2/speaker.controller");
const { authMid, isAdmin, isAtLeastOrganizer } = require("../../middlewares/v2/auth");
const RouterSpeaker = Router();
const speakerUpdateDTO = require("../../DTO/speaker.update.dto");
const createSpeakerDTO = require("../../DTO/speaker.create.dto")
const { validateFileOptional } = require("../../middlewares/validateExistenceOfRecord");
const { createSpeaker } = require("../../controllers/speaker.controller");

RouterSpeaker.route("/speakers").get(authMid, isAtLeastOrganizer,
  CONTROLLER_SPEAKER.GET
);

RouterSpeaker.route("/speakers/:id").put(authMid, isAtLeastOrganizer, speakerUpdateDTO, CONTROLLER_SPEAKER.PUT)

RouterSpeaker.route("/speakers/:id").get(authMid, isAtLeastOrganizer, CONTROLLER_SPEAKER.GETONE);

RouterSpeaker.route("/speakers/:id").delete(authMid, isAdmin, CONTROLLER_SPEAKER.DELETE);

RouterSpeaker.post('/speakers', authMid, isAtLeastOrganizer, validateFileOptional("avatar", ["jpg", "jpeg", "png"]), createSpeakerDTO, createSpeaker);


module.exports = RouterSpeaker;
