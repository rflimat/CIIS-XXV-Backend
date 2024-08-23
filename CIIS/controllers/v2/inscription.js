const path = require("path");
const ScholarCodes = require("../../models/ScholarCodes");
const Reservation = require("../../models/Reservation");
const { sendMail } = require("../../utils/send.mail.utils");
const { emailRegistroCIIS } = require("../../utils/emails/registro");
const http = require("../../utils/http.msg");
const { getRegistrations } = require("../../services/registration.service");
const TypeAttendee = require("../../models/TypeAttendee");

const CONTROLLER_INSCRIPTION = {};


const registers = {
  op1: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }
    req.files.payment_doc.mv(
      path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.png`),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.png`,
            dir_fileuniversity: null,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 11,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        }
      }
    );
  },
  op2: (req, res) => {
    if (!req.files || Object.keys(req.files).length != 2) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.png`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.png`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.png`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.png`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 12,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        });
    }
  },
  op3: (req, res) => {
    if (!req.body.scholar_code)
      return res.status(400).send("Hace falta el código de delegación");

    ScholarCodes.findOne({ where: { code: req.body.scholar_code } })
      .then((match) => {
        if (!match)
          return Promise.reject({
            error: "Código no existente",
            reason: "No hemos registrado este código de delegación",
            code: 500,
          });
        else return Promise.resolve();
      })
      .then(() => {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send("Hace falta los archivos requeridos");
        }

        if (req.files.payment_doc && req.files.scholar_doc) {
          req.files.payment_doc
            .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.png`))
            .then(() =>
              req.files.scholar_doc.mv(
                path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.png`)
              )
            )
            .then(() => {
              Reservation.create({
                num_voucher: null,
                dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.png`,
                dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.png`,
                enrollment_status: 0,
                active: false,
                user_id: req.user.id,
                event_id: req.params.event,
                price_type_attendee_id: 13,
                scholar_code: req.body.scholar_code,
                created_at: new Date(),
              })
                .then((data) => {
                  sendMail(
                    req.user.email,
                    'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                    emailRegistroCIIS(req.user)
                  );
                  res.status(201).send(data.dataValues);
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send(http["500"]);
                });
            });
        }
      })
      .catch((fail = null) => {
        fail.code
          ? res.status(fail.code).send(fail)
          : res.status(500).send(http["500"]);
      });
  },
  op4: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.png`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.png`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.png`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.png`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 14,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        });
    }
  },
};

const registersPostmaster = {
  estudiantesesis: (req, res) => {
    if (!req.files || Object.keys(req.files).length != 2) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".")[1]}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".")[1]}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".")[1]}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".")[1]}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 1,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        });
    }
  },
  estudiantevisitante: (req, res) => {
    if (!req.files || Object.keys(req.files).length != 2) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".")[1]}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".")[1]}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".")[1]}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".")[1]}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 2,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        });
    }
  },
  publicogeneral: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Hace falta los archivos requeridos");
    }
    req.files.payment_doc.mv(
      path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.png`),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".")[1]}`,
            dir_fileuniversity: null,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: 3,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, 24° Edición" exitosa',
                emailRegistroCIIS(req.user)
              );
              res.status(201).send(data.dataValues);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(http["500"]);
            });
        }
      }
    );
  },
}

CONTROLLER_INSCRIPTION.POST = (req, res) => {
  const { type_attend, type_event } = req.query;
  //type_attend (planes: estudiantesciis,egresado), type_event (ciis o postmaster)
  Reservation.findOne({
    where: { user_id: req.user.id, event_id: req.params.event },
  })
    .then((already) => {
      if (type_event === "ciis") {
        opciones = registers
      } else if (type_event == "postmaster") {
        opciones = registersPostmaster
      } else {
        return res.status(400).send("Tipo de evento no existente");
      }

      if (already) {
        return Promise.reject({
          error: "Error",
          reason: "Usted ya ha sido registrado",
          code: 409,
        });
      } else if (!opciones[type_attend]) return Promise.reject(http["500"]);
      else opciones[type_attend](req, res);
    })
    .catch((fail = null) => {
      console.log(fail);
      fail.code
        ? res.status(fail.code).send(fail)
        : res.status(500).send(http["500"]);
    });
};

CONTROLLER_INSCRIPTION.GET = async (req, res) => {
  try {
    const { event } = req.params;
    let reservations = await getRegistrations(req.query, event);
    await Promise.all(
      reservations.registrations.map(async (reservation) => {
        reservation.typeattendee = await TypeAttendee.findOne({
          where: {
            id_type_attendee: reservation.typeattendee,
          },
        });

        if (reservation.scholar_code)
          reservation.scholar_code = await ScholarCodes.findOne({
            where: {
              code: reservation.scholar_code,
            },
          });

        return Promise.resolve();
      })
    );
    res.send(reservations);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

CONTROLLER_INSCRIPTION.GET_FILENAME = async (req, res) => {
  try {
    const { filename } = req.params;
    res.sendFile(path.join(GetCiisFolder(), filename));
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
};

function GetCiisFolder() {
  return path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "private",
    "inscription",
    "ciis"
  );
}
function GetPostMasterFolder() {
  return path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "private",
    "inscription",
    "postmaster"
  );
}

module.exports = CONTROLLER_INSCRIPTION;
