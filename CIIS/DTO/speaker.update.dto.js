const Ajv = require("ajv");
const { Type } = require("@sinclair/typebox");
const addErrors = require("ajv-errors");
const { handleErrorResponse } = require("../middlewares/handleError");

const speakerUpdateDTOSchema = Type.Object({
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
  role: Type.Optional(Type.String({
    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
    minLength: 1,
    errorMessage: "La profesión no es válida.",
  })),
  workplace: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "El lugar de trabajo no es válido",
  })),
  nationality: Type.Optional(Type.String({
    pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ '-]+$",
    minLength: 1,
    errorMessage: "La nacionalidad no es válida",
  })),
  description: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "El perfil profesional no es válido",
  })),
  socialNetwork: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Red social no válida",
  })),
  university: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Universidad no válida",
  })),
  email: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Email no válido",
  })),
  phone: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Telefono no válido",
  })),
  degree: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Grado no válido",
  })),
  trajectory: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Trayectoria no válida",
  })),
  achievements: Type.Optional(Type.String({
    minLength: 1,
    errorMessage: "Logros no válidos",
  })),
  release_year: Type.Optional(Type.String({
    errorMessage: "release year no válido",
  })),
  experience_years: Type.Optional(Type.String({
    errorMessage: "Años de experiencia no válidos",
  })),

},
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  });

const ajv = new Ajv({ allErrors: true, messages: true })
addErrors(ajv);
const validateSchema = ajv.compile(speakerUpdateDTOSchema);

const speakerUpdateDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body);
  if (!isDTOValid) {
    const errors = validateSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  } else if ((Object.keys(req.body).length == 0) && (req.files == undefined)) {
    handleErrorResponse(res, "Se debe enviar al menos un dato", 400);
    return;
  }

  next();
};

module.exports = speakerUpdateDTO;
