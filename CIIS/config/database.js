const { Sequelize } = require("sequelize");
const { database } = require("./development");
const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: "mysql",
    dialectOptions: {
      //   ssl: {
      //     require: false, // Requiere una conexión segura
      //     rejectUnauthorized: false // Permite conexiones a servidores con certificados no confiables
      //   },
    },
  }
);

module.exports = sequelize;
