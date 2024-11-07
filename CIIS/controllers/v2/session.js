const Users = require("../../models/Users");
const http = require("../../utils/http.msg");
const { compare } = require("../../utils/password.utils");
const jwt = require("jsonwebtoken");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Reservation = require("../../models/Reservation");
const Taller = require("../../classes/Taller");

const CONTROLLER_SESSION = {};

CONTROLLER_SESSION.POST = (req, res) => {
  const { email, password } = req.body;
  let user = null;

  Users.findOne({ where: { email_user: email } })
    .then(async (data) => {
      console.log(data.dataValues);

      if (!data)
        return Promise.reject({
          error: "Usuario no registrado",
          reason: "Intente registrarse primero",
          code: 404,
        });

      const { password_user } = data.dataValues;
      const auth = await compare(password, password_user);
      if (auth) {
        user = data.dataValues;
        return Promise.resolve(data.dataValues);
      } else
        return Promise.reject({
          error: "Credenciales incorrectas",
          reason: "Revise su email o contraseña",
          code: 401,
        });
    })
    .then(async (user) => {
      let prestatusCiis = user.plan_ciis && user.plan_ciis.length > 0 ? 3 : 4;
      let prestatusPostmaster = user.plan_postmaster && user.plan_postmaster.length > 0 ? 3 : 4;
      let inscripciones = {};
      inscripciones.talleres = [];

      let talleres = await TallerInscriptionSQL.findAll({
        where: {
          relatedUser: user.id_user,
        },
      });
      inscripciones.talleres = await Promise.all(
        talleres.map(async (tll) => {
          let taller = new Taller();
          await taller.load(tll.relatedTaller);
          taller.state = tll.state;

          return Promise.resolve({
            id: taller.id,
            state: taller.state
          });
        })
      );

      let statusPostmaster = (
        await Reservation.findOne({
          where: { user_id: user.id_user, event_id: 14 },
        })
      )?.dataValues;

      let statusCiis = (
        await Reservation.findOne({
          where: { user_id: user.id_user, event_id: 15 },
        })
      )?.dataValues;

      inscripciones.dataPostmaster = statusPostmaster ? statusPostmaster.enrollment_status : prestatusPostmaster;
      inscripciones.dataCiis = statusCiis ? statusCiis.enrollment_status : prestatusCiis;

      return inscripciones;
    })
    .then((inscriptions) => {
      let now = new Date();
      now.setHours(now.getHours() + 2);

      let userSession = {
        id: user.id_user,
        nationality: user.nationality_user,
        dni: user.dni_user,
        role: user.role_id,
        email: user.email_user,
        name: user.name_user,
        phone: user.phone_user,
        lastname: user.lastname_user,
        studycenter: user.study_center_user,
        career: user.university_career_user,
        plan_ciis: user.plan_ciis,
        plan_postmaster: user.plan_postmaster,
        auth_provider: user.auth_provider,
        tiempoExpiracion: now,
        ...inscriptions,
      };

      const token = jwt.sign(userSession, process.env.JWT_PRIVATE_KEY, {
        expiresIn: "2h",
      });

      res.cookie("token", token, {
        sameSite: "None",
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000, // 2 horas en segundos
        path: "/", // Ruta de la cookie
        secure: true,
      });

      res.status(201).send(userSession);
    })
    .catch((fail) => {
      console.log(fail);
      return fail.code
        ? res.status(fail.code).send(fail)
        : res.status(500).send(http["500"]);
    });
};

CONTROLLER_SESSION.DELETE = (req, res) => {
  //res.status(200).send("session eliminada");
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/");
};

module.exports = CONTROLLER_SESSION;
