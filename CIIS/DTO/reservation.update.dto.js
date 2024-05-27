const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");

const { handleErrorResponse } = require("../middlewares/handleError");
const Ajv = require("ajv");

const ReservationUpdateStatusDto = Type.Object(
  {
    idReserve: Type.String({
      minLength: 1,
      pattern: "^[0-9]+$",
      errorMessage: "Debe especificar un id correcto",
    }),
    status: Type.Union([Type.Literal("1"), Type.Literal("2"),Type.Literal("3")], {
      errorMessage: "Debe especificar un estado de inscripción correcto",
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  }
);

const validatorUpdateStatus = new Ajv({ allErrors: true, messages: true });
addErrors(validatorUpdateStatus);
const validateSchemaStatusReservation = validatorUpdateStatus.compile(ReservationUpdateStatusDto);

const reservationUpdateStatusDTO = (req, res, next) => {
  const isDTOValid = validateSchemaStatusReservation({...req.params,...req.body});

  if (!isDTOValid) {
    const errors = validateSchemaStatusReservation.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = {
    reservationUpdateStatusDTO
};
