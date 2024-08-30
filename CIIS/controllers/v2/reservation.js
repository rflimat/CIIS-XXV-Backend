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

    const user = (
      await Users.findOne({
        where: { dni_user: dni },
        attributes: ["id_user", "name_user", "lastname_user", "email_user"],
      })
    ).dataValues;

    if (
      Boolean(
        await Reservation.count({
          where: { user_id: user.id_user, event_id: 14 },
        })
      )
    ) {
      return res.status(409).send(http["409"]);
    } else {
      if (type_event === "ciis") {
        await Reservation.create({
          enrollment_status: 1,
          active: false,
          user_id: user.id_user,
          event_id: 15,
          price_type_attendee_id: type,
          allowedAttendance: false,
          dir_voucher: "/event/15/reservation/ciis/logo-ins-by-admin.png",
          dir_fileuniversity: "/event/15/reservation/ciis/logo-ins-by-admin.png",
        });

        await sendMail(
          user.email_user,
          "Inscripción a CIIS XXV",
          confirm({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, 25° Edición")
        );

        res.status(201).send(http["201"]);
      } else if (type_event == "postmaster") {
        let newType;
        if (new Date("2024-09-12T05:00:00Z") > new Date()) {
          newType = type;
        } else {
          if (type == 1) newType = 4;
          else if (type == 2) newType = 5;
          else if (type == 3) newType = 6;
          else newType = type;
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
        });

        await sendMail(
          user.email_user,
          "Inscripción a POSTMASTER XXI",
          confirm({ name: user.name_user, lastname: user.lastname_user }, "POSTMASTER XXI")
        );
        
        res.status(201).send(http["201"]);
      } else {
        return res.status(400).send("Tipo de evento no existente");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

module.exports = CONTROLLER_RESERVATION;
