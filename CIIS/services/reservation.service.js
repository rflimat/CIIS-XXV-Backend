const Reservation = require("../models/Reservation");
const { uploadImage, deleteImage } = require("../utils/upload.img");

const createReservationEvent = async (
  registerObject,
  files,
  attendeeuniversity,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    let pathTemp = "";
    let objectDir = [];
    try {
      const reservationCreated = await Reservation.create(registerObject, {
        transaction,
      });
      const { imgvoucher } = files;
      const voucherUploaded = await uploadImage(
        imgvoucher,
        "private",
        "voucher",
        ["jpg", "jpeg", "png"]
      );

      objectDir.push(voucherUploaded.filename);
      pathTemp = voucherUploaded.filename;

      if (!attendeeuniversity) {
        reservationCreated.dir_voucher = voucherUploaded.filename;
        await reservationCreated.save({ transaction });
        resolve({ ok: true, objectDir });
        return;
      }
      const { fileuniversity } = files;
      const fileuniversityUploaded = await uploadImage(
        fileuniversity,
        "private",
        "file-university",
        ["jpg", "jpeg", "png"]
      );

      reservationCreated.dir_voucher = voucherUploaded.filename;
      reservationCreated.dir_fileuniversity = fileuniversityUploaded.filename;
      await reservationCreated.save({ transaction });

      objectDir.push(fileuniversityUploaded.filename);

      resolve({ ok: true, objectDir });
      return;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        // Manejar el error de campo único
        reject({
          code: 409,
          message: "El número de voucher ya fue utilizado, ¡ingrese uno nuevo!",
        });
        return;
      } else if (error.file == "file-university") {
        await deleteImage("private",pathTemp);
        reject(error);
        return;
      } else {
        reject(error);
        return;
      }
    }
  });
};

const updateReservationEvent = async (id, reservationObject, fileImages, attendeeuniversity, transaction) => {
  return new Promise(async (resolve, reject) => {
    let pathTemp1 = '';
    let pathTemp2='';
    let objectDir = [];
    try {
      const ReservationFind = await Reservation.findByPk(id);
      if (!ReservationFind) {
        reject({code: 404, message: "No se ha encontrado la reservación"});
        return;
      }
      
      const reservationUpdate = await ReservationFind.update(reservationObject, { transaction });

      const { filevoucher } = fileImages;
      if (filevoucher) {
        const fileImageVoucher = await uploadImage(filevoucher,"private","voucher", [
          "jpg",
          "jpeg",
          "png",
        ]);
        reservationUpdate.dir_voucher = fileImageVoucher.filename;
        await reservationUpdate.save({ transaction });
        pathTemp1 = fileImageVoucher.filename;
      }

      const { fileuniversity } = fileImages;
      if (fileuniversity && attendeeuniversity) {
        const fileImageUniversity = await uploadImage(fileuniversity,"private","file-university", [
          "jpg",
          "jpeg",
          "png",
        ]);
        reservationUpdate.dir_fileuniversity = fileImageUniversity.filename;
        await reservationUpdate.save({ transaction });
        pathTemp2 = fileImageUniversity.filename;
      }
      
      resolve(reservationUpdate);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        reject({code: 409, message: "El número de voucher ya fue utilizado"});
      } else if (error.file == "voucher") {
        await deleteImage("private", pathTemp1);
        reject(error);
      } else if (error.file == "file-university") {
        await deleteImage("private", pathTemp2);
        reject(error);
      }
      return;
    }
  });
};

module.exports = {
  createReservationEvent,
  updateReservationEvent,
};
