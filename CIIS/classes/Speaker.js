const Speakers = require("../models/Speakers");

class Speaker {
  constructor() {}

  async load(id) {
    let rawSpeaker = await Speakers.findOne({ where: { id_speaker: id } });
    delete rawSpeaker.dataValues.email_speaker;
    delete rawSpeaker.dataValues.phone_speaker;
    Object.assign(this, rawSpeaker.dataValues);
    return Promise.resolve(this);
  }
}

module.exports = Speaker;
