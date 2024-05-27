const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");

const { handleErrorResponse } = require("../middlewares/handleError");
const Ajv = require("ajv");

const ReportsReservationDto = Type.Object(
  {
    idEvent: Type.String({
      pattern: "^[0-9]+$",
      errorMessage: "Debe especificar un id correcto",
    }),
    status: Type.Union([Type.Literal("1"),Type.Literal("2"),Type.Literal("3")], {
      errorMessage: "El estado de registro no existe",
    }),
  },{
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  }
);

const ajv = new Ajv({ allErrors: true, messages: true });
addErrors(ajv);

const validateSchema = ajv.compile(ReportsReservationDto);

const reportsReservationDTO = (req, res, next) => {
  const {status=""}=req.query;
  const {idEvent}=req.params;
  
  let regex=/^[0-9]+$/;
  
  if(!status){
    if(!idEvent || !regex.test(idEvent)){
      handleErrorResponse(res, 'El parámetro id del evento no es válido', 400);
      return;
    }
    next();
    return;
  }

  const isDTOValid = validateSchema({...req.params,...req.query});
  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
  return;
};

module.exports = reportsReservationDTO;
