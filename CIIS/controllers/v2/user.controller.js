const userService = require('../../services/user.service')
const sequelize = require("../../config/database");
const userDTO = require('../../DTO/user.dto');
const { encrypt } = require("../../utils/password.utils");

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
        const { name, lastname, phone, dni, email, password, role } = await req.body;
        const { id } = await req.params
        const user = new userDTO(name, lastname, email, dni, phone, "", "")
        if (role) {
            user.role = role.id
        }
        if (password) {
            user.password = await encrypt(password);
        }
        //console.log(user)
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


module.exports = {
    updateUser,
    getUsers,
    getOneUser,
    deleteUser
}