const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Roles = require("./Roles");

const Users = sequelize.define(
  "users",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email_user: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni_user: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    phone_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    university_career_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    study_center_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allowedAttendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

Roles.hasMany(Users, {
  foreignKey: "role_id",
});

Users.belongsTo(Roles, {
  foreignKey: "role_id",
});

module.exports = Users;
