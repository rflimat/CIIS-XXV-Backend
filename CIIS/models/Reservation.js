const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users");
const Events = require("./Events");
const PriceTypeAttendee = require("./PriceTypeAttendee");

const Reservation = sequelize.define(
  "reservation",
  {
    id_reservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    num_voucher: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    dir_voucher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dir_fileuniversity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enrollment_status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    scholar_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    allowedAttendance:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue: 0,
    }
  },
  {
    timestamps: false,
  }
);

Users.hasMany(Reservation, {
  foreignKey: "user_id",
});

Reservation.belongsTo(Users, {
  foreignKey: "user_id",
});

Events.hasMany(Reservation, {
  foreignKey: "event_id",
});

Reservation.belongsTo(Events, {
  foreignKey: "event_id",
});

PriceTypeAttendee.hasMany(Reservation, {
  foreignKey: "price_type_attendee_id",
});

Reservation.belongsTo(PriceTypeAttendee, {
  foreignKey: "price_type_attendee_id",
});

module.exports = Reservation;
