const routerUser = require("./router.user");
const express = require("express");
const v2Router = express();

const routerSession = require("./router.session");
const RouterInscription = require("./router.inscription");
const { authMid, isAdmin } = require("../../middlewares/v2/auth");

const fileUpload = require("express-fileupload");
const RouterTaller = require("./router.taller");
const RouterReservation = require("./router.reservation");
const RouterSpeaker = require("./router.speaker");
const RouterConference = require("./router.conference");
const RouterEvent=require("./router.event");
const path = require("path");

v2Router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
v2Router.use("/", routerUser);
v2Router.use("/", routerSession);
v2Router.use("/", RouterTaller);
v2Router.use("/", RouterSpeaker);
v2Router.use("/", authMid, RouterInscription);
v2Router.use("/", authMid, RouterReservation);
v2Router.use("/conference", RouterConference);
v2Router.use("/event", RouterEvent);

v2Router.use(
  "/",
  authMid,
  isAdmin,
  express.static(path.join(process.cwd(), "uploads"))
);
module.exports = v2Router;

