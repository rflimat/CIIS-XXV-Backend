const { Router } = require("express");
const CONTROLLER_SESSION = require("../../controllers/v2/session");
const routerSession = Router();

routerSession.route("/session").post(CONTROLLER_SESSION.POST);

routerSession.route("/session").delete(CONTROLLER_SESSION.DELETE)

module.exports = routerSession;
