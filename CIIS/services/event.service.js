const { Op,Sequelize } = require("sequelize");
const Event = require("../models/Events");
const Gallery=require("../models/GalleryEvents");

const Reservation = require("../models/Reservation");
const ConferenceAttendance = require("../models/ConferenceAttendance");
const Users = require("../models/Users");

const getCountAttendances = async (idEvent, idUser) => {
  return new Promise (async (resolve, reject) => {
    try {
      const user = await Users.findOne({
        where: {
          id_user: idUser,
        }
      });
      if (!user) {
          reject({code: 404, message: "No se ha encontrado el usuario"});
          return;
      }      
      const reservation = await Reservation.findOne({
        where: {
          event_id: idEvent,
          user_id: idUser,
        }
      });
      if (!reservation) {
          reject({code: 404, message: "No se ha encontrado la reservación"});
          return;
      }
      const attendances = await ConferenceAttendance.count({
          where: {
            reservation_id: reservation.id_reservation,
          },
      });

      resolve({num_attendance: attendances});
      
    } catch (error) {
      reject(error)      
    }
  })
}

const getEvents = async (query) => {
  if (!Object.keys(query).length) {
    const events = await Event.findAll();
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
  });

  const totalPages = Math.ceil(count / limit);
  return {
    events: rows,
    totalPages,
    currentPage: page,
  };
};

const getOneEvent = async (id) => {

  return new Promise(async(resolve, reject) => {
    const event = await Event.findOne({
      where: {
        id_event:id,
      },
    });

    if(!event){
      reject({
        code:404,
        message:"El evento no existe"
      });
      return;
    }
    resolve(event.toJSON());
  })
};

const createEvent = async (eventObject) => {
  const newEvent = await Event.create(eventObject);
  return newEvent;
};

const updateEvent = async(id,body) =>{
  
  const eventFound=await Event.findOne({
    where:{
      id
    }
  });

  await eventFound.update(body);
};

const deleteEvent = async(id) => {
  
  await Event.destroy({
    where:{
      id,
    }
  })
};

const getEventImagesByType=async({type=null})=>{
  
  if(!type){
    const eventsGallery=await Event.findAll({
      attributes:['name','about',[Sequelize.fn('YEAR', Sequelize.col('start_date')), 'anio']],
      order:[['start_date','ASC']],
      include:[{
        model:Gallery,
        attributes:['name','dir_photo']
      }]
    });
    return eventsGallery;
  }
  const galleryTypeEvent=await Event.findAll({
    attributes:['name','about',[Sequelize.fn('YEAR', Sequelize.col('start_date')), 'anio']],
    where:{
      type_event_id:type
    },
    order:[['start_date','ASC']],
    include:[{
      model:Gallery,
      attributes:['name','dir_photo']
    }]
  });

  return galleryTypeEvent;
}

const searchEventActive = async (event) => {
  const oneEvent = await Event.findOne({
    where: {
      id_event:event,
      active:true,
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
