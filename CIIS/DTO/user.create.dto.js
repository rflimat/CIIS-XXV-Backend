const { Type } = require("@sinclair/typebox");
const Ajv = require("ajv");
const addErrors = require("ajv-errors");
const addFormats = require("ajv-formats");
const { handleErrorResponse } = require("../middlewares/handleError");

// definir schema
const UserCreateDtoSchema = Type.Object(
    {
        name: Type.String({
            pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
            minLength: 1,
            errorMessage: "Debe ser un nombre válido",
        }),
        lastname: Type.String({
            pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
            minLength: 1,
            errorMessage: "Debe ser un apellido válido",
        }),
        phone: Type.String({
            minLength: 1,
            errorMessage: "Debe ser un teléfono válido",
        }),
        email: Type.String({
            format: "email",
            errorMessage: {
                type: "Debe ser un string",
                format: "Debe ser un email válido",
            },
        }),
        password: Type.String({
            pattern: "^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$",
            errorMessage: {
                type: "Debe ser un string",
                pattern: "La contraseña debe tener de 8 a 16 caracteres alfanuméricos",
            },
        }),
        role: Type.String({
            pattern: "^(1|2|3)$",
            errorMessage: {
                type: "Debe ser un string",
                pattern: "Debe ser un rol existente",
            },
        }),
        dni: Type.String({
            minLength: 8,
            maxLength: 20,
            errorMessage: "Debe ser un dni válido",
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato no es válido",
        },
    }
);


const ajv = new Ajv({ allErrors: true, messages: true })
    .addKeyword("kind")
    .addKeyword("modifier")
    .addKeyword("ignore", {
        validate: () => true,
        errors: false,
    });
addFormats(ajv, ["email"]);
addErrors(ajv);

const validateUserSchema = ajv.compile(UserCreateDtoSchema);


const userCreateDTO = (req, res, next) => {
    const isDTOValid = validateUserSchema(req.body);
    //console.log(isDTOValid)
    if (!isDTOValid) {
        const errors = validateUserSchema.errors.map((error) => error.message);
        handleErrorResponse(res, errors, 400);
        return;
    }

    next();
};

module.exports = {
    userCreateDTO
};
