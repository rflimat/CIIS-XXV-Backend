const { Router } = require("express");
const RouterInscription = Router();
const CONTROLLER_INSCRIPTION = require("../../controllers/v2/inscription");
const { isAtLeastCounter } = require("../../middlewares/v2/auth");

RouterInscription.route("/event/:event/reservation/ciis")
  .post(CONTROLLER_INSCRIPTION.POST);

RouterInscription.route("/events/:event/reservation/ciis")
  .get(isAtLeastCounter, CONTROLLER_INSCRIPTION.GET);

RouterInscription.route("/event/:event/reservation/ciis/:filename").get(
  isAtLeastCounter,
  CONTROLLER_INSCRIPTION.GET_FILENAME
);

RouterInscription.route("/event/:event/reservation/postmaster/:filename").get(
  isAtLeastCounter,
  CONTROLLER_INSCRIPTION.GET_FILENAME
);

module.exports = RouterInscription;
