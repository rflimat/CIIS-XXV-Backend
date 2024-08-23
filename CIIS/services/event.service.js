const { Op, Sequelize } = require("sequelize");
const Event = require("../models/Events");
const Gallery = require("../models/GalleryEvents");

const Reservation = require("../models/Reservation");
const ConferenceAttendance = require("../models/ConferenceAttendance");
const Users = require("../models/Users");
const { uploadImage, deleteImage } = require("../utils/upload.img");

const Events = require("../models/Events");

const getCountAttendances = async (idEvent, idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Users.findOne({
        where: {
          id_user: idUser,
        }
      });
      if (!user) {
        reject({ code: 404, message: "No se ha encontrado el usuario" });
        return;
      }
      const reservation = await Reservation.findOne({
        where: {
          event_id: idEvent,
          user_id: idUser,
        }
      });
      if (!reservation) {
        reject({ code: 404, message: "No se ha encontrado la reservación" });
        return;
      }
      const attendances = await ConferenceAttendance.count({
        where: {
          reservation_id: reservation.id_reservation,
        },
      });

      resolve({ num_attendance: attendances });

    } catch (error) {
      reject(error)
    }
  })
}

const getEvents = async (query) => {
  if (!Object.keys(query).length) {
    const events = await Event.findAll({
      order: [['start_date', 'DESC']]
    });
    return events;
  }

  const { page = 1, limit = 8, search = "" } = query;

  const whereCondition = {};

  if (search) {
    whereCondition[Op.or] = [{ name: { [Op.like]: `%${search}%` } }];
  }
  const offset = (page - 1) * limit;

  const { count, rows } = await Event.findAndCountAll({
    where: whereCondition,
    offset: parseInt(offset),
    limit: parseInt(limit),
    order: [['start_date', 'DESC']]
  });

  const totalPages = Math.ceil(count / limit);
  return {
    events: rows,
    totalPages,
    currentPage: page,
  };
};

const getOneEvent = async (id) => {

  return new Promise(async (resolve, reject) => {
    const event = await Event.findOne({
      where: {
        id_event: id,
      },
    });

    if (!event) {
      reject({
        code: 404,
        message: "El evento no existe"
      });
      return;
    }
    resolve(event.toJSON());
  })
};

const createEvent = (eventObject, fileImageLogo = {}, fileImageBrouchere = {}, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataObject = {
        name: eventObject.name,
        about: eventObject.about,
        place: eventObject.place,
        start_date: eventObject.start_date,
        exp_date: eventObject.exp_date,
        price: eventObject.price,
        //dir_logo
        // dir_brouchere
        active: eventObject.active ? eventObject.active : true,
        type_event_id: eventObject.type_event_id
      };

      let fileImage = {};
      const eventBuild = Event.build(dataObject, {
        transaction,
      });
      if (Object.keys(fileImageLogo).length !== 0) {
        fileImage = await uploadImage(fileImageLogo, "public", "events/logos", [
          "jpg",
          "jpeg",
          "png",
        ]);
        eventBuild.dir_logo = fileImage.filename;
      }
      if (Object.keys(fileImageBrouchere).length !== 0) {
        fileImage = await uploadImage(fileImageBrouchere, "public", "events/brouncheres", [
          "jpg",
          "jpeg",
          "png",
        ]);
        eventBuild.dir_brouchere = fileImage.filename;
      }
      const eventCreated = await eventBuild.save({ transaction });

      resolve(eventCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const updateEvent = (id, eventObject, fileImageLogo = {}, fileImageBrouchere = {}, transaction) => {
  return new Promise(async (resolve, reject) => {
    let pathTemp = '';
    try {
      const eventfind = await Event.findByPk(id);
      if (!eventfind) {
        reject({ code: 404, message: "No se ha encontrado el evento" });
        return;
      }

      const eventUpdate = await eventfind.update(eventObject, { transaction });
      if (Object.keys(fileImageLogo).length > 0) {
        const fileImage = await uploadImage(fileImageLogo, "public", "events/logos", [
          "jpg",
          "jpeg",
          "png",
        ]);
        eventUpdate.dir_logo = fileImage.filename;
        await eventUpdate.save({ transaction });
        pathTemp1 = fileImage.filename;
      }
      if (Object.keys(fileImageBrouchere).length > 0) {
        const fileImage2 = await uploadImage(fileImageBrouchere, "public", "events/brouncheres", [
          "jpg",
          "jpeg",
          "png",
        ]);
        eventUpdate.dir_brouchere = fileImage2.filename;
        await eventUpdate.save({ transaction });
        pathTemp2 = fileImage2.filename;
      }

      resolve(eventUpdate);
    } catch (error) {
      if (error.file == "events/brouncheres") {
        await deleteImage("public", pathTemp1);
        await deleteImage("public", pathTemp2);
      }
      reject(error);
      return;
    }
  });
};

const deleteEvent = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const event = await Event.findOne({
        where: {
          id_event: id
        },
      });

      if (!event) {
        reject({
          code: 404,
          message: "El evento no existe"
        });
        return;
      }
      /* const dataEvent = event.dataValues
      console.log(dataEvent.dir_logo)
      console.log(dataEvent.dir_brouchere)
      if (dataEvent.dir_logo != null) {
        await deleteImage("public", dataEvent.dir_logo)
      }
      if (dataEvent.dir_brouchere != null) {
        await deleteImage("public", dataEvent.dir_brouchere)
      } */
      await event.destroy();
      resolve({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      reject({
        code: 500,
        message: "Error al eliminar el evento"
      });
    }
  });
};

const getEventImagesByType = async ({ type = null }) => {

  if (!type) {
    const eventsGallery = await Event.findAll({
      attributes: ['name', 'about', [Sequelize.fn('YEAR', Sequelize.col('start_date')), 'anio']],
      order: [['start_date', 'ASC']],
      include: [{
        model: Gallery,
        attributes: ['name', 'dir_photo']
      }]
    });
    return eventsGallery;
  }
  const galleryTypeEvent = await Event.findAll({
    attributes: ['name', 'about', [Sequelize.fn('YEAR', Sequelize.col('start_date')), 'anio']],
    where: {
      type_event_id: type
    },
    order: [['start_date', 'ASC']],
    include: [{
      model: Gallery,
      attributes: ['name', 'dir_photo']
    }]
  });

  return galleryTypeEvent;
}

const searchEventActive = async (event) => {
  const oneEvent = await Event.findOne({
    where: {
      id_event: event,
      active: true,
    },
  });
  return (oneEvent);
};

module.exports = {
  getEvents,
  getOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventImagesByType,
  searchEventActive,
  getCountAttendances
};
