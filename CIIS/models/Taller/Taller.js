const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Speakers = require("../Speakers");
const Events = require("../Events");

const TallerSQL = sequelize.define("taller", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  tickets: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  avaible: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  start: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  end: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Establece la relación entre Users e Inscriptions
TallerSQL.belongsTo(Speakers, { foreignKey: "relatedSpeaker" });
TallerSQL.belongsTo(Events, { foreignKey: "relatedEvent" });

module.exports = TallerSQL;
