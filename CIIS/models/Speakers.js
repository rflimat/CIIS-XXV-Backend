const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Speakers = sequelize.define(
  "speaker",
  {
    id_speaker: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_speaker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname_speaker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ocupation_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    university_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    about_profile_speaker: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dir_img_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_place_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    degree_speaker: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trajectory_speaker: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    achievements_speaker: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    release_year_speaker: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    experience_years_speaker: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_speaker: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Speakers;
