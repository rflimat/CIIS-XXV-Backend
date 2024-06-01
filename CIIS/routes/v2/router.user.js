const { Router } = require("express");
const Users = require("../../models/Users");
const http = require("../../utils/http.msg");
const { encrypt } = require("../../utils/password.utils");
const { sendMailAtDomain } = require("../../utils/send.mail.utils");
const { email_registro } = require("../../utils/emails/registro");
const { authMid, isAdmin, isAtLeastOrganizer } = require("../../middlewares/v2/auth");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Taller = require("../../classes/Taller");
const CONTROLLER_SESSION = require("../../controllers/v2/session");
const Reservation = require("../../models/Reservation");
const {
  mail2sendUserCode,
  mail2sendUserPass,
} = require("../../utils/emails/restorePwd");
const { uuid } = require("uuidv4");
const routerUser = Router();

// 2024
const userUpdateDTO = require('../../DTO/user.update.event.dto')
const { userRegisterDTO } = require('../../DTO/user.register.dto')
const { getUsers, updateUser, getOneUser, deleteUser } = require('../../controllers/v2/user.controller')
routerUser.route("/users").get(authMid, isAtLeastOrganizer, getUsers)
routerUser.route("/users/:id").put(authMid, isAtLeastOrganizer, userUpdateDTO, updateUser)
routerUser.route("/users/:id").get(authMid, isAtLeastOrganizer, getOneUser)
routerUser.route("/users/:id").delete(authMid, isAdmin, deleteUser)
// 2024

routerUser.route("/user").post(userRegisterDTO, (req, res) => {
  const { dni, email, password, name, lastname, phone } = req.body;

  Users.findAll({ where: { dni_user: dni } })
    .then((data) => {
      if (Array.isArray(data)) {
        if (data.length > 0) return Promise.reject(http["409"]);
        else return Promise.resolve();
      } else return Promise.reject(http["500"]);
    })
    .then(() => Users.findAll({ where: { email_user: email } }))
    .then((data) => {
      if (Array.isArray(data)) {
        if (data.length > 0) return Promise.reject(http["409"]);
        else return Promise.resolve();
      } else return Promise.reject(http["500"]);
    })
    .then(async () =>
      Users.create({
        email_user: email,
        name_user: name,
        lastname_user: lastname,
        dni_user: dni,
        role_id: 2,
        password_user: await encrypt(password),
        phone_user: phone,
      })
    )
    .then(async (newUser) => {
      sendMailAtDomain(email, "Registro exitoso", email_registro);
      CONTROLLER_SESSION.POST(req, res);
    })
    .catch((fail = null) => {
      fail.code
        ? res.status(fail.code).send(fail)
        : res.status(500).send(http["500"]);
    });
});

routerUser.route("/user/inscription").get(authMid, async (req, res) => {
  const { event } = req.query;
  try {
    let inscripciones = {
      talleres: [],
      ciis: null,
    };

    let talleres = await TallerInscriptionSQL.findAll({
      where: {
        relatedUser: req.user.id,
      },
    });

    inscripciones.talleres = await Promise.all(
      talleres.map(async (tll) => {
        let taller = new Taller();
        await taller.load(tll.relatedTaller);
        taller.state = tll.state;

        return Promise.resolve(taller);
      })
    );

    let ciis = (
      await Reservation.findOne({
        where: { user_id: req.user.id, event_id: event },
      })
    )?.dataValues;
    inscripciones.ciis = ciis ? ciis.enrollment_status : 3;
    res.send(inscripciones);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/phone").patch(authMid, async (req, res) => {
  try {
    const { phone } = req.body;
    Users.update({ phone_user: phone }, { where: { id_user: req.user.id } });
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/name").patch(authMid, async (req, res) => {
  try {
    const { name } = req.body;
    Users.update({ name_user: name }, { where: { id_user: req.user.id } });
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/lastname").patch(authMid, async (req, res) => {
  try {
    const { lastname } = req.body;
    Users.update(
      { lastname_user: lastname },
      { where: { id_user: req.user.id } }
    );
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});
routerUser.route("/user/password").patch(authMid, async (req, res) => {
  try {
    const { password } = req.body;
    Users.update(
      { password_user: await encrypt(password) },
      { where: { id_user: req.user.id } }
    );
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/code").post(async (req, res) => {
  try {
    const { email } = req.body;

    let user = await Users.findOne({
      where: { email_user: email },
      attributes: ["name_user", "lastname_user", "code_user"],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Cuenta no registrada",
        reason: "Este correo no se encuentra registrado",
        code: 404,
      });

    sendMailAtDomain(
      email,
      "CIIS SOPORTE - Código único de usuario",
      mail2sendUserCode({
        name: user.name_user,
        lastname: user.lastname_user,
        code: user.code_user,
      })
    );

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/restore").post(async (req, res) => {
  try {
    const { email, code, dni } = req.body;

    let user = await Users.findOne({
      where: { email_user: email, code_user: code, dni_user: dni },
      attributes: ["id_user", "name_user", "lastname_user", "code_user"],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Algo ocurrió",
        reason:
          "No fue posible restaurar la contraseña, revisa los datos especificados",
        code: 404,
      });

    let newUserCode = uuid();
    let pivote = Math.floor(Math.random() * 41);
    let pass = (await encrypt(newUserCode)).substring(pivote, pivote + 10);

    await Users.update(
      { code_user: newUserCode, password_user: await encrypt(pass) },
      {
        where: { id_user: user.id_user },
      }
    );

    sendMailAtDomain(
      email,
      "CIIS SOPORTE - Restauración de contraseña",
      mail2sendUserPass({
        name: user.name_user,
        lastname: user.lastname_user,
        code: newUserCode,
        pass,
      })
    );

    res.send({ msg: "todo ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});


module.exports = routerUser;
