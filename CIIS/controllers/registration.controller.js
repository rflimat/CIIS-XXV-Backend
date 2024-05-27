const path = require("path");
const fs = require("fs");
const sequelize = require("../config/database");
const { getEmailByUserId } = require("../services/user.service");
const registrationService = require("../services/registration.service");
const reservationService = require("../services/reservation.service");
const userService = require("../services/user.service");
const { handleHttpError, handleErrorResponse } = require("../middlewares/handleError");
const { sendMail } = require("../utils/send.mail.utils");
const { confirmedRegistration, deniedRegistration } = require("../utils/body.email");
const { createRecordAudit } = require("../services/audit.log.service");
const { getDateTime } = require("../utils/getdate.utils");
const { sendQRToEmail } = require("../utils/qr.utils");
const PATH_FILES_PRIVATE = path.join(__dirname, "../../uploads/private");

const getRegistrations = async (req, res) => {
  try {
    const registrations = await registrationService.getRegistrations(req.query);
    res.json(registrations);
  } catch (error) {
    handleHttpError(res, error);
  }
}

const getImagesOfTheReserve = async (req, res) => {
  const { folder, idReserve } = req.params;
  const reserveFound = await registrationService.getFilesOfReserve(
    folder.toUpperCase(),
    idReserve
  );

  if (!reserveFound) {
    handleErrorResponse(res, "El archivo no existe.", 404);
    return;
  }

  const imagePath = path.join(PATH_FILES_PRIVATE, reserveFound.dirimage);

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      handleErrorResponse(res, "Error al leer la imagen.", 500);
      return;
    } else {
      res.setHeader("Content-Type", "image/jpeg");
      res.status(200).send(data);
    }
  });
};

const updateEnrollmentStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idReserve } = req.params;
    const { status } = req.body;

    const reservationObject = {
      enrollment_status: status,
    };

    const registrationFound = await registrationService.updateReservation(
      idReserve,
      reservationObject,
      transaction
    );
    const userFound = await getEmailByUserId(registrationFound.user_id);
    
    switch (status) {
      case "2":
        await sendMail(
          userFound.email_user,
          confirmedRegistration.subject,
          confirmedRegistration.content
          );
        break;
      case "3":
        await sendMail(
          userFound.email_user,
          deniedRegistration.subject,
          deniedRegistration.content);
        break;
      default:
        break;
    }
    const recordAuditObject={
      table_name:"reservation",
      action_type:"update",
      action_date:getDateTime(),
      user_id:req.iduser,
      record_id: idReserve,
      new_data: JSON.stringify({status})
    };

    await createRecordAudit(recordAuditObject,transaction);
    await transaction.commit();
    res.sendStatus(204);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code==='number') {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const updateRegistrationObserved = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { idReserve } = req.params;
    const { body, files, attendeeuniversity } = req;
    
    if (Object.keys(body).length > 0) {
      const userObject = {};
      if (body.name !== undefined) userObject.name_user = body.name;
      if (body.lastname !== undefined) userObject.lastname_user = body.lastname;
      if (body.email !== undefined) userObject.email_user = body.email;
      if (body.dni !== undefined) userObject.dni_user = body.dni;
      if (body.phone !== undefined) userObject.phone_user = body.phone;
      
      const { id_user } = await userService.searchUserByReservation(idReserve);      
      await userService.updateUser(id_user, userObject, transaction);

      const recordAuditObject1 = {
        table_name: "user",
        action_type: "update",
        action_date: getDateTime(),
        user_id: req.iduser,
        record_id: id_user,
        new_data: JSON.stringify(userObject)
      };
  
      await createRecordAudit(recordAuditObject1, transaction);  
    }

    if (files) {
      const reservationObject = {};

      const { dir_voucher, dir_fileuniversity } = await reservationService.updateReservationEvent(idReserve, reservationObject, files, attendeeuniversity, transaction);

      if (files.filevoucher !== undefined) reservationObject.dir_voucher = dir_voucher;
      if (files.fileuniversity !== undefined) reservationObject.dir_fileuniversity = dir_fileuniversity;

      const recordAuditObject2 = {
        table_name: "reservation",
        action_type: "update",
        action_date: getDateTime(),
        user_id: req.iduser,
        record_id: idReserve,
        new_data: JSON.stringify(reservationObject)
      };

      await createRecordAudit(recordAuditObject2, transaction);
    }
    
    await transaction.commit();
    res.sendStatus(204);
  } catch (error) {
    await transaction.rollback();
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res, error);
  }
};

const sendQRToUser = async (req,res) => {
    const { users } = req.body;
    console.log(users)
    try {
        await sendQRToEmail(users);
        res.send('QR Enviados');
    } catch (error) {
        handleHttpError(error);
    }
}

module.exports = {
  getRegistrations,
  getImagesOfTheReserve,
  updateEnrollmentStatus,
  updateRegistrationObserved,
  sendQRToUser
};