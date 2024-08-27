const sequelize = require("../../config/database");
const {
  handleErrorResponseV2,
  handleHttpErrorV2,
} = require("../../middlewares/handleError");
const ConferenceAttendance = require("../../models/ConferenceAttendance");
const Reservation = require("../../models/Reservation");
const Users = require("../../models/Users");
const eventService = require("../../services/event.service");
const speakerService = require("../../services/speaker.service");
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
const fs = require("fs");

const { updateReservation } = require("../../services/registration.service");
const { updateUser } = require("../../services/user.service");
const http = require("../../utils/http.msg");
const {
  createConferenceService,
  getConferencesService,
  updateConferenceService,
  deleteConferenceService,
  getConferenceByEvent,
  getConferenceService,
  getConferenceByEventOrder,
} = require("../../services/conference.service");

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
    res.send(http["500"]);
  }
};

const getConferences = async (req, res) => {
  try {
    const conferences = await getConferencesService();
    res.json(conferences);
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const getOneConference = async (req, res) => {
  try {
    const { idConference } = req.params;
    const conferences = await getConferenceService(idConference);
    if (!conferences) {
      handleErrorResponseV2(res, "Conferencia no existente", 404);
      return;
    }
    res.json(conferences);
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const ConferencebyEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const event = await eventService.getOneEvent(idEvent);
    result = await getConferenceByEvent(idEvent);
    res.json(result);
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const createConference = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      topic,
      startDateTime,
      expDateTime,
      isActive,
      isMorning,
      idEvent,
      idSpeaker,
    } = req.body;
    const event = await eventService.getOneEvent(idEvent);
    const dataSpeaker = await speakerService.getSpeaker(idSpeaker);
    const speaker = dataSpeaker.dataValues;

    const conferenceObj = {
      topic_conference: topic,
      start_date_conference: startDateTime,
      exp_date_conference: expDateTime,
      is_active: isActive ?? 1,
      is_morning: isMorning ?? 0,
      event_id: event.id_event,
      speaker_id: speaker.id_speaker,
    };
    result = await createConferenceService(conferenceObj, transaction);

    await transaction.commit();
    res.send({
      message: "Conferencia creada",
    });
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const updateConference = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      topic,
      startDateTime,
      expDateTime,
      isActive,
      isMorning,
      idEvent,
      idSpeaker,
    } = req.body;
    const { idConference } = req.params;

    let conferenceObj = {};
    if (topic !== undefined) conferenceObj.topic_conference = topic;
    if (startDateTime !== undefined)
      conferenceObj.start_date_conference = startDateTime;
    if (expDateTime !== undefined)
      conferenceObj.exp_date_conference = expDateTime;
    if (isActive !== undefined) conferenceObj.is_active = isActive;
    if (isMorning !== undefined) conferenceObj.is_morning = isMorning;
    if (idEvent !== undefined) {
      const event = await eventService.getOneEvent(idEvent);
      conferenceObj.event_id = event.id_event;
    }
    if (idSpeaker !== undefined) {
      const dataSpeaker = await speakerService.getSpeaker(idSpeaker);
      const speaker = dataSpeaker.dataValues;
      conferenceObj.speaker_id = speaker.id_speaker;
    }

    result = await updateConferenceService(
      idConference,
      conferenceObj,
      transaction
    );

    await transaction.commit();
    res.send({
      message: "Conferencia actualizada",
    });
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

const deleteConference = async (req, res) => {
  try {
    const { idConference } = req.params;
    const result = await deleteConferenceService(idConference);
    res.json(result);
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleErrorResponseV2(res, error);
  }
};

const getJsonConference = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const event = await eventService.getOneEvent(idEvent);
    data = await getConferenceByEventOrder(idEvent);

    const eventosPorFecha = data.reduce((acc, evento) => {
      const date = new Date(evento.start);
      const fecha = date.toLocaleDateString();

      if (!acc[fecha]) {
        acc[fecha] = {
          day: date.toLocaleDateString("es-ES", { weekday: "long" }),
          date: date,
          early: [],
          late: [],
        };
      }

      if (evento.isMorning === true) {
        acc[fecha].early.push(evento);
      } else {
        acc[fecha].late.push(evento);
      }

      return acc;
    }, {});
    const contenidoJSON = JSON.stringify(Object.values(eventosPorFecha));

    const path = "./uploads/public/reports/" + idEvent + "/";
    const fileName = "cronograma.json";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(`${path}/${fileName}`, contenidoJSON, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${fileName} creado!`);
      }
    });

    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    res.setHeader("Content-Type", "application/json");
    res.send(contenidoJSON);
    //res.json(Object.values(eventosPorFecha))
  } catch (error) {
    if (typeof error.code == "number") {
      handleErrorResponseV2(res, error.message, error.code);
      return;
    }
    handleHttpErrorV2(res, error);
  }
};

module.exports = {
  registerAttendanceByUser,
  registerAttendanceConferenceCurrent,
  getConferenceDayUser,
  POST_ANY_ATTENDANCE,
  getConferences,
  getOneConference,
  createConference,
  updateConference,
  deleteConference,
  ConferencebyEvent,
  getJsonConference,
};
