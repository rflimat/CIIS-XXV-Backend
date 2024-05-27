const sequelize= require("../config/database");

const getRegistrationsToUpload = async (event,status) => {
  return new Promise(async (resolve, reject) => {
    const query = `CALL reportsReservationsByEvent(:event,:status)`;
    const replacements = { event,status };
    try {
      const results = await sequelize.query(query, {
        replacements
      });

      if (!results || !results.length) {
        reject({
          code: 404,
          message: "No se han encontrado registros en este evento",
        });
        return;
      }
  
      resolve(results);
    } catch (error) {
      reject(error);
    }

  });
};

const getReportAttendanceByEvent=async(event)=>{
  return new Promise(async (resolve, reject) => {
    const query = `CALL reportsAttendanceByEvent(:event)`;
    const replacements = { event};
    try {
      const results = await sequelize.query(query, {
        replacements
      });

      if (!results || !results.length) {
        reject({
          code: 404,
          message: "No se han encontrado registros en este evento",
        });
        return;
      }
  
      resolve(results);
    } catch (error) {
      reject(error);
    }

  });
}
module.exports = {
  getRegistrationsToUpload,
  getReportAttendanceByEvent
};
