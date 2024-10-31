const { Router } = require("express");
const RouterReservation = Router();
const { isAtLeastCounter, isAtLeastOrganizer } = require("../../middlewares/v2/auth");
const Reservation = require("../../models/Reservation");
const { sendMail } = require("../../utils/send.mail.utils");
const { confirm, abort } = require("../../utils/emails/confirmReservation");
const Users = require("../../models/Users");
const CONTROLLER_RESERVATION = require("../../controllers/v2/reservation");
const { handleHttpError } = require("../../middlewares/handleError");
const http = require("../../utils/http.msg");

RouterReservation.route("/reservation/:id").patch(isAtLeastCounter, async (req, res) => {
  try {
    const { id } = req.params;
    const { type_event } = req.query;
    const { status } = req.body;

    let rs = await Reservation.findOne({ where: { id_reservation: id } });
    let user = await Users.findOne({ where: rs.user_id });

    await Reservation.update(
      { enrollment_status: status, updated_at: new Date() },
      { where: { id_reservation: id } }
    );

    if (status == 1) {
      if (type_event === "ciis") {
        await sendMail(
          user.email_user,
          "Confirmación de inscripción CIIS XXV",
          confirm({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, XXV Edición")
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
          abort({ name: user.name_user, lastname: user.lastname_user }, "Congreso Internacional de Informática y Sistemas, XXV Edición")
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
  isAtLeastCounter,
  CONTROLLER_RESERVATION.POST_BY_QR
);

RouterReservation.route("/event/:idEvent/kitdelivered").patch(
  isAtLeastOrganizer,
  async (req, res) => {
    try {
      const { user } = req.query
      const { idEvent } = req.params
      const dataUser = (await Users.findOne({ where: { dni_user: user } })).toJSON();
      //console.log(dataUser)
      const reservation = (await Reservation.findOne({
        where: {
          user_id: dataUser.id_user,
          event_id: idEvent
        }
      })).toJSON()
      Reservation.update(
        { kit_delivered: 1 },
        {
          where: {
            user_id: dataUser.id_user,
            event_id: idEvent
          }
        }
      )

      //console.log(reservation)
      res.status(201).json({ msg: "ok" });

    }
    catch (error) {
      res.status(500).send(http["500"]);
    }

  }
)

module.exports = RouterReservation;
