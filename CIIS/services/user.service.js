const Reservation = require("../models/Reservation");
const { Op } = require("sequelize");
const Roles = require("../models/Roles");
const User = require("../models/Users");
const { sendMail } = require("../utils/send.mail.utils");
const { email_registro } = require("../utils/emails/registro");
const { encrypt } = require("../utils/password.utils"); 
const searchUserByReservation = async (id_reservation) => {
  const reservation = await Reservation.findOne({
    where: {
      id_reservation: id_reservation,
    },
    include: User
  });

  if (!reservation || !reservation.user) {
    throw new Error("No se ha encontrado la reservación");
  }

  return (reservation.user).toJSON();
};


const createRegisterUser = async (userObject, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.create(userObject, { transaction });
      resolve(user);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        // Manejar el error de campo único
        reject({ code: 409, message: "El dni o email ya fue utilizado, ¡ingrese uno nuevo!" });
        return;

        // const userFound=await getInfoRoleUserByDni(userObject.dni_user);

        // if(userFound.role.id_role==3){
        //   reject({code:409,message:"El dni o email ya fue utilizado, ¡ingrese uno nuevo!"});
        //   return;
        // }

        // resolve(userFound);
      } else {
        reject(error);
      }
    }
  })
};

const getUserInfoByCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    const userFound = await User.findOne({
      attributes: ['id_user', 'name_user', 'lastname_user', 'email_user'],
      where: {
        code_user: code
      }
    });

    if (!userFound) {
      reject({ code: 404, message: "El usuario no existe" });
      return;
    }
    resolve(userFound.toJSON());
  });
}

const getInfoRoleUserByCode = async (code = '') => {

  return new Promise(async (resolve, reject) => {
    const roleFound = await User.findOne({
      attributes: ['id_user'],
      where: {
        code_user: code
      },
      include: [{
        model: Roles,
        attributes: ['name_role']
      }]
    });
    if (!roleFound) {
      reject({ code: 404, message: "El usuario no existe" });
      return;
    }

    resolve(roleFound.toJSON());
  })

}

const getEmailByUserId = async (id) => {
  return new Promise(async (resolve, reject) => {
    const userFound = await User.findOne({
      attributes: ['email_user'],
      where: {
        id_user: id
      }
    });
    if (!userFound) {
      reject({ code: 404, message: "No se ha encontrado al usuario" });
      return;
    }
    resolve(userFound.toJSON());
  })
}

const getUserInfoByDNI = (dni) => {
  return new Promise(async (resolve, reject) => {
    const userFound = await User.findOne({
      attributes: ['id_user', 'name_user', 'lastname_user', 'email_user'],
      where: {
        dni_user: dni
      }
    });

    if (!userFound) {
      reject({ code: 404, message: "El usuario no existe" });
      return;
    }
    resolve(userFound.toJSON());
  });
}

const updateUser = async (id, userObject, transaction) => new Promise(async (resolve, reject) => {
  try {
    const userFound = await User.findOne({
      where: {
        id_user: id
      }
    });

    if (!userFound) {
      reject({ code: 404, message: "No se ha encontrado el usuario" });
      return;
    }

    await userFound.update(userObject, { transaction });
    resolve(userFound.toJSON());
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      reject({ code: 409, message: "El email o dni ya fue utilizado" });
      return
    }
    reject(error);
  }
});

const getUserByDniOrCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    const userFound = await User.findOne({
      attributes: ['id_user', 'name_user', 'lastname_user', 'email_user'],
      where: {
        [Op.or]: [
          { dni_user: code },
          { code_user: code }
        ]
      }
    });

    if (!userFound) {
      reject({ code: 404, message: "El usuario no existe" });
      return;
    }
    resolve(userFound.toJSON());
  })
}

const getInfoRoleUserByDni = async (dni = '') => {

  return new Promise(async (resolve, reject) => {
    const userRoleFound = await User.findOne({
      attributes: ['id_user'],
      where: {
        dni_user: dni
      },
      include: [{
        model: Roles,
        attributes: ['id_role', 'name_role']
      }]
    });

    console.log(userRoleFound.toJSON());
    if (!userRoleFound) {
      reject({ code: 404, message: "El usuario no existe" });
      return;
    }

    resolve(userRoleFound.toJSON());
  })

}

const getUserByEmail = (email) => new Promise(async (resolve, reject) => {
  try {
    const user = await User.findOne({
      where: {
        email_user: email
      }
    });

    if (!user) {
      resolve(null);
      return;
    }

    resolve(user.toJSON());
    return;
  } catch (error) {
    reject(error);
  }
})

/*
2024
*/

const getUsers = async () => {
  return new Promise(async (resolve, reject) => {
    const users = await User.findAll(
      {
        attributes: ['id_user', 'name_user', 'lastname_user', 'dni_user', 'email_user', 'phone_user'],
        include: [
          {
            model: Roles,
            attributes: ['name_role']
          }
        ]
      }
    )

    if (!users) {
      reject({ code: 404, message: "Lista de usuarios vacia" });
      return;
    } else {
      const formattedUsers = users.map(user => {
        return {
          id: user.id_user,
          name: user.name_user,
          lastname: user.lastname_user,
          dni: user.dni_user,
          email: user.email_user,
          phone: user.phone_user,
          role: {
            name: user.role.name_role  // Añadir el nombre del rol aquí
          }
        };
      })
      resolve(formattedUsers);
    }

  });
}

const getOneUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({
      where: {
        id_user: id
      },
      attributes: ['name_user', 'lastname_user', 'dni_user', 'phone_user', 'email_user', 'phone_user'],
      include: [
        {
          model: Roles,
          attributes: ['id_role', 'name_role']
        }
      ]
    });


    if (!user) {
      reject({
        code: 404,
        message: "El usuario no existe"
      });
      return;
    } else {
      const formattedUser = {
        name: user.name_user,
        lastname: user.lastname_user,
        dni: user.dni_user,
        phone: user.phone_user,
        email: user.email_user,
        role: {
          id: user.role.id_role,
          name: user.role.name_role

        }
      }
      resolve(formattedUser);
    }
  })
};

const deleteUserById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        where: {
          id_user: id
        },
      });

      if (!user) {
        reject({
          code: 404,
          message: "El usuario no existe"
        });
        return;
      }

      await user.destroy();
      resolve({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      reject({
        code: 500,
        message: "Error al eliminar el usuario"
      });
    }
  });
};

const createNewUser = async (userData) => {
  return new Promise(async (resolve, reject) => {
    try {

      const newUser = await User.create({
        email_user: userData.email,
        name_user: userData.name,
        lastname_user: userData.lastname,
        dni_user: userData.dni,
        role_id: userData.role, // asistente
        password_user: await encrypt(userData.password),
        phone_user: userData.phone,
      });

      await sendMail(userData.email, "Registro exitoso", email_registro);

      resolve({ message: 'Usuario creado correctamente' });
    } catch (error) {
      reject({
        code: 500,
        message: "Error al crear el usuario"
      });
    }
  });
};
module.exports = {
  searchUserByReservation,
  createRegisterUser,
  getUserInfoByCode,
  getInfoRoleUserByCode,
  getEmailByUserId,
  getUserInfoByDNI,
  updateUser,
  getUserByDniOrCode,
  getInfoRoleUserByDni,
  getUserByEmail,
  getUsers,
  getOneUser,
  deleteUserById,
  createNewUser
};
