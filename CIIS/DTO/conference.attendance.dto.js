const Ajv = require("ajv");
const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");
const { handleErrorResponse } = require("../middlewares/handleError");

const conferenceAttendanceDTOSchema = Type.Object(
  {
    user: Type.String({
      minLength: 8,
      maxLength: 20,
      errorMessage: "El código no es válido",
    }),
    idEvent: Type.String({
      pattern: "^[0-9]+$",
      errorMessage: "El código del evento no es válido",
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  }
);

// Inicializar el validador Ajv
const ajv = new Ajv({ allErrors: true, messages: true });
addErrors(ajv);
const validateSchema = ajv.compile(conferenceAttendanceDTOSchema);

const conferenceAttendanceDTO = (req, res, next) => {

  const isDTOValid = validateSchema({ ...req.params, ...req.query });

  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = conferenceAttendanceDTO;
