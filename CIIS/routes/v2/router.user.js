const { Router } = require("express");
const Users = require("../../models/Users");
const http = require("../../utils/http.msg");
const { encrypt } = require("../../utils/password.utils");
const { sendMail } = require("../../utils/send.mail.utils");
const { authMid, isAdmin } = require("../../middlewares/v2/auth");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Taller = require("../../classes/Taller");
const Reservation = require("../../models/Reservation");
const {
  mail2sendUserCode,
  mail2sendUserPass,
} = require("../../utils/emails/restorePwd");
const { uuid } = require("uuidv4");
const routerUser = Router();
const jwt = require("jsonwebtoken");
const { secret_key } = require("../../config/development");

// 2024
const userUpdateDTO = require("../../DTO/user.update.event.dto");
const {
  userRegisterDTO,
  userPasswordDTO,
} = require("../../DTO/user.register.dto");
const {
  getUsers,
  updateUser,
  getOneUser,
  deleteUser,
  registerUser,
  createUser,
} = require("../../controllers/v2/user.controller");
const { userCreateDTO } = require("../../DTO/user.create.dto");

routerUser.route("/users").get(authMid, isAdmin, getUsers);
routerUser.route("/users/:id").put(authMid, isAdmin, userUpdateDTO, updateUser);
routerUser.route("/users/:id").get(authMid, isAdmin, getOneUser);
routerUser.route("/users/:id").delete(authMid, isAdmin, deleteUser);
routerUser.route("/users").post(authMid, isAdmin, userCreateDTO, createUser);
// 2024

routerUser.route("/user").post(userRegisterDTO, registerUser);

routerUser.route("/user/inscription").get(authMid, async (req, res) => {
  const { type_event, event } = req.query;
  let prestatus = null;
  let inscripciones = {
    status: null,
  };

  try {
    let user = await Users.findOne({ where: { id_user: req.user.id } });

    if (type_event === "ciis") {
      inscripciones.talleres = [];

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

      prestatus = user.plan_ciis.length > 0 ? 3 : 4;
    } else {
      prestatus = user.plan_postmaster.length > 0 ? 3 : 4;
    }

    let status = (
      await Reservation.findOne({
        where: { user_id: req.user.id, event_id: event },
      })
    )?.dataValues;
    inscripciones.status = status ? status.enrollment_status : prestatus;
    res.send(inscripciones);
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/dni").patch(authMid, async (req, res) => {
  try {
    const { dni } = req.body;
    await Users.update({ dni_user: dni }, { where: { id_user: req.user.id } });
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "DNI ya registrado",
        code: "409",
        reason: "El DNI proporcionado ya se encuentra registrado"
    });
    }

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
routerUser.route("/user/inscription").patch(authMid, async (req, res) => {
  try {
    if (req.body.plan_postmaster) {
      Users.update(
        { plan_postmaster: req.body.plan_postmaster },
        { where: { id_user: req.user.id } }
      );
    }

    if (req.body.plan_ciis) {
      Users.update(
        { plan_ciis: req.body.plan_ciis },
        { where: { id_user: req.user.id } }
      );
    }

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
      attributes: ["id_user", "name_user", "lastname_user", "code_user"],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Cuenta no registrada",
        reason: "Este correo no se encuentra registrado",
        code: 404,
      });

    let token = jwt.sign(user.dataValues, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "10m",
    });

    await Users.update(
      { token_user: token },
      {
        where: { id_user: user.id_user },
      }
    );

    sendMail(
      email,
      "CIIS SOPORTE - Restauración de contraseña",
      mail2sendUserCode({
        name: user.name_user,
        lastname: user.lastname_user,
        code: user.code_user,
        token: token,
      })
    );

    res.send({ msg: "Enlace enviado a correo electrónico" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/verify").post(async (req, res) => {
  try {
    const { code, token } = req.body;

    let user = await Users.findOne({
      where: { code_user: code, token_user: token },
      attributes: [
        "name_user",
        "lastname_user",
        "code_user",
        "email_user",
        "token_user",
      ],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Código y/o token de usuario no válido",
        reason:
          "Este código y/o token de usuario no es válido. Vuelva a solicitar restauración de contraseña",
        code: 404,
      });

    jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    res.send(user);
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(404).send({
        error: "Token expirado.",
        reason: "Token de usuario ha expirado. Vuelva a solicitar restauración de contraseña",
        code: 404,
      });
    } else if (err?.name === "JsonWebTokenError") {
      return res.status(404).send({
        error: "Token no válido",
        reason: "Token de usuario no es válido. Vuelva a solicitar restauración de contraseña",
        code: 404,
      });
    }
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/restore").post(userPasswordDTO, async (req, res) => {
  try {
    const { email, code, password } = req.body;

    let user = await Users.findOne({
      where: { email_user: email, code_user: code },
      attributes: [
        "id_user",
        "name_user",
        "lastname_user",
        "code_user",
        "token_user",
      ],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Algo ocurrió",
        reason:
          "No fue posible restaurar la contraseña, revisa los datos especificados",
        code: 404,
      });

    jwt.verify(user.token_user, process.env.JWT_PRIVATE_KEY);

    let newUserCode = uuid();

    await Users.update(
      { code_user: newUserCode, token_user: "", password_user: await encrypt(password) },
      {
        where: { id_user: user.id_user },
      }
    );

    sendMail(
      email,
      "CIIS SOPORTE - Restauración de contraseña completado",
      mail2sendUserPass({
        name: user.name_user,
        lastname: user.lastname_user,
      })
    );

    res.send({ msg: "Todo ok" });
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(404).send({
        error: "Token expirado.",
        reason: "Token de usuario ha expirado. Vuelva a solicitar restauración de contraseña",
        code: 404,
      });
    } else if (err?.name === "JsonWebTokenError") {
      return res.status(404).send({
        error: "Token no válido",
        reason: "Token de usuario no es válido. Vuelva a solicitar restauración de contraseña",
        code: 404,
      });
    }
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/studycenter").patch(authMid, async (req, res) => {
  try {
    const { studycenter } = req.body;
    Users.update(
      { study_center_user: studycenter },
      { where: { id_user: req.user.id } }
    );
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

routerUser.route("/user/career").patch(authMid, async (req, res) => {
  try {
    const { career } = req.body;
    Users.update(
      { university_career_user: career },
      { where: { id_user: req.user.id } }
    );
    res.status(201).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send(http["500"]);
  }
});

module.exports = routerUser;
