const userService = require('../../services/user.service');
const Users = require("../../models/Users");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Reservation = require("../../models/Reservation");
const Taller = require("../../classes/Taller");
const http = require("../../utils/http.msg");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken");

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  return data;
}

const CONTROLLER_GOOGLE_OAUTH = {};

CONTROLLER_GOOGLE_OAUTH.GET = async (req, res, next) => {
  const code = req.query.code;

  try {
    const redirect_url = "http://127.0.0.1:4000/api/v2/google/oauth";
    const oAuthClient = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect_url
    );
    const response = await oAuthClient.getToken(code);
    await oAuthClient.setCredentials(response.tokens);
    const user = oAuthClient.credentials;
      
    res.redirect(303, `http://localhost:4321/redirect?access_token=${user.access_token}`);

  } catch (err) {
    console.log(err);
    res.status(404).send("Error with signing in with Google");
  }

};

CONTROLLER_GOOGLE_OAUTH.GET_USER = async (req, res, next) => {
  try {
    const { access_token } = req.query;

    const userData = await getUserData(access_token);

    let userSession = null;

    Users.findOne({
      where: { email_user: userData.email },
    })
      .then(async (data) => {
        if (!data) {
          let newUser = {
            email: userData.email,
            name: userData.given_name,
            lastname: userData.family_name,
            google_id: userData.sub,
            auth_provider: "google",
            code: nanoid(15),
            role: 3
          };
          
          userSession = newUser;

          await userService.createNewUser(newUser);
        }

        if (data && !Boolean(data.google_id)) {
          Users.update(
            { 
              google_id: userData.sub,
              auth_provider: "both"
            },
            { where: { id_user: data.id_user } }
          );
        }

        userSession = (await Users.findOne({ where: { email_user: userData.email } }))?.dataValues;

        return Promise.resolve(userSession);
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

        let user = {
          id: userSession.id_user,
          dni: userSession.dni_user,
          role: userSession.role_id,
          email: userSession.email_user,
          name: userSession.name_user,
          phone: userSession.phone_user,
          lastname: userSession.lastname_user,
          studycenter: userSession.study_center_user,
          career: userSession.university_career_user,
          plan_ciis: userSession.plan_ciis,
          plan_postmaster: userSession.plan_postmaster,
          auth_provider: userSession.auth_provider,
          tiempoExpiracion: now,
          ...inscriptions,
        };

        const token = jwt.sign(user, process.env.JWT_PRIVATE_KEY, {
          expiresIn: "2h",
        });

        res.cookie("token", token, {
          sameSite: "None",
          httpOnly: true,
          maxAge: 2 * 60 * 60 * 1000, // 2 horas en segundos
          path: "/", // Ruta de la cookie
          secure: true,
        });

        res.status(201).send(user);
      })
      .catch((fail) => {
        console.log(fail);
        return fail.code
          ? res.status(fail.code).send(fail)
          : res.status(500).send(http["500"]);
      });
  } catch (fail) {
    return fail.code
      ? res.status(fail.code).send(fail)
      : res.status(500).send(http["500"]);
  }
}

CONTROLLER_GOOGLE_OAUTH.POST = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4321");
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Referrer-Policy","no-referrer-when-downgrade");

  const redirectUrl = "http://127.0.0.1:4000/api/v2/google/oauth";

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile email openid",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

module.exports = CONTROLLER_GOOGLE_OAUTH;
