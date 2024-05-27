const { Router } = require("express");
const RouterReservation = Router();
const { isAdmin } = require("../../middlewares/v2/auth");
const Reservation = require("../../models/Reservation");
const { sendMailAtDomain } = require("../../utils/send.mail.utils");
const { confirm, abort } = require("../../utils/emails/confirmReservation");
const Users = require("../../models/Users");
const CONTROLLER_RESERVATION = require("../../controllers/v2/reservation");

RouterReservation.route("/reservation/:id").patch(isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let rs = await Reservation.findOne({ where: { id_reservation: id } });
    let user = await Users.findOne({ where: rs.user_id });

    await Reservation.update(
      { enrollment_status: status },
      { where: { id_reservation: id } }
    );

    if (status == 1)
      await sendMailAtDomain(
        user.email_user,
        "Confirmación de inscripción CIIS XXIV",
        confirm({ name: user.name_user, lastname: user.lastname_user })
      );
    else if (status == 2)
      await sendMailAtDomain(
        user.email_user,
        "Observación de inscripción CIIS XXIV",
        abort({ name: user.name_user, lastname: user.lastname_user })
      );

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
