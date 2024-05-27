const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Events = require("./Events");
const TypeAttendee = require("./TypeAttendee");

const PriceTypeAttendee = sequelize.define(
  "price_type_attendee",
  {
    id_price_type_attendee: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price_attendee: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    start_date_price: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    exp_date_price: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);


Events.hasMany(PriceTypeAttendee,{
    foreignKey:"event_id"
});

PriceTypeAttendee.belongsTo(Events,{
    foreignKey:"event_id"
});

TypeAttendee.hasMany(PriceTypeAttendee,{
    foreignKey:"type_attendee_id"
});

PriceTypeAttendee.belongsTo(TypeAttendee,{
    foreignKey:"type_attendee_id"
});

module.exports=PriceTypeAttendee;
