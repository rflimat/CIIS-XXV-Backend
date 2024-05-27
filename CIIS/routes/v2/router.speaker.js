const { Router } = require("express");
const Speaker = require("../../classes/Speaker");
const RouterSpeaker = Router();

RouterSpeaker.route("/speaker/:id").get(async (req, res) => {
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

module.exports = RouterSpeaker;
