const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const TallerSQL = require("./Taller");
const Users = require("../Users");

const TallerInscriptionSQL = sequelize.define("tallerInscription", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  voucher: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
});

TallerInscriptionSQL.belongsTo(Users, { foreignKey: "relatedUser" });
TallerInscriptionSQL.belongsTo(TallerSQL, { foreignKey: "relatedTaller" });

module.exports = TallerInscriptionSQL;
