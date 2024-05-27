const { Type } = require("@sinclair/typebox");
const Ajv = require("ajv");
const addErrors = require("ajv-errors");
const addFormats = require("ajv-formats");
const { handleErrorResponse } = require("../middlewares/handleError");

// definir schema
const LoginDTOSchema = Type.Object(
  {
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
        pattern: "Debe ser un password válido",
      },
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  }
);

const ajv = new Ajv({ allErrors: true, messages: true });

addFormats(ajv, ["email"]);
addErrors(ajv, { keepErrors: false });
const validate = ajv.compile(LoginDTOSchema);

const userLoginDTO = (req, res, next) => {
  const isDTOValid = validate(req.body);

  if (!isDTOValid) {
    const errors = validate.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = userLoginDTO;