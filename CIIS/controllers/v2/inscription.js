const path = require("path");
const ScholarCodes = require("../../models/ScholarCodes");
const Reservation = require("../../models/Reservation");
const { sendMail } = require("../../utils/send.mail.utils");
const { emailRegistroCIIS } = require("../../utils/emails/registro");
const { bodyEmailPostmaster } = require("../../utils/emails/postmaster");
const http = require("../../utils/http.msg");
const { getRegistrations } = require("../../services/registration.service");
const TypeAttendee = require("../../models/TypeAttendee");

const CONTROLLER_INSCRIPTION = {};

const registers = {
  publicogeneral: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({reason: "Hace falta los archivos requeridos"});
    }
    req.files.payment_doc.mv(
      path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: null,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-11-10T05:00:00Z") > new Date()) ? 7 : 12,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, XXV Edición" exitosa',
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
  docentesunjbg: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({reason: "Hace falta los archivos requeridos"});
    }
    req.files.payment_doc.mv(
      path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: null,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-11-10T05:00:00Z") > new Date()) ? 9 : 14,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, XXV Edición" exitosa',
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
  delegaciones: (req, res) => {
    if (!req.body.scholar_code)
      return res.status(400).send({reason: "Hace falta el código de delegación"});

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
          return res.status(400).send({reason: "Hace falta los archivos requeridos"});
        }

        if (req.files.payment_doc && req.files.scholar_doc) {
          req.files.payment_doc
            .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`))
            .then(() =>
              req.files.scholar_doc.mv(
                path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`)
              )
            )
            .then(() => {
              Reservation.create({
                num_voucher: null,
                dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`,
                dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`,
                enrollment_status: 0,
                active: false,
                user_id: req.user.id,
                event_id: req.params.event,
                price_type_attendee_id:  (new Date("2024-11-10T05:00:00Z") > new Date()) ? 8 : 13,
                scholar_code: req.body.scholar_code,
                created_at: new Date(),
              })
                .then((data) => {
                  sendMail(
                    req.user.email,
                    'Pre inscripción a "Congreso Internacional de Informática y Sistemas, XXV Edición" exitosa',
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
  estudiantesunjbg: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({reason: "Hace falta los archivos requeridos"});
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-11-10T05:00:00Z") > new Date()) ? 10 : 15,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, XXV Edición" exitosa',
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
  estudiantesesis: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({reason: "Hace falta los archivos requeridos"});
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetCiisFolder(), `${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetCiisFolder(), `${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/ciis/${req.user.dni}-ciis-scholar.${req.files.scholar_doc.name.split(".").pop()}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-11-10T05:00:00Z") > new Date()) ? 11 : 16,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Congreso Internacional de Informática y Sistemas, XXV Edición" exitosa',
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
      return res.status(400).json({reason: "Hace falta los archivos requeridos"});
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".").pop()}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".").pop()}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-09-13T05:00:00Z") > new Date()) ? 1 : 4,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Postmaster XXI Edición" exitosa',
                bodyEmailPostmaster
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
      return res.status(400).json({reason: "Hace falta los archivos requeridos"});
    }

    if (req.files.payment_doc && req.files.scholar_doc) {
      req.files.payment_doc
        .mv(path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`))
        .then(() =>
          req.files.scholar_doc.mv(
            path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".").pop()}`)
          )
        )
        .then(() => {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-scholar.${req.files.scholar_doc.name.split(".").pop()}`,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-09-13T05:00:00Z") > new Date()) ? 2 : 5,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Postmaster XXI Edición" exitosa',
                bodyEmailPostmaster
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
      return res.status(400).json({reason: "Hace falta los archivos requeridos"});
    }
    req.files.payment_doc.mv(
      path.join(GetPostMasterFolder(), `${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        } else {
          Reservation.create({
            num_voucher: null,
            dir_voucher: `/event/${req.params.event}/reservation/postmaster/${req.user.dni}-postmaster-payment.${req.files.payment_doc.name.split(".").pop()}`,
            dir_fileuniversity: null,
            enrollment_status: 0,
            active: false,
            user_id: req.user.id,
            event_id: req.params.event,
            price_type_attendee_id: (new Date("2024-09-13T05:00:00Z") > new Date()) ? 3 : 6,
            scholar_code: null,
            created_at: new Date(),
          })
            .then((data) => {
              sendMail(
                req.user.email,
                'Pre inscripción a "Postmaster XXI Edición" exitosa',
                bodyEmailPostmaster
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

  if (!Boolean(req.user.dni)) {
    return res.status(404).send({
      error: "DNI no proporcionado",
      code: "404",
      reason: "Debe proporcionar su numero de DNI en la opción Cuenta para continuar con el proceso de inscripción"
    });
  }

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
        return res.status(400).send({reason: "Tipo de evento no existente"});
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
  const { type_event } = req.query;
  try {
    const { filename } = req.params;
    
    if (type_event === "ciis") {
      res.sendFile(path.join(GetCiisFolder(), filename));
    } else if (type_event === "postmaster") {
      res.sendFile(path.join(GetPostMasterFolder(), filename));
    }
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
