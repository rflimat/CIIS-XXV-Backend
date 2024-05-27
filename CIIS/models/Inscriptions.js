const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users");

const Inscriptions = sequelize.define("inscriptions", {
  id_inscription: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  checked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  delegacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Establece la relación entre Users e Inscriptions
Users.hasMany(Inscriptions, { foreignKey: "id_user" });
Inscriptions.belongsTo(Users, { foreignKey: "id_user" });

module.exports = Inscriptions;
