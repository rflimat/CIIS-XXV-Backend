const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Events = require("../models/Events");

const Sponsors = sequelize.define("sponsor",{
    id_sponsor:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_sponsor:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    dir_img_sponsor:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},{
    timestamps:false
});

Events.hasMany(Sponsors,{
    foreignKey:"event_id"
});

Sponsors.belongsTo(Events,{
    foreignKey:"event_id"
});

module.exports = Sponsors;