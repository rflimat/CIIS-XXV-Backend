const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Events=require("../models/Events");
const Speakers=require("../models/Speakers");

const Conferences=sequelize.define("conference",{
    id_conference:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    topic_conference:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    start_date_conference:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    exp_date_conference:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    is_morning:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:true
    }
},{
    timestamps:false
});

Events.hasMany(Conferences,{
    foreignKey:"event_id"
});

Conferences.belongsTo(Events,{
    foreignKey:"event_id"
});

Speakers.hasMany(Conferences,{
    foreignKey:"speaker_id"
});

Conferences.belongsTo(Speakers,{
    foreignKey:"speaker_id"
});


module.exports=Conferences;