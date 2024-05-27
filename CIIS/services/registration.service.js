const { Op, Sequelize } = require("sequelize");
const Reservation = require("../models/Reservation");
const Events = require("../models/Events");
const Users = require("../models/Users");
const PriceTypeAttendee = require("../models/PriceTypeAttendee");

const getRegistrations = async (query, event_id = false) => {
  if (!Object.keys(query).length) {
    const { count, rows } = await Reservation.findAndCountAll({
      include: [
        {
          model: Users,
          attributes: [
            "id_user",
            "name_user",
            "lastname_user",
            "email_user",
            "dni_user",
            "phone_user",
          ],
        },
        {
          model: PriceTypeAttendee,
          attributes: ["price_attendee", "type_attendee_id"],
          required: true,
        },
      ],
    });

    const registrationsMap = rows.map((registration) => {
      return {
        id: registration.id_reservation,
        typeattendee: registration.price_type_attendee.type_attendee_id,
        enrollmentstatus: registration.enrollment_status,
        dir_voucher: registration.dir_voucher,
        dir_fileuniversity: registration.dir_fileuniversity ?? null,
        numvoucher: registration.num_voucher,
        name: registration.user.name_user,
        lastname: registration.user.lastname_user,
        email: registration.user.email_user,
        dni: registration.user.dni_user,
        phone: registration.user.phone_user,
        price: registration.price_type_attendee.price_attendee,
        scholar_code: registration.scholar_code,
      };
    });

    return {
      registrations: registrationsMap,
      totalRecords: count,
    };
  }

  const {
    page = 1,
    limit = 8,
    search = "",
    year = "",
    event = "",
    status = "",
  } = query;

  const whereUsers = {};
  const whereEvents = {};
  const whereReservations = {};
  if (search) {
    whereUsers[Op.or] = [
      { name_user: { [Op.like]: `%${search}%` } },
      { lastname_user: { [Op.like]: `%${search}%` } },
    ];
  }

  if (year && event) {
    whereEvents[Op.and] = [
      Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("start_date")), year),
      { type_event_id: { [Op.eq]: event } },
    ];
  } else if (year) {
    whereEvents[Op.and] = [
      Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("start_date")), year),
    ];
  } else if (event) {
    whereEvents[Op.and] = [{ type_event_id: { [Op.eq]: event } }];
  }

  if (status) {
    whereReservations[Op.and] = [
      {
        enrollment_status: { [Op.eq]: status },
        ...(event_id ? { event_id } : {}),
      },
    ];
  }
  const offset = (page - 1) * limit;

  const { count, rows } = await Reservation.findAndCountAll({
    where: whereReservations,
    include: [
      {
        model: Events,
        where: whereEvents,
      },
      {
        model: Users,
        attributes: [
          "id_user",
          "name_user",
          "lastname_user",
          "email_user",
          "dni_user",
          "phone_user",
        ],
        where: whereUsers,
      },
      {
        model: PriceTypeAttendee,
        attributes: ["price_attendee", "type_attendee_id"],
        required: true,
      },
    ],
    offset: parseInt(offset),
    limit: parseInt(limit),
  });

  const totalPages = Math.ceil(count / limit);

  const rowsMap = rows.map((registration) => {
    return {
      id: registration.id_reservation,
      typeattendee: registration.price_type_attendee.type_attendee_id,
      dir_voucher: registration.dir_voucher,
      dir_fileuniversity: registration.dir_fileuniversity ?? null,
      enrollmentstatus: registration.enrollment_status,
      numvoucher: registration.num_voucher,
      name: registration.user.name_user,
      lastname: registration.user.lastname_user,
      email: registration.user.email_user,
      dni: registration.user.dni_user,
      phone: registration.user.phone_user,
      price: registration.price_type_attendee.price_attendee,
    };
  });

  return {
    registrations: rowsMap,
    totalRecords: count,
    totalPages,
    currentPage: page,
  };
};

const getFilesOfReserve = async (nameFolder, idReserve) => {
  const folders = {
    UNIVERSITY: "dir_fileuniversity",
    VOUCHER: "dir_voucher",
  };

  const folder = folders[`${nameFolder}`]
    ? folders[`${nameFolder}`]
    : "dir_voucher";

  const reserveFound = await Reservation.findOne({
    attributes: [[folder, "dirimage"]],
    where: {
      id_reservation: idReserve,
    },
    raw: false,
  });

  return reserveFound.toJSON();
};

const updateReservation = async (id, reservationObject, transaction) =>
  new Promise(async (resolve, reject) => {
    try {
      const reservationFound = await Reservation.findOne({
        where: {
          id_reservation: id,
        },
      });

      if (!reservationFound) {
        reject({ code: 404, message: "No se ha encontrado la reservación" });
        return;
      }
      await reservationFound.update(reservationObject, { transaction });
      resolve(reservationFound.toJSON());
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  getRegistrations,
  getFilesOfReserve,
  updateReservation,
};
