const {Op}=require("sequelize");
const TemporaryCode = require("../models/TemporaryCode");
const { createCode } = require("../utils/generate.code.utils");
const {
  getDateUTC,
  getDateTimeLocalPeru,
  getDateTime,
} = require("../utils/getdate.utils");

const generateCodeToCreateAccount = (user, email, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = await createCode(5);
      const objectData = {
        user_id: user.exist ? user.id : null,
        code_temporary: code,
        email_user: email,
        // exp_date_code: new Date(getDateTime())+2* 60 * 60 * 1000,
      };

      const temporaryCodeCreated = await TemporaryCode.create(objectData, {
        transaction,
      });

      resolve(code);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        reject({
          code: 409,
          message: "Vuelva a ingresar su correo",
        });
        return;
      }
      reject(error);
    }
  });
};

const searchCodeEmailToCheckAccount = (email, code, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentDate = getDateTime();
      console.log(currentDate);
      const temporaryCodeFound = await TemporaryCode.findOne({
        where: {
          email_user: email,
          code_temporary: code,
          [Op.and]: [{ exp_date_code: { [Op.gte]: currentDate } }],
        },
      });

      if (!temporaryCodeFound) {
        reject({
          code: 400,
          message: "El código no es válido",
        });
        return;
      }

      if (temporaryCodeFound.toJSON().used_code) {
        reject({
          code: 400,
          message: "El código ha expirado ",
        });
        return;
      }

      await temporaryCodeFound.update({ used_code: true }, { transaction });
      resolve(temporaryCodeFound.toJSON());
    } catch (error) {
        reject(error);
    }
  });
};
module.exports = {
  generateCodeToCreateAccount,
  searchCodeEmailToCheckAccount,
};
