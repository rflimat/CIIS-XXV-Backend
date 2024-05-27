const Taller = require("../../classes/Taller");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Users = require("../../models/Users");
const { confirm, abort } = require("../../utils/emails/confirmTaller");
const { sendMailAtDomain } = require("../../utils/send.mail.utils");

const path = require("path");
const TallerSQL = require("../../models/Taller/Taller");

const http = require("../../utils/http.msg");
const { emailRegistroTaller } = require("../../utils/emails/registro");

const CONTROLLER_TALLER = {};

CONTROLLER_TALLER.GET = async (_req, res) => {
  try {
    let talleres = await TallerSQL.findAll({ where: { relatedEvent: 24 } });
    talleres = talleres.map((tll) => new Taller(tll));
    await Promise.all(talleres.map((tll) => tll.loadSpeaker()));
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
      sendMailAtDomain(
        tallerInscription.relatedUser.email_user,
        `Confirmación de inscripción taller CIIS - ${taller.name}`,
        confirm(
          {
            name: tallerInscription.relatedUser.name_user,
            lastname: tallerInscription.relatedUser.lastname_user,
          },
          taller
        )
      );
    else if (state == 2)
      sendMailAtDomain(
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

    let taller = new Taller();
    await taller.load(req.params.id);

    if (await taller.checkParticipant(req.user.id))
      return res.status(409).send(http["409"]);

    await taller.addParticipant(req.user);
    await req.files.payment_doc.mv(
      path2save(`${req.user.dni}-taller-${req.params.id}.jpg`)
    );

    res.send(taller);

    await sendMailAtDomain(
      req.user.email,
      `Registro a taller ${taller.name} | CIIS`,
      emailRegistroTaller(req.user, taller)
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

const ExcelJS = require("exceljs");
const Reservation = require("../../models/Reservation");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");

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

module.exports = CONTROLLER_TALLER;
