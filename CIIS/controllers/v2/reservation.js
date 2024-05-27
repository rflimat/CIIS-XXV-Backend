const Reservation = require("../../models/Reservation");
const Users = require("../../models/Users");
const { confirm } = require("../../utils/emails/confirmReservation");
const http = require("../../utils/http.msg");
const { sendMailAtDomain } = require("../../utils/send.mail.utils");

const CONTROLLER_RESERVATION = {};

CONTROLLER_RESERVATION.POST_BY_QR = async (req, res) => {
  try {
    const { dni, type } = req.body;

    const user = (
      await Users.findOne({
        where: { dni_user: dni },
        attributes: ["id_user", "name_user", "lastname_user", "email_user"],
      })
    ).dataValues;

    console.log(
      await Reservation.count({
        where: { user_id: user.id_user, event_id: 24 },
      })
    );

    if (
      Boolean(
        await Reservation.count({
          where: { user_id: user.id_user, event_id: 24 },
        })
      )
    ) {
      return res.status(409).send(http["409"]);
    } else {
      await Reservation.create({
        enrollment_status: 1,
        active: false,
        user_id: user.id_user,
        event_id: 24,
        price_type_attendee_id: type,
        allowedAttendance: false,
        dir_voucher: "/img/CIIS/XXIV/logo-ins-by-admin.png",
        dir_fileuniversity: "/img/CIIS/XXIV/logo-ins-by-admin.png",
      });

      await sendMailAtDomain(
        user.email_user,
        "Inscripción a CIIS XXIV",
        confirm({ name: user.name_user, lastname: user.lastname_user })
      );
      res.status(201).send(http["201"]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

module.exports = CONTROLLER_RESERVATION;
