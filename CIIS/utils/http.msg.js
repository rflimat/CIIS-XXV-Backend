const http = {
  500: {
    error: "Ha ocurrido un error",
    reason:
      "El servidor no esta disponible en este momento, inténtelo más tarde",
    code: 500,
  },
  400: {
    error: "Solicitud incorrecta",
    reason: "Algo anda mal con la solicitud realizada.",
    code: 409,
  },
  401: {
    error: "No autorizado",
    reason: "Es necesario estar identificado para realizar esta acción",
    code: 401,
  },
  403: {
    error: "Prohibido",
    reason: "Es necesario tener los permisos necesarios",
    code: 403,
  },
  409: {
    error: "Ha ocurrido un error",
    reason: "Recurso ya existente, surgió un conflicto en el servidor",
    code: 409,
  },
  200: {
    msg: "OK",
    reason: "Operación realizada con éxito",
    code: 201,
  },
  201: {
    msg: "Recurso creado",
    reason: "Operación realizada con éxito",
    code: 201,
  },
};

module.exports = http;
