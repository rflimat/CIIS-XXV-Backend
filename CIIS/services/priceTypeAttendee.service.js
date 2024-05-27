const PriceTypeAttendee = require("../models/PriceTypeAttendee");
const TypeAttendee = require("../models/TypeAttendee");
const Reservation = require("../models/Reservation");
const { getDate } = require("../utils/getdate.utils");
const { Op } = require("sequelize");
const {getDateTimeLocalPeru}=require("../utils/getdate.utils");

const searchTypeAttendeByEvent = async (type, event) => {
  const currentDate=getDate();
  const oneTypeAttendee = await PriceTypeAttendee.findOne({
    where: {
      type_attendee_id: type,
      event_id: event,
      [Op.and]: [
        { start_date_price: { [Op.lte]: currentDate } },
        {
          exp_date_price: {
            [Op.or]: {
              [Op.is]: null,
              [Op.gte]: currentDate,
            },
          },
        },
      ],
    },
    include: {
      model: TypeAttendee,
      required: true,
    },
  });
  console.log(oneTypeAttendee);
  return oneTypeAttendee.toJSON();
};

const searchTypeAttendeByReservation = async (id_reservation) => {  
  return new Promise(async (resolve, reject) => {
    try {
      const reservation = await Reservation.findOne({
        where: {
          id_reservation: id_reservation,
        },
        include: PriceTypeAttendee
      });
    
      if (!reservation || !reservation.price_type_attendee) {
        reject({code: 404, message: "No se ha encontrado la reservación"});
        return;
      }
        
      const typeAttendee = await TypeAttendee.findByPk(reservation.price_type_attendee.type_attendee_id);
      if (!typeAttendee) {
        reject({code: 404, message: "No se ha encontrado el tipo de asistente"});
        return;
      }
    
      resolve(typeAttendee.toJSON());
    } catch (error) {
      reject(error);
      return;
    }
  });
};

const updatePriceTypeAttendee = async (id, priceTypeAttendeeObject, transaction) => new Promise(async (resolve, reject) => {
  try {
    const priceTypeAttendeeFound = await PriceTypeAttendee.findOne({
      where: {
        id_price_type_attendee: id
      }
    });

    if (!priceTypeAttendeeFound) {
      reject({ code: 404, message: "No se ha encontrado el tipo de precio de asistente" });
      return;
    }

    await priceTypeAttendeeFound.update(priceTypeAttendeeObject, { transaction });
    resolve(priceTypeAttendeeFound.toJSON());
  } catch (error) {
    reject(error);
  }
});

module.exports = {
  searchTypeAttendeByEvent,
  searchTypeAttendeByReservation,
  updatePriceTypeAttendee,
};