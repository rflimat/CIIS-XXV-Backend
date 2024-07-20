const Speakers = require("../models/Speakers");

class Speaker {
  constructor() { }

  async load(id) {
    let rawSpeaker = await Speakers.findOne({ where: { id_speaker: id } });
    if (rawSpeaker) {
      delete rawSpeaker.dataValues.email_speaker;
      delete rawSpeaker.dataValues.phone_speaker;
    } else {
      rawSpeaker = {
        dataValues: undefined
      }
    }
    Object.assign(this, rawSpeaker.dataValues);
    return Promise.resolve(this);
  }
}

module.exports = Speaker;
