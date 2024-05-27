const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Events = require("./Events");
const TypeEvent = sequelize.define(
  'type_event',
  {
    id_typeEvent: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName:'type_events',
    timestamps: false,
  }
);

// TypeEvent.hasMany(Events,{
//   foreinkey: "a",
//   sourceKey:"id_type_event"
// });

// Events.belongsTo(TypeEvent,{
//   foreinkey: "a",
//   targetId: "id_type_event",
// })

TypeEvent.hasMany(Events,{
  foreignKey: "type_event_id",
});
Events.belongsTo(TypeEvent,{
  foreignKey: "type_event_id",
});

module.exports = TypeEvent;
