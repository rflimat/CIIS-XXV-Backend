const sequelize = require("../config/database");
const { nanoid } = require("nanoid");
const { handleHttpError, handleErrorResponse } = require("../middlewares/handleError");
const { encrypt } = require("../utils/password.utils");
const { getDateTime } = require("../utils/getdate.utils");
const userService = require("../services/user.service");
const { createRecordAudit } = require("../services/audit.log.service");
const { generateCodeToCreateAccount, searchCodeEmailToCheckAccount } = require("../services/temporaryCode.service");
const { checkEmail: bodyCheckEmail } = require("../utils/body.email");
const { sendMail } = require("../utils/send.mail.utils");
const { encryptToken } = require("../utils/encrypt.utils");
const { signToken } = require("../utils/jwt.utils");
const { secret_key: { encrypt_secret_key } } = require("../config/development");
const userDTO = require("../DTO/user.dto");

const createAccountUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    //const { exist } = req.user;
    exist = false
    if (exist) {
      const { password } = req.body;
      const passwordHash = await encrypt(password)
      await userService.updateUser(req.user.id, { password_user: passwordHash }, transaction);
    } else {
      const { name, lastname, phone, dni, email, password } = req.body;
      const user = new userDTO(name, lastname, email, dni, phone, "", "");
      user.password = await encrypt(password);
      user.code = nanoid(15);
      user.role = 2;
      await userService.createRegisterUser(user, transaction);
    }
    res.sendStatus(201);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    handleHttpError(res, error);
  }
};

const checkEmailToCreateAccount = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email } = req.body;
    const { user } = req;
    const code = await generateCodeToCreateAccount(user, email, transaction);
    bodyCheckEmail.content = bodyCheckEmail.content.replace("#CODE#", code);

    await sendMail(email, bodyCheckEmail.subject, bodyCheckEmail.content);

    await transaction.commit();
    res.status(201).send("Código enviado")

  } catch (error) {
    await transaction.rollback();
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code)
      return;
    }
    handleHttpError(res, error);
  }
}

const checkCodeToCreateAccount = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, code } = req.query;
    const temporaryCode = await searchCodeEmailToCheckAccount(email, code, transaction);
    const payloadEncrypt = {
      email,
      user: temporaryCode.user_id
    }
    const token = await signToken(payloadEncrypt, "1h", encrypt_secret_key);
    const codeEncrypt = await encryptToken(token, encrypt_secret_key);
    await transaction.commit();
    res.send(encodeURIComponent(codeEncrypt));
  } catch (error) {
    await transaction.rollback();
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    handleHttpError(res, error);
  }
}

const getPreviousInfoUser = async (req, res) => {
  try {
    const email = req.email;
    const userFound = await userService.getUserByEmail(email);
    if (!userFound) {
      return handleErrorResponse(res, "El usuario no existe", 404);
    }

    res.json({
      name: userFound.name_user,
      lastname: userFound.lastname_user,
      dni: userFound.dni_user,
      phone: userFound.phone_user
    });

  } catch (error) {
    handleHttpError(res, error);
  }

}

const createUserOrganizer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { body } = req;

    const userObject = {
      name_user: body.name,
      lastname_user: body.lastname,
      phone_user: body.phone,
      email_user: body.email,
      password_user: await encrypt(body.password),
      dni_user: body.dni,
      code_user: nanoid(15),
      role_id: 3,
      university_career_user: "Ingeniería en informática y sistemas",
      study_center_user: "UNJBG"
    };

    const userCreated = await userService.createRegisterUser(userObject, transaction);

    const recordAuditObject = {
      table_name: "users",
      action_type: "create",
      action_date: getDateTime(),
      user_id: req.iduser,
      record_id: userCreated.id_user,
      new_data: JSON.stringify(userObject.email_user)
    };

    await createRecordAudit(recordAuditObject, transaction);

    await transaction.commit();
    res.sendStatus(201);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

module.exports = {
  createAccountUser,
  createUserOrganizer,
  checkEmailToCreateAccount,
  checkCodeToCreateAccount,
  getPreviousInfoUser
};