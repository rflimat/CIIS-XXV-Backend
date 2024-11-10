const Taller = require("../../classes/Taller");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Users = require("../../models/Users");
const { confirm, abort } = require("../../utils/emails/confirmTaller");
const { sendMail } = require("../../utils/send.mail.utils");

const path = require("path");
const TallerSQL = require("../../models/Taller/Taller");

const http = require("../../utils/http.msg");
const { emailRegistroTaller } = require("../../utils/emails/registro");

const eventService = require("../../services/event.service");
const speakerService = require("../../services/speaker.service");

const tallerService = require("../../services/taller.service");
const fs = require("fs");
const CONTROLLER_TALLER = {};

CONTROLLER_TALLER.GET = async (_req, res) => {
  try {
    let talleres = await TallerSQL.findAll({
      where: { relatedEvent: 15, active: 1 },
      order: [
        ['date', 'ASC'],
      ],
      include: [
        {
          model: Speakers,
          attributes: [
            "id_speaker",
            "degree_speaker",
            "name_speaker",
            "lastname_speaker",
            "nationality_speaker",
            "dir_img_speaker",
            "about_profile_speaker",
          ],
        },
      ]
    });
    talleres = talleres.map((tll) => new Taller(tll));
    //await Promise.all(talleres.map((tll) => tll.loadSpeaker()));
    res.send(talleres);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

CONTROLLER_TALLER.GET_ONE = async (req, res) => {
  try {
    let taller = new Taller();
    await taller.load(req.params.id);
    await taller.loadSpeaker();
    await taller.loadInscriptions();
    await taller.loadInscriptionsUsers();
    res.send(taller);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

CONTROLLER_TALLER.GET_FILENAME = async (req, res) => {
  try {
    const { filename } = req.params;
    res.sendFile(path2save(filename));
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};


CONTROLLER_TALLER.PATCH_INSCRIPTION = async (req, res) => {
  try {
    const { id, idInscription } = req.params;
    const { state } = req.body;

    await TallerInscriptionSQL.update(
      { state },
      { where: { id: idInscription } }
    );

    let tallerInscription = (
      await TallerInscriptionSQL.findOne({
        where: { id: idInscription },
      })
    )?.dataValues;

    tallerInscription.relatedUser = (
      await Users.findOne({
        where: { id_user: tallerInscription.relatedUser },
      })
    ).dataValues;

    let taller = new Taller();
    await taller.load(id);

    if (state == 1)
      sendMail(
        tallerInscription.relatedUser.email_user,
        `Confirmación de inscripción taller CIIS XXV - ${taller.name}`,
        confirm(
          {
            name: tallerInscription.relatedUser.name_user,
            lastname: tallerInscription.relatedUser.lastname_user,
          },
          taller
        )
      );
    else if (state == 2)
      sendMail(
        tallerInscription.relatedUser.email_user,
        `Observación de inscripción taller CIIS - ${taller.name}`,
        abort(
          {
            name: tallerInscription.relatedUser.name_user,
            lastname: tallerInscription.relatedUser.lastname_user,
          },
          taller
        )
      );

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

CONTROLLER_TALLER.POST_PARTICIPANT = async (req, res) => {
  try {
    if (!req.files?.payment_doc) return res.status(400).send(http["400"]);

    if (!Boolean(req.user.dni)) {
      return res.status(404).send({
        error: "DNI no proporcionado",
        code: "404",
        reason: "Debe proporcionar su numero de DNI en la opción Cuenta para continuar con el proceso de inscripción"
      });
    }

    let taller = new Taller();
    await taller.load(req.params.id);

    if (await taller.checkParticipant(req.user.id))
      return res.status(409).send(http["409"]);

    await taller.addParticipant(req.user);
    await req.files.payment_doc.mv(
      path2save(`${req.user.dni}-taller-${req.params.id}.jpg`)
    );

    res.send(taller);

    await sendMail(
      req.user.email,
      `Registro a taller ${taller.name} | CIIS XXV`,
      emailRegistroTaller(req.user, taller)
    );
  } catch (err) {
    if (err?.error == "Inscripciones cerradas") {
      return res.status(404).send(err);
    }

    res.status(500).send(http["500"]);
  }
};

const ExcelJS = require("exceljs");
const Reservation = require("../../models/Reservation");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
const {
  handleErrorResponseV2,
  handleHttpErrorV2,
} = require("../../middlewares/handleError");
const Speakers = require("../../models/Speakers");

CONTROLLER_TALLER.GET_REPORT = async (req, res) => {
  try {
    const { id } = req.params;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inscritos confirmados");

    worksheet.columns = [
      {
        header: "NRO",
        key: "nro",
      },
      {
        header: "NOMBRES",
        key: "name_user",
        width: 25,
      },
      {
        header: "APELLIDOS",
        key: "lastname_user",
        width: 25,
      },
      {
        header: "DNI",
        key: "dni_user",
      },
    ];

    const rows = await sequelize.query(
      "SELECT ROW_NUMBER()  OVER (ORDER BY id) AS nro, name_user, lastname_user, dni_user FROM users u INNER JOIN tallerInscriptions ti on u.id_user = ti.relatedUser WHERE ti.state = 1 AND relatedTaller = :id",
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    worksheet.addRows(rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=CIIS_TALLER_${id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

function path2save(fileName) {
  return path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "private",
    "inscription",
    "taller",
    fileName
  );
}

CONTROLLER_TALLER.POST_TALLER = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      name,
      price,
      tickets,
      avaible,
      start,
      end,
      start_2,
      end_2,
      date,
      place,
      isMorning,
      idEvent,
      idSpeaker,
    } = req.body;
    const event = await eventService.getOneEvent(idEvent);
    const dataSpeaker = await speakerService.getSpeaker(idSpeaker);
    const speaker = dataSpeaker.dataValues;

    const object = {
      name,
      price,
      tickets,
      avaible,
      start,
      end,
      start_2,
      end_2,
      date,
      place,
      isMorning,
      idSpeaker,
      idEvent,
    };
    result = await tallerService.createTallerService(object, transaction);
    await transaction.commit();
    res.send({
      message: "Taller creado",
    });
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

CONTROLLER_TALLER.GET_TALLER_EVENT = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const event = await eventService.getOneEvent(idEvent);
    const talleres = await TallerSQL.findAll({
      where: {
        relatedEvent: idEvent,
        active: 1
      },
    });
    res.send(talleres);
  } catch (error) {
    res.status(500).send(http["500"]);
  }
};

CONTROLLER_TALLER.PUT = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      name,
      price,
      tickets,
      avaible,
      start,
      end,
      start_2,
      end_2,
      date,
      place,
      isMorning,
      idEvent,
      idSpeaker,
    } = req.body;

    const Object = {};
    if (name !== undefined) Object.name = name;
    if (price !== undefined) Object.price = price;
    if (tickets !== undefined) Object.tickets = tickets;
    if (avaible !== undefined) Object.avaible = avaible;
    if (start !== undefined) Object.start = start;
    if (end !== undefined) Object.end = end;
    if (start_2 !== undefined) Object.start_2 = start_2;
    if (end_2 !== undefined) Object.end_2 = end_2;
    if (date !== undefined) Object.date = date;
    if (place !== undefined) Object.place = place;
    if (isMorning !== undefined) Object.is_morning = isMorning;
    if (idEvent !== undefined) {
      const event = await eventService.getOneEvent(idEvent);
      Object.relatedEvent = idEvent;
    }
    if (idSpeaker !== undefined) {
      const dataSpeaker = await speakerService.getSpeaker(idSpeaker);
      const speaker = dataSpeaker.dataValues;
      Object.relatedSpeaker = idSpeaker;
    }

    await tallerService.updateTaller(id, Object, transaction);

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};
CONTROLLER_TALLER.DELETE = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tallerService.deleteTaller(id);
    res.json(result);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};
CONTROLLER_TALLER.GET_JSON_BY_EVENT = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const talleres = await TallerSQL.findAll({
      where: {
        relatedEvent: idEvent,
        active: 1
      },
      order: [
        ['date', 'ASC'],
      ],
      include: [
        {
          model: Speakers,
          attributes: [
            "id_speaker",
            "name_speaker",
            "lastname_speaker",
            "nationality_speaker",
            "dir_img_speaker",
            "about_profile_speaker",
          ],
        },
      ],
    });

    const jsonContent = JSON.stringify(talleres); // Convertir objeto a JSON con formato
    const path = "./uploads/public/reports/" + idEvent + "/";
    const fileName = "talleres.json";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(`${path}/${fileName}`, jsonContent, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${fileName} creado!`);
      }
    });

    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    res.setHeader("Content-Type", "application/json");
    res.send(jsonContent);
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

module.exports = CONTROLLER_TALLER;
