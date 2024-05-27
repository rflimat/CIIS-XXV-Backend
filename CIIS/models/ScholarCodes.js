const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ScholarCodes = sequelize.define("scholar_codes", {
  id_sc: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ScholarCodes;
