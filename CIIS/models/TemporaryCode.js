const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users");

const TemporaryCode = sequelize.define(
  "temporary_code",
  {
    id_temporary_code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code_temporary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_user: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    exp_date_code: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    used_code: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "temporary_codes",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "email_user","code_temporary"],
        name: "user_email_code",
      },
    ],
  }
);

Users.hasMany(TemporaryCode, {
  foreignKey: "user_id",
});

TemporaryCode.belongsTo(Users, {
  foreignKey: "user_id",
});

module.exports = TemporaryCode;
