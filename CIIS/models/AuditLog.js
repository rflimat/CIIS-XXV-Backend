const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog=sequelize.define("audit_log",{
    audit_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    table_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    action_type:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    action_date:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    record_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    old_data:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    new_data:{
        type:DataTypes.STRING,
        allowNull:true,
    },
},{
    timestamps:false
});


module.exports=AuditLog;