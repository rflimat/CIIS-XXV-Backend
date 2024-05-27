const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const GalleryEvents=require("./GalleryEvents")
const Events = sequelize.define("events", {
  id_event: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  exp_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  dir_logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dir_brouchere: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:true
  },
},{
  tableName:'events',
    timestamps:false
});


Events.hasMany(GalleryEvents,{
  foreignKey:"eventId",
});

GalleryEvents.belongsTo(Events,{
  foreignKey:"eventId",
});

module.exports=Events;