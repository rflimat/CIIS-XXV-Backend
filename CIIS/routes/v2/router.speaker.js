const { Router } = require("express");
const Speaker = require("../../classes/Speaker");
const CONTROLLER_SPEAKER = require("../../controllers/v2/speaker.controller");
const { authMid, isAdmin } = require("../../middlewares/v2/auth");
const RouterSpeaker = Router();
const speakerServices = require("../../services/speaker.service")
const http = require("../../utils/http.msg");
RouterSpeaker.route("/speakers").get(
  CONTROLLER_SPEAKER.GET
);

RouterSpeaker.route("/speakers/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = new Speaker();
    await speaker.load(id);
    res.send(speaker);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

RouterSpeaker.route("/speakers/:id").delete(authMid, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const result = await speakerServices.deleteSpeaker(id);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});


module.exports = RouterSpeaker;
