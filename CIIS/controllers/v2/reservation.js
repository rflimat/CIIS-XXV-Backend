const { handleErrorResponseV2 } = require("../../middlewares/handleError");
const Reservation = require("../../models/Reservation");
const Users = require("../../models/Users");
const { confirm } = require("../../utils/emails/confirmReservation");
const http = require("../../utils/http.msg");
const { sendMail } = require("../../utils/send.mail.utils");

const CONTROLLER_RESERVATION = {};

CONTROLLER_RESERVATION.POST_BY_QR = async (req, res) => {
  try {
    const { type_event } = req.query;
    const { dni, type } = req.body;

    // Buscamos si el usuario existe
    const existsUser = await Users.findOne({
      where: { dni_user: dni },
      attributes: ["id_user", "name_user", "lastname_user", "email_user"],
    });

    // Verificamos si existe el usuario
    if (!existsUser) {
      return handleErrorResponseV2(res, "El usuario no existe", 404);
    }

    const user = existsUser.dataValues;
    
    if (type_event === "ciis") {
      // Verificamos si el usuario ya tiene una reserva para el evento específico
      const existingReservation = await Reservation.count({
        where: { user_id: user.id_user, event_id: 15 },
      });

      if (existingReservation) {
        return res.status(409).send(http["409"]);
      }

      let newType = type;
      const cutoffDate = new Date("2024-11-10T05:00:00Z");

      if (new Date() > cutoffDate) {
        if (type === 7) newType = 12;
        else if (type === 8) newType = 13;
        else if (type === 9) newType = 14;
        else if (type === 10) newType = 15;
        else if (type === 11) newType = 16;
      }

      await Reservation.create({
        enrollment_status: 1,
        active: false,
        user_id: user.id_user,
        event_id: 15,
        price_type_attendee_id: type,
        allowedAttendance: false,
        dir_voucher: "/event/15/reservation/ciis/logo-ins-by-admin.png",
        dir_fileuniversity: "/event/15/reservation/ciis/logo-ins-by-admin.png",
        created_at: new Date(),
        updated_at: new Date(),
      });

      await sendMail(
        user.email_user,
        "Inscripción a CIIS XXV",
        confirm({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, XXV Edición")
      );

      return res.status(201).send(http["201"]);

    } else if (type_event === "postmaster") {
      // Verificamos si el usuario ya tiene una reserva para el evento específico
      const existingReservation = await Reservation.count({
        where: { user_id: user.id_user, event_id: 14 },
      });

      if (existingReservation) {
        return res.status(409).send(http["409"]);
      }

      let newType = type;
      const cutoffDate = new Date("2024-09-13T05:00:00Z");

      if (new Date() > cutoffDate) {
        // Ajustamos el tipo según el límite de fecha
        if (type === 1) newType = 4;
        else if (type === 2) newType = 5;
        else if (type === 3) newType = 6;
      }

      await Reservation.create({
        enrollment_status: 1,
        active: false,
        user_id: user.id_user,
        event_id: 14,
        price_type_attendee_id: newType,
        allowedAttendance: false,
        dir_voucher: "/event/14/reservation/postmaster/logo-ins-by-admin.png",
        dir_fileuniversity: "/event/14/reservation/postmaster/logo-ins-by-admin.png",
        created_at: new Date(),
        updated_at: new Date(),
      });

      await sendMail(
        user.email_user,
        "Inscripción a POSTMASTER XXI",
        confirm({ name: user.name_user, lastname: user.lastname_user }, "POSTMASTER XXI")
      );

      return res.status(201).send(http["201"]);
    } else {
      return res.status(400).send("Tipo de evento no existente");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(http["500"]);
  }
};

module.exports = CONTROLLER_RESERVATION;
