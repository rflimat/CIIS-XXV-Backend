const Ajv = require("ajv");
const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");
const { handleErrorResponse } = require("../middlewares/handleError");

const speakerCreateDTOSchema = Type.Object(
  {
    name: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "El nombre no es válido",
    }),
    lastname: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "El apellido no es válido",
    }),
    role: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "La profesión no es válida.",
    }),
    workplace: Type.String({
      minLength: 1,
      errorMessage: "El lugar de trabajo no es válido",
    }),
    nationality: Type.String({
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
      minLength: 1,
      errorMessage: "La nacionalidad no es válida",
    }),
    description: Type.String({
      minLength: 1,
      errorMessage: "El perfil profesional no es válido",
    }),
    socialNetwork: Type.String({
      minLength: 1,
      errorMessage: "Red social no válida",
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
const ajv = new Ajv({ allErrors: true, messages: true })
  .addKeyword("kind")
  .addKeyword("modifier");
addErrors(ajv);
const validateSchema = ajv.compile(speakerCreateDTOSchema);

const speakerCreateDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body);

  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

module.exports = speakerCreateDTO;
