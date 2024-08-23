const { Type } = require("@sinclair/typebox");
const Ajv = require("ajv");
const addErrors = require("ajv-errors");
const addFormats = require("ajv-formats");
const { handleErrorResponse } = require("../middlewares/handleError");

const userUpdateDTOSchema = Type.Object({
    name: Type.Optional(Type.String({
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
        minLength: 1,
        errorMessage: "El nombre no es válido",
    })),
    lastname: Type.Optional(Type.String({
        pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
        minLength: 1,
        errorMessage: "El apellido no es válido",
    })),
    email: Type.Optional(Type.String({
        format: "email",
        errorMessage: {
            type: "Debe ser un string",
            format: "El email no es válido",
        },
    })),
    password: Type.Optional(Type.String({
        pattern: "^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,16}$",
        errorMessage: {
            type: "Debe ser un string",
            pattern: "La contraseña debe tener de 6 a 16 caracteres alfanuméricos",
        },
    })),
    phone: Type.Optional(Type.String({
        minLength: 1,
        errorMessage: "El teléfono no es válido",
    })),
    dni: Type.Optional(Type.String({
        minLength: 8,
        maxLength: 20,
        errorMessage: "El DNI no es válido",
    })),
    career: Type.Optional(Type.String()),
    studycenter: Type.Optional(Type.String()),
},
    {
        //additionalProperties: false,
        additionalProperties: true,
        errorMessage: {
            additionalProperties: "El formato no es válido",
        },
    });

const ajv = new Ajv({ allErrors: true, messages: true });
addFormats(ajv, ["email"]);
addErrors(ajv, { keepErrors: false });
const validate = ajv.compile(userUpdateDTOSchema);

/* const userUpdateDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    
    if (!isDTOValid) {
        const errors = validate.errors.map((error) => error.message);
        handleErrorResponse(res, errors, 400);
        return;
    } else if ((Object.keys(req.body).length == 0) && (req.files == undefined)) {
        handleErrorResponse(res, "Se debe enviar al menos un dato", 400);
        return;
    }
    next();
}; */

const userUpdateDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);
    const { password } = req.body
    if (password && password.length > 0) {
        if (!isDTOValid) {
            const errors = validate.errors.map((error) => error.message);
            handleErrorResponse(res, errors, 400);
            return;
        } else if ((Object.keys(req.body).length == 0) && (req.files == undefined)) {
            handleErrorResponse(res, "Se debe enviar al menos un dato", 400);
            return;
        }
    }
    next();
};

module.exports = userUpdateDTO;