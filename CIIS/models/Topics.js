const {DataTypes}=require("sequelize");
const sequelize = require("../config/database");

const Topics=sequelize.define("topic",{
    id_topic:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_topic:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description_topic:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    is_active_topic:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
},{
    timestamps:false
});


module.exports=Topics;