const { Op, literal, Sequelize } = require("sequelize");
const Reservation = require("../models/Reservation");
const ConferenceAttendance = require("../models/ConferenceAttendance");
const Conferences = require("../models/Conferences");
const Events = require("../models/Events");
const Speakers = require("../models/Speakers");
const Users = require("../models/Users");
const {
  getDateUTC,
  formatDateToUTC5,
  getDateTime,
} = require("../utils/getdate.utils");

const searchRegisterByEventAndUser = async (event, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const registerFound = await Reservation.findOne({
        where: {
          user_id: user,
          event_id: event,
          active: true,
        },
        include: [
          {
            model: Events,
            attributes: ["start_date", "exp_date"],
            required: true,
            where: {
              active: true,
            },
          },
        ],
      });

      if (!registerFound) {
        reject({
          code: 404,
          message: "No se encuentra registrado al evento",
        });
        return;
      }

      resolve(registerFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });
};

const searchRegisterByEventAndUserV2 = async (event, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const registerFound = await Reservation.findOne({
        where: {
          user_id: user,
          event_id: event,
          active: true,
        },
        include: [
          {
            model: Events,
            attributes: ["start_date", "exp_date"],
            required: true,
            where: {
              active: true,
            },
          },
        ],
      });

      if (!registerFound) {
        resolve(null);
        return;
      }

      resolve(registerFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });
};

const searchConferencesByEventAndDate = async (event, currentDate) => {
  return new Promise(async (resolve, reject) => {
    const conferenceFound = await Conferences.findAll({
      attributes: ["id_conference"],
      where: {
        event_id: event,
        [Op.and]: [
          {
            start_date_conference: {
              [Op.lte]: currentDate,
            },
          },
          {
            exp_date_conference: {
              [Op.gte]: currentDate,
            },
          },
        ],
      },
    });

    if (!conferenceFound || !conferenceFound.length) {
      reject({
        code: 404,
        message: "No hay conferencias disponibles en el evento",
      });
      return;
    }

    resolve(JSON.stringify(conferenceFound));
  });
};

const searchOneConference = (conferenceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const conferenceFound = await Conferences.findOne({
        where: {
          [Op.and]: [
            {
              id_conference: conferenceId,
            },
            {
              is_active: true,
            },
          ],
        },
      });

      if (!conferenceFound) {
        reject({
          code: 404,
          message: "No hay conferencia disponible",
        });
        return;
      }
      resolve(conferenceFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });

const searchOneConferenceByDateTimeAvailability = async (eventId) => {
  return new Promise(async (resolve, reject) => {
    const currentDateTime = getDateTime();

    const conferenceFound = await Conferences.findOne({
      where: {
        [Op.and]: [
          {
            event_id: eventId,
          },
          {
            is_active: true,
          },
          {
            start_date_conference: {
              [Op.lte]: currentDateTime,
            },
          },
          {
            exp_date_conference: {
              [Op.gte]: currentDateTime,
            },
          },
        ],
      },
    });

    if (!conferenceFound) {
      reject({
        code: 404,
        message: "No hay conferencia disponible en este momento",
      });
      return;
    }

    resolve(conferenceFound.toJSON());
  });
};

const searchConferencesByShiftAndEvent = async (
  shift = true,
  event,
  currentDateTime
) => {
  return new Promise(async (resolve, reject) => {
    const currentDate = currentDateTime.slice(0, 10);
    console.log({ shift });
    const conferenceFound = await Conferences.findAll({
      attributes: ["id_conference"],
      where: Sequelize.and(
        Sequelize.where(
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("start_date_conference"),
            "%Y-%m-%d"
          ),
          currentDate
        ),
        {
          event_id: event,
          is_morning: shift,
        }
      ),
    });

    if (!conferenceFound || !conferenceFound.length) {
      reject({
        code: 404,
        message: "No hay conferencias disponibles en el evento",
      });
      return;
    }

    resolve(conferenceFound);
  });
};

const createConferenceAttendance = async (
  conferences,
  reservation,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conferenceAttendances = conferences.map((conference) => {
        return {
          reservation_id: reservation,
          conference_id: conference.id_conference,
        };
      });
      await ConferenceAttendance.bulkCreate(conferenceAttendances, {
        transaction,
      });
      resolve();
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        reject({
          code: 409,
          message: "Ya se ha registrado asistencia anteriormente",
        });
      } else {
        reject(error);
      }
    }
  });
};

const verifyRegisterStatusAndDateExp = async (reservation, currentDateTime) => {
  return new Promise((resolve, reject) => {
    if (reservation.enrollment_status != 2) {
      reject({ code: 400, message: "El registro no fue confirmado" });
      return;
    }

    const { start_date = "2023-08-11", exp_date = "2023-08-11" } =
      reservation.event;
    const date = currentDateTime.slice(0, 10);

    if (date >= start_date && date <= exp_date) {
      resolve();
      return;
    }

    reject({
      code: 400,
      message: "No hay evento disponible en esta fecha",
    });
    return;
  });
};

const checkEventRegistrationAvailability = (enrollmentStatus = 1) =>
  new Promise((resolve, reject) => {
    if (enrollmentStatus != 2) {
      reject({ code: 400, message: "Su registro al evento no fue confirmado" });
      return;
    }
    resolve();
  });

const checkAllowedAttendanceToUser = (userId) =>
  new Promise(async (resolve, reject) => {
    const user = await Users.findOne({
      attributes: ["allowedAttendance"],
      where: {
        id_user: userId,
      },
    });

    if (user.allowedAttendance != 1) {
      reject({
        code: 400,
        message: "No tiene permiso para marcar asistencia.",
      });
      return;
    }
    resolve();
  });

const checkConferenceAvailabilityByDateTime = (startDateTime, expDateTime) =>
  new Promise((resolve, reject) => {
    startDateTime = formatDateToUTC5(startDateTime);
    expDateTime = formatDateToUTC5(expDateTime);
    console.log(startDateTime, expDateTime);
    const currentDateTime = getDateUTC();

    if (currentDateTime >= startDateTime && currentDateTime <= expDateTime) {
      resolve();
      return;
    }

    reject({
      code: 400,
      message: "Conferencia no disponible en este horario",
    });
    return;
  });

const getTimeOfDayToConferences = (
  currentDateTime,
  minHour = "08",
  maxHour = "13"
) => {
  const hour = currentDateTime.slice(11, 13);

  let isMorning = 0;

  if (hour >= minHour && hour <= maxHour) {
    isMorning = 1;
  }

  return isMorning;
};

const createOneConferenceAttendance = async (
  conferenceId,
  reservationId,
  userId,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conferenceAttendanceObject = {
        conference_id: conferenceId,
        reservation_id: reservationId,
        user_id: userId,
      };
      await ConferenceAttendance.create(conferenceAttendanceObject, {
        transaction,
      });
      resolve();
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        reject({
          code: 409,
          message: "Ya se ha registrado asistencia anteriormente",
        });
        return;
      } else {
        reject(error);
      }
    }
  });
};

const getConferenceByDayByUser = async (day, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Users.findOne({
        where: {
          id_user: userId,
        },
      });
      if (!user) {
        reject({ code: 404, message: "No se ha encontrado el usuario" });
        return;
      }

      let conferences = await Conferences.findAll({
        attributes: [
          "id_conference",
          "topic_conference",
          "start_date_conference",
          "exp_date_conference",
        ],
        include: [
          {
            model: Speakers,
            attributes: ["name_speaker", "lastname_speaker"],
          },
        ],
        where: literal(`DATE(start_date_conference) = '${day}'`),
      });

      await Promise.all(
        conferences.map(async (conference) => {
          let attendance = await ConferenceAttendance.count({
            where: { user_id: userId, conference_id: conference.id_conference },
          });

          conference.dataValues.attendance = Boolean(attendance);
          return Promise.resolve(conference);
        })
      );

      resolve(conferences);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createConferenceAttendance,
  createOneConferenceAttendance,
  searchConferencesByEventAndDate,
  searchRegisterByEventAndUser,
  searchConferencesByShiftAndEvent,
  searchOneConference,
  searchOneConferenceByDateTimeAvailability,
  checkAllowedAttendanceToUser,
  checkConferenceAvailabilityByDateTime,
  checkEventRegistrationAvailability,
  verifyRegisterStatusAndDateExp,
  getTimeOfDayToConferences,
  getConferenceByDayByUser,
  searchRegisterByEventAndUserV2,
};
