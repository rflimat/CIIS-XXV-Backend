const { Router } = require("express");
const RouterInscription = Router();
const CONTROLLER_GOOGLE_SESSION = require("../../controllers/v2/google_session");
const { isAtLeastCounter } = require("../../middlewares/v2/auth");

RouterInscription.route("/event/:event/google_sign/ciis")
  .post(CONTROLLER_GOOGLE_SESSION.POST);

module.exports = RouterInscription;
