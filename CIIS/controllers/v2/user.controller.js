const userService = require('../../services/user.service')
const sequelize = require("../../config/database");
const userDTO = require('../../DTO/user.dto');
const { encrypt } = require("../../utils/password.utils");
const CONTROLLER_SESSION = require("../../controllers/v2/session");
const Users = require("../../models/Users");
const { Op } = require("sequelize");
const { nanoid } = require('nanoid');

const registerUser = async (req, res) => {
    const { dni, email, password, confPassword } = req.body;
    try {
        data = await Users.findAll({ where: { dni_user: dni } });
        if (Array.isArray(data) && data.length > 0) {
            return res.status(409).send({
                error: "Usuario existente",
                code: "409",
                reason: "El DNI proporcionado ya se encuentra registrado"
            });
        }
        data = await Users.findAll({ where: { email_user: email } });
        if (Array.isArray(data) && data.length > 0) {
            return res.status(409).send({
                error: "Email registrado",
                code: "409",
                reason: "La dirección de correo electrónico proporcionado ya esta registrado"
            });
        }
        if (password != confPassword) {
            return res.status(409).send({
                error: "Error en contraseñas",
                code: "409",
                reason: "Las contraseña no coincide con la contraseña de confirmacion"
            });
        }
        req.body.code = nanoid(15);
        req.body.role = 3
        newUser = await userService.createNewUser(req.body)
        CONTROLLER_SESSION.POST(req, res);
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor", code: "500" });
    }
};

const { handleHttpError, handleErrorResponse } = require("../../middlewares/handleError");
const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers(req, res)
        res.json(users);
    } catch (error) {
        handleHttpError(res, error);
    }
};

const updateUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, lastname, phone, dni, email, password, role, career, studycenter } = await req.body;
        const { id } = await req.params
        const user = new userDTO(name, lastname, email, dni, phone, career, studycenter)
        if (role) {
            user.role = role;
        }
        if (password) {
            user.password = await encrypt(password);
        }
        await userService.updateUser(id, user, transaction)
        res.sendStatus(200);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if (error.code) {
            return handleErrorResponse(res, error.message, error.code);
        }
        handleHttpError(res, error);
    }
};

/*
Nombres, Apellidos, Rol, DNI, CELULAR, CORREO,CONTRASEÑA (CASO ESTE VACIO NO SE REEMPLAZA)
*/
const getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userService.getOneUser(id)
        res.json(user)
    } catch (error) {
        handleHttpError(res, error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserById(id);
        res.json(result);
    } catch (error) {
        handleHttpError(res, error);
    }
};

const createUser = async (req, res) => {
    const user = req.body
    try {
        result = await Users.findAll({
            where: {
                [Op.or]: [
                    {
                        email_user: user.email
                    },
                    {
                        dni_user: user.dni
                    }
                ]
            }
        })
        if (result.length > 0) {
            return handleErrorResponse(res, "Usuario existente", 409);
        }
        result = await userService.createNewUser(user)
        res.json(result);
    } catch (error) {
        handleHttpError(res, error);
    }
}

module.exports = {
    updateUser,
    getUsers,
    getOneUser,
    deleteUser,
    registerUser,
    createUser
}