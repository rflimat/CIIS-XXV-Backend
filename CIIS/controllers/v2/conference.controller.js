const sequelize = require("../../config/database");
const {
  handleErrorResponseV2,
  handleHttpErrorV2,
} = require("../../middlewares/handleError");
const ConferenceAttendance = require("../../models/ConferenceAttendance");
const Reservation = require("../../models/Reservation");
const Users = require("../../models/Users");

const {
  createOneConferenceAttendance,
  searchRegisterByEventAndUserV2,
  searchOneConference,
  searchOneConferenceByDateTimeAvailability,
  checkEventRegistrationAvailability,
  checkConferenceAvailabilityByDateTime,
  getConferenceByDayByUser,
  checkAllowedAttendanceToUser,
} = require("../../services/conference.attendance.service");

const { updateReservation } = require("../../services/registration.service");
const { updateUser } = require("../../services/user.service");
const http = require("../../utils/http.msg");

const registerAttendanceByUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { conferenceId } = req.params;
    const { id: userId } = req.user;

    let regex = /^[0-9]+$/;

    if (!regex.test(conferenceId)) {
      handleErrorResponseV2(
        res,
        "El parametro de la conferencia debe ser numérico",
        400
      );
      return;
    }

    const conferenceFound = await searchOneConference(conferenceId);

    const {
      event_id: eventId,
      start_date_conference: startDateTime,
      exp_date_conference: expDateTime,
    } = conferenceFound;

    const reservationFound = await searchRegisterByEventAndUserV2(
      eventId,
      userId
    );

    let reservationId = null;

    if (reservationFound) {
      const { id_reservation, enrollment_status } = reservationFound;

      reservationId = id_reservation;

      // await checkEventRegistrationAvailability(enrollment_status);
    }

    await checkAllowedAttendanceToUser(userId);

    await checkConferenceAvailabilityByDateTime(startDateTime, expDateTime);

    await createOneConferenceAttendance(
      conferenceId,
      reservationId,
      userId,
      transaction
    );

    await transaction.commit();
    res.send({
      message: "Asistencia tomada",
    });
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      console.log(error);
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const registerAttendanceConferenceCurrent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { entry = 1 } = req.body;
    const { idEvent: eventId } = req.params;
    const { idUser: userId } = req;

    console.log(userId);
    let regex = /^[0-2]+$/;

    if (!regex.test(entry)) {
      handleErrorResponseV2(
        res,
        "El parametro entrada solo puede ser 0 y 1",
        400
      );
      return;
    }

    if (entry == 0) {
      await updateUser(userId, { allowedAttendance: 0 }, transaction);
      await transaction.commit();
      res.send({ message: "Asistencia Deshabilitada" });
      return;
    }

    let reservationId = null;
    if (entry == 1) {
      //habilitar y marcar asistencia
      const reservationFound = await searchRegisterByEventAndUserV2(
        eventId,
        userId
      );

      if (reservationFound) {
        const { id_reservation, enrollment_status } = reservationFound;
        // await checkEventRegistrationAvailability(enrollment_status);

        reservationId = id_reservation;
      }

      const conferenceFound = await searchOneConferenceByDateTimeAvailability(
        eventId
      );

      const {
        id_conference: conferenceId,
        start_date_conference: startDateTime,
        exp_date_conference: expDateTime,
      } = conferenceFound;

      await checkConferenceAvailabilityByDateTime(startDateTime, expDateTime);

      await createOneConferenceAttendance(
        conferenceId,
        reservationId,
        userId,
        transaction
      );
    }

    await updateUser(
      userId,
      {
        allowedAttendance: 1,
      },
      transaction
    );

    await transaction.commit();

    res.send({
      message: entry == 1 ? "Asistencia marcada" : "Asistencia habilitada",
    });
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      console.log(error);
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const getConferenceDayUser = async (req, res) => {
  try {
    const { day } = req.query;
    const { id: userId } = req.user;
    const conferences = await getConferenceByDayByUser(day, userId);
    res.json(conferences);
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const POST_ANY_ATTENDANCE = async (req, res) => {
  try {
    const { dni } = req.body;
    const { id } = req.params;
    let user = (await Users.findOne({ where: { dni_user: dni } }))?.dataValues;

    let reservation = (
      await Reservation.findOne({ where: { user_id: user.id_user } })
    )?.dataValues;

    await ConferenceAttendance.create({
      conference_id: Number(id),
      user_id: user.id_user,
      ...(reservation?.id_reservation
        ? { reservation_id: reservation.id_reservation }
        : {}),
    });

    res.send({ msg: "Asistencia marcada" });
  } catch (err) {
    console.log(err);
    res.send(http["500"]);
  }
};

module.exports = {
  registerAttendanceByUser,
  registerAttendanceConferenceCurrent,
  getConferenceDayUser,
  POST_ANY_ATTENDANCE,
};
