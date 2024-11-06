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
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  avaible: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  start_2: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_2: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_morning: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
});

// Establece la relación entre Users e Inscriptions
TallerSQL.belongsTo(Speakers, { foreignKey: "relatedSpeaker" });
TallerSQL.belongsTo(Events, { foreignKey: "relatedEvent" });

module.exports = TallerSQL;
