const { Router } = require("express");
const CONTROLLER_SESSION = require("../../controllers/v2/session");
const routerSession = Router();

routerSession
  .route("/session")
  .post(CONTROLLER_SESSION.POST)
  .delete((req, res) => {
    res.cookie("token","",{expires:new Date(0)});
    res.redirect("/");
  });

module.exports = routerSession;
