const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Topics = require("../models/Topics");
const Events = require("../models/Events");

const TopicEvents = sequelize.define(
  "topic_event",
  {
  },
  {
    timestamps: false,
    tableName:'topic_event',
    indexes: [
      {
        unique: true, // Add contrainst to unique id reservation and conference
        fields: ["event_id", "topic_id"],
        name: "unique_conference_reservation",
      },
    ],
  }
);

Events.hasMany(TopicEvents, {
  foreignKey: "event_id",
});

TopicEvents.belongsTo(Events, {
  foreignKey: "event_id",
});

Topics.hasMany(TopicEvents, {
  foreignKey: "topic_id",
});

TopicEvents.belongsTo(Topics, {
  foreignKey: "topic_id",
});

module.exports = TopicEvents;