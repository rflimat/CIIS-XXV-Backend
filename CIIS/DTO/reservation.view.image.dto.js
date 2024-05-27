const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");

const { handleErrorResponse } = require("../middlewares/handleError");
const Ajv = require("ajv");

const ReservationViewImageDto = Type.Object(
  {
    idReserve: Type.String({
      pattern: "^[0-9]+$",
      errorMessage: "Debe especificar un id correcto",
    }),
    folder: Type.Union([Type.Literal("voucher"), Type.Literal("university")], {
      errorMessage: "No se ha especificado un file correcto.",
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
addErrors(ajv);

const validateSchema = ajv.compile(ReservationViewImageDto);

const reservationViewImagesDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.params);

  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = reservationViewImagesDTO;
