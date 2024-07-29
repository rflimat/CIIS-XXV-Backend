const {
  handleErrorResponseV2,
  handleHttpErrorV2,
} = require("../../middlewares/handleError");
const EventService = require("../../services/event.service");

const getCountAttendances = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const { id: userId } = req.user;

    const attendances = await EventService.getCountAttendances(idEvent, userId);
    res.json(attendances);
  } catch (error) {
    if (error.code) {
      return handleErrorResponseV2(res, error.message, error.code);
    }
    return handleHttpErrorV2(res, error);
  }
};

const ExcelJS = require("exceljs");
const Reservation = require("../../models/Reservation");
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");

const getEventReport = async (req, res) => {
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
      "SELECT ROW_NUMBER()  OVER (ORDER BY id_reservation) AS nro, name_user, lastname_user, dni_user FROM users u INNER JOIN reservations rs on u.id_user = rs.user_id WHERE enrollment_status = 1 AND event_id = :id",
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    worksheet.addRows(rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=CIIS_EVENTO_PRINCIPAL_${id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    //console.log(err);
    res.status(500).send(http["500"]);
  }
};

const createEvent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let logo = {};
    let brouchere = {};
    if (req.files && req.files.logo != undefined) {
      logo = req.files.logo;
    }
    if (req.files && req.files.brouchere != undefined) {
      brouchere = req.files.brouchere;
    }
    const obj = req.body
    const event = await EventService.createEvent(obj, logo, brouchere, transaction);
    await transaction.commit();
    res.status(201).json(event);
  } catch (error) {
    await transaction.rollback();
    if (error.code) {
      return handleErrorResponseV2(res, error.message, error.code);
    }
    return handleHttpErrorV2(res, error);
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id)
    const result = await EventService.deleteEvent(id);
    res.json(result);
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleErrorResponseV2(res, error);
  }
}
const updateEvent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idEvent } = req.params;
    const { name, about, place, start_date, exp_date, price, active, type_event_id } = req.body;
    const { files } = req;

    if (Object.keys(req.body).length > 0 || files) {
      const eventObject = {};
      if (name !== undefined) eventObject.name = name;
      if (about !== undefined) eventObject.about = about;
      if (place !== undefined) eventObject.place = place;
      if (start_date !== undefined) eventObject.start_date = start_date;
      if (exp_date !== undefined) eventObject.exp_date = exp_date;
      if (price !== undefined) eventObject.price = price;
      if (active !== undefined) eventObject.active = active;
      if (type_event_id !== undefined) eventObject.type_event_id = type_event_id;

      let logo = {}
      if (files && files.logo != undefined) {
        logo = files.logo;
      }
      let brouchere = {}
      if (files && files.brouchere != undefined) {
        brouchere = files.brouchere;
      }
      await EventService.updateEvent(idEvent, eventObject, logo, brouchere, transaction);
    }
    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code === "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleErrorResponseV2(res, error);
  }
}

module.exports = {
  getCountAttendances,
  getEventReport,
  createEvent,
  deleteEvent,
  updateEvent
};
