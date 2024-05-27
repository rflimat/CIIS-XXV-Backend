const sequelize = require("../config/database");
const EventService = require("../services/event.service");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../middlewares/handleError");
const {
  ItemsGalleryDTO,
  EventsGalleryTypeDTO,
} = require("../DTO/events-gallery-type.dto");
const {
  createConferenceAttendance,
  searchConferencesByShiftAndEvent,
  searchRegisterByEventAndUser,
  verifyRegisterStatusAndDateExp,
  getTimeOfDayToConferences
} = require("../services/conference.attendance.service.js");
const { getDateTime, getDateTimeLocalPeru,getDateUTC } = require("../utils/getdate.utils");

const getEvents = async (req, res) => {
  try {
    const events = await EventService.getEvents(req.query);
    res.json(events);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const getOneEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;

    const event = await EventService.getOneEvent(idEvent);

    res.status(200).json(event);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const createEvent = (req, res) => {};

const updateEvent = (req, res) => {};

const deleteEvent = (req, res) => {};

const getEventImages = async (req, res) => {
  try {
    const eventsGallery = await EventService.getEventImagesByType(req.query);
    const eventsGalleryByType = eventsGallery.map((event) => {
      const galleryByEvent = event.Gallery_Events.map(
        (item) => new ItemsGalleryDTO(item.dir_photo, item.name)
      );

      return new EventsGalleryTypeDTO(event.name, event.about,event.get('anio'), galleryByEvent);
    });
    res.json(eventsGalleryByType);
  } catch (error) {
    handleHttpError(res, error);
  }
};

const registerAttendance = async (req, res) => {
  
  const transaction = await sequelize.transaction();
  try {
    const { idEvent } = req.params;
    const { idUser } = req;
  
    const reservationFound = await searchRegisterByEventAndUser(idEvent, idUser);
    const currentDate = getDateUTC();

    await verifyRegisterStatusAndDateExp(reservationFound,currentDate);

    const isMorning=getTimeOfDayToConferences(currentDate,'00','13');

    const conferecesFound = await searchConferencesByShiftAndEvent(
      isMorning,idEvent,currentDate
    );

    await createConferenceAttendance(
      conferecesFound,
      reservationFound.id_reservation,
      transaction
    );

    await transaction.commit();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};


const getCountAttendances = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const user = req.iduser;
    const attendances = await EventService.getCountAttendances(idEvent, user);
    res.json(attendances);
  } catch (error) {
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const registerOneAttendance=()=>new Promise((resolve, reject) => {
  
})


module.exports = {
  getEvents,
  getOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventImages,
  registerAttendance,
  getCountAttendances
};
