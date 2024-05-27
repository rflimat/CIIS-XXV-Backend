const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Roles=sequelize.define("roles",{
    id_role:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name_role:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},{
    timestamps:false
});


module.exports=Roles;