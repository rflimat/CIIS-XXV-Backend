const Ajv = require("ajv");
const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");
const { handleErrorResponse } = require("../middlewares/handleError");

const sponsorCreateDTOSchema = Type.Object(
  {
    name: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "El nombre no es válido",
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

addErrors(ajv);
const validateSchema = ajv.compile(sponsorCreateDTOSchema);

const sponsorCreateDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body);

  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }
  else if (!req.files) {

        handleErrorResponse(res, "No se envio la imagen", 400);
        return;

  }else{
    if(req.files.logo == undefined){
        handleErrorResponse(res, "No se envio el logo", 400);
        return;
    }

  }

  next();
};

module.exports = sponsorCreateDTO;
