const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Reservations = require("../models/Reservation");
const Conferences = require("../models/Conferences");
const Users = require("../models/Users");

const ConferenceAttendance = sequelize.define(
  "conference_attendance",
  {
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true, 
        fields: ["reservation_id","user_id","conference_id"],
        name: "unique_attendance",
      },
    ],
  }
);


Users.hasMany(ConferenceAttendance,{
  foreignKey:"user_id"
});

ConferenceAttendance.belongsTo(Users,{
  foreignKey:"user_id"
});

Reservations.hasMany(ConferenceAttendance, {
  foreignKey: "reservation_id",
});

ConferenceAttendance.belongsTo(Reservations, {
  foreignKey: "reservation_id",
});

Conferences.hasMany(ConferenceAttendance, {
  foreignKey: "conference_id",
});

ConferenceAttendance.belongsTo(Conferences, {
  foreignKey: "conference_id",
});

module.exports = ConferenceAttendance;
