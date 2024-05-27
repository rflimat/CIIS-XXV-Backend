const { Type } = require("@sinclair/typebox");
const Ajv = require("ajv");
const addErrors = require("ajv-errors");
const addFormats = require("ajv-formats");
const { handleErrorResponse } = require("../middlewares/handleError");

// definir schema
const UserRegisterDtoSchema = Type.Object(
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

// definir schema
const UserEmailDto = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        type: "Debe ser un string",
        format: "Debe ser un email válido",
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

// definir schema
const UserCheckEmailCodeDto = Type.Object(
  {
    email: Type.String({
      format: "email",
      errorMessage: {
        type: "Debe ser un string",
        format: "Debe ser un email válido",
      },
    }),
    code: Type.String({
      pattern: "^[0-9]{5}$",
      errorMessage: "Código inválido",
    }),
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: "El formato no es válido",
    },
  }
);

// definir schema
const UserPasswordDto = Type.Object(
  {
    password: Type.String({
      pattern: "^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,16}$",
      errorMessage: {
        type: "Debe ser un string",
        pattern: "La contraseña debe tener de 8 a 16 caracteres alfanuméricos",
      },
    }),
    email: {
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
const validateEmailSchema = ajv.compile(UserEmailDto);
const validateUserSchema = ajv.compile(UserRegisterDtoSchema);
const validateEmailCodeSchema = ajv.compile(UserCheckEmailCodeDto);
const validatePasswordSchema = ajv.compile(UserPasswordDto);

const userRegisterDTO = (req, res, next) => {
  const isDTOValid = validateUserSchema(req.body);

  if (!isDTOValid) {
    const errors = validateUserSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

const userEmailDTO = (req, res, next) => {
  const isDTOValid = validateEmailSchema(req.body);

  if (!isDTOValid) {
    const errors = validateEmailSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

const userCheckEmailCodeDTO = (req, res, next) => {
  const isDTOValid = validateEmailCodeSchema(req.query);

  if (!isDTOValid) {
    const errors = validateEmailCodeSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

const userPasswordDTO = (req, res, next) => {
  const isDTOValid = validatePasswordSchema(req.body);

  if (!isDTOValid) {
    const errors = validatePasswordSchema.errors.map((error) => error.message);
    handleErrorResponse(res, errors, 400);
    return;
  }

  next();
};

const userCreateAccountDTO = (req, res, next) => {
  if (req.user.exist) {
    userPasswordDTO(req, res, next);
  } else {
    userRegisterDTO(req, res, next);
  }
};

module.exports = {
  userRegisterDTO,
  userEmailDTO,
  userCheckEmailCodeDTO,
  userCreateAccountDTO,
};
