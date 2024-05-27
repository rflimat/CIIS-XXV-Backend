const { Router } = require("express");
const RouterInscription = Router();
const CONTROLLER_INSCRIPTION = require("../../controllers/v2/inscription");
const { isAdmin } = require("../../middlewares/v2/auth");

RouterInscription.route("/event/:event/reservation/ciis")
  .post(CONTROLLER_INSCRIPTION.POST)
  .get(isAdmin, CONTROLLER_INSCRIPTION.GET);

RouterInscription.route("/event/:event/reservation/ciis/:filename").get(
  isAdmin,
  CONTROLLER_INSCRIPTION.GET_FILENAME
);

module.exports = RouterInscription;
