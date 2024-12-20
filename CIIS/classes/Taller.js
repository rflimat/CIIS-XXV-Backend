const TallerSQL = require("../models/Taller/Taller");
const Speakers = require("../models/Speakers");
const TallerInscriptionSQL = require("../models/Taller/TallerInscription");
const sequelize = require("../config/database");
const { Sequelize, where } = require("sequelize");
const Users = require("../models/Users");

class Taller {
  constructor(data = {}) {
    const {
      id = null,
      name = null,
      price = null,
      tickets = null,
      avaible = null,
      start = null,
      end = null,
      start_2 = null,
      end_2 = null,
      date = null,
      place = null,
      requirements = null,
      is_morning = null,
      speaker = null,
      active = null
    } = data;

    Object.assign(this, {
      id,
      name,
      price,
      tickets,
      avaible,
      speaker,
      start,
      start_2,
      place,
      requirements,
      is_morning,
      end,
      end_2,
      date,
      active
    });
  }

  async load(id) {
    Object.assign(this, (await TallerSQL.findByPk(id)).dataValues);
    return Promise.resolve(this);
  }

  async loadInscriptions() {
    let inscriptions = await TallerInscriptionSQL.findAll({
      where: { relatedTaller: this.id },
    });

    this.inscriptions = inscriptions ?? [];
    return Promise.resolve(this);
  }

  async loadInscriptionsUsers() {
    if (this.inscriptions)
      await Promise.all(
        this.inscriptions.map(async (ins) => {
          ins.relatedUser = await Users.findOne({
            where: { id_user: ins.relatedUser },
            attributes: ["id_user", "lastname_user", "name_user", "email_user", "phone_user"],
          });

          return Promise.resolve();
        })
      );

    return Promise.resolve(this);
  }

  async loadSpeaker() {
    this.speaker = await Speakers.findByPk(this.speaker, {
      attributes: [
        "id_speaker",
        "name_speaker",
        "lastname_speaker",
        "nationality_speaker",
        "dir_img_speaker",
        "about_profile_speaker",
      ],
    });
    return Promise.resolve(this);
  }

  async checkParticipant(id) {
    let result = await TallerInscriptionSQL.findOne({
      where: {
        relatedUser: id,
        relatedTaller: this.id,
      },
    });

    return Boolean(result?.dataValues);
  }

  async addParticipant(user) {
    const transaction = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });

    try {
      await this.load(this.id); // refresca la instancia dentro de la transacción
      if (!this.avaible > 0) return Promise.reject({error: "Inscripciones cerradas", reason: "Inscripciones cerradas"});

      await TallerInscriptionSQL.create({
        relatedUser: user.id,
        relatedTaller: this.id,
        voucher: `/${user.dni}-taller-${this.id}.jpg`,
        state: 0,
      });

      this.avaible = this.avaible - 1;

      const [affectedRows, updateRows] = await TallerSQL.update(
        { ...this },
        { where: { id: this.id } }
      );
      if (updateRows < 1) return Promise.reject();

      await transaction.commit();
      return Promise.resolve(this);
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
  }
}

module.exports = Taller;
