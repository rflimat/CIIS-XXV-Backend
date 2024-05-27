const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");
const addFormats = require("ajv-formats");

const { handleErrorResponse } = require("../middlewares/handleError");
const Ajv = require("ajv");

const UserRegisterEventDto = Type.Object(
  {
    name: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "Debe especificar su nombre",
    }),
    firstLastname: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "Debe especificar su primer apellido",
    }),
    secondLastname: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "Debe especificar su segundo apellido",
    }),
    email: Type.String({
      format: "email",
      errorMessage: {
        type: "El campo email debe ser una cadena",
        format: "El email no es válido",
      },
    }),
    dni: Type.String({
      minLength: 8,
      maxLength: 20,
      errorMessage: "El DNI no es válido",
    }),
    phone: Type.String({
      minLength: 1,
      errorMessage: "Debe especificar un número de contacto",
    }),
    career: Type.String(),
    studycenter: Type.String(),
    typeattendee: Type.String({ pattern: "^[0-9]+$" }),
    numvoucher: Type.String({
      minLength: 1,
      errorMessage: "Debe especificar un número de operación",
    }),
    "g-recaptcha-response": {
      ignore: true,
    },
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

const validateSchema = ajv.compile(UserRegisterEventDto);

const userRegisterDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body);

  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = userRegisterDTO;
