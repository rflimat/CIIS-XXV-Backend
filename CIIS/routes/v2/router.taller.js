const {
  authMid,
  isAdmin,
  isAtLeastTallerManager,
} = require("../../middlewares/v2/auth");
const CONTROLLER_TALLER = require("../../controllers/v2/taller");

const RouterTaller = require("express").Router();

RouterTaller.route("/taller").get(CONTROLLER_TALLER.GET);

RouterTaller.route("/taller/:id").get(
  authMid,
  isAtLeastTallerManager,
  CONTROLLER_TALLER.GET_ONE
);

RouterTaller.route("/taller/:id/inscription/:filename").get(
  authMid,
  isAtLeastTallerManager,
  CONTROLLER_TALLER.GET_FILENAME
);

RouterTaller.route("/taller/:id/inscription/:idInscription").patch(
  authMid,
  isAtLeastTallerManager,
  CONTROLLER_TALLER.PATCH_INSCRIPTION
);

RouterTaller.route("/taller/:id/participant").post(
  authMid,
  CONTROLLER_TALLER.POST_PARTICIPANT
);

RouterTaller.route("/taller/:id/report").get(
  authMid,
  isAtLeastTallerManager,
  CONTROLLER_TALLER.GET_REPORT
);

RouterTaller.route("/taller").post(
  authMid,
  isAdmin,
  CONTROLLER_TALLER.POST_TALLER
);
RouterTaller.route("/taller/:id").put(
  authMid,
  isAtLeastTallerManager,
  CONTROLLER_TALLER.PUT
);
RouterTaller.route("/taller/:id").delete(
  authMid,
  isAdmin,
  CONTROLLER_TALLER.DELETE
);

module.exports = RouterTaller;
