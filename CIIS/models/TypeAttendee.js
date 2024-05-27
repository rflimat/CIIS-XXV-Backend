const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeAttendee=sequelize.define('type_attendee',{
    id_type_attendee:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_attendee:{
        type:DataTypes.STRING(100),
        allowNull:false,
    },
    isuniversity:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
},{
    timestamps:false
});

module.exports=TypeAttendee;