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
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

module.exports = {
  getCountAttendances,
  getEventReport,
};
