const { Router } = require("express");
const RouterReservation = Router();
const { isAdmin, isAtLeastCounter } = require("../../middlewares/v2/auth");
const Reservation = require("../../models/Reservation");
const { sendMail } = require("../../utils/send.mail.utils");
const { confirm, abort } = require("../../utils/emails/confirmReservation");
const Users = require("../../models/Users");
const CONTROLLER_RESERVATION = require("../../controllers/v2/reservation");

RouterReservation.route("/reservation/:id").patch(isAtLeastCounter, async (req, res) => {
  try {
    const { id } = req.params;
    const { type_event } = req.query;
    const { status } = req.body;

    let rs = await Reservation.findOne({ where: { id_reservation: id } });
    let user = await Users.findOne({ where: rs.user_id });

    await Reservation.update(
      { enrollment_status: status },
      { where: { id_reservation: id } }
    );

    if (status == 1) {
      if (type_event === "ciis") {
        await sendMail(
          user.email_user,
          "Confirmación de inscripción CIIS XXV",
          confirm({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, 25° Edición")
        );
      } else if (type_event == "postmaster") {
        await sendMail(
          user.email_user,
          "Confirmación de inscripción POSTMASTER XXI",
          confirm({ name: user.name_user, lastname: user.lastname_user }, "POSTMASTER XXI")
        );
      } else {
        return res.status(400).send("Tipo de evento no existente");
      }
      
    } else if (status == 2) {
      if (type_event === "ciis") {
        await sendMail(
          user.email_user,
          "Observación de inscripción CIIS XXV",
          abort({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, 25° Edición")
        );
      } else if (type_event == "postmaster") {
        await sendMail(
          user.email_user,
          "Observación de inscripción POSTMASTER XXI",
          abort({ name: user.name_user, lastname: user.lastname_user }, "POSTMASTER XXI")
        );
      } else {
        return res.status(400).send("Tipo de evento no existente");
      }
    }

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

RouterReservation.route("/reservation/qr").post(
  isAdmin,
  CONTROLLER_RESERVATION.POST_BY_QR
);

module.exports = RouterReservation;
