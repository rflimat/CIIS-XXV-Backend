const { Router } = require("express");
const Users = require("../../models/Users");
const http = require("../../utils/http.msg");
const { encrypt } = require("../../utils/password.utils");
const { sendMail } = require("../../utils/send.mail.utils");
const { authMid, isAdmin, isAtLeastOrganizer } = require("../../middlewares/v2/auth");
const TallerInscriptionSQL = require("../../models/Taller/TallerInscription");
const Taller = require("../../classes/Taller");
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
const { getUsers, updateUser, getOneUser, deleteUser, registerUser, createUser } = require('../../controllers/v2/user.controller');
const { userCreateDTO } = require("../../DTO/user.create.dto");


routerUser.route("/users").get(authMid, isAtLeastOrganizer, getUsers)
routerUser.route("/users/:id").put(authMid, isAtLeastOrganizer, userUpdateDTO, updateUser)
routerUser.route("/users/:id").get(authMid, isAtLeastOrganizer, getOneUser)
routerUser.route("/users/:id").delete(authMid, isAdmin, deleteUser)
routerUser.route("/users").post(authMid, isAdmin, userCreateDTO, createUser)
// 2024




routerUser.route("/user").post(userRegisterDTO, registerUser);

routerUser.route("/user/inscription").get(authMid, async (req, res) => {
  const { type_event, event } = req.query;
  let prestatus = null;
  let inscripciones = {
    status: null
  }

  try {
    let user = await Users.findOne({where: { id_user: req.user.id}})

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
        { plan_postmaster: req.body.plan_postmaster },
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
      attributes: ["name_user", "lastname_user", "code_user"],
    });

    if (!user?.dataValues)
      return res.status(404).send({
        error: "Cuenta no registrada",
        reason: "Este correo no se encuentra registrado",
        code: 404,
      });

    sendMail(
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

    sendMail(
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
