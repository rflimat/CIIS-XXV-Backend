const http = require("../utils/http.msg");

const handleHttpError = (res, err) => {
  //console.log("Error: ", err);
  res.status(err.code ?? 500).send({ error: err.message ?? "Error en el servidor" });
};

const handleErrorResponse = (
  res,
  message = "Error en el servidor",
  code = 401
) => {
  res.status(code).send({ error: message });
};

const handleHttpErrorV2 = (res, error) => {
  console.log("Error: ", error);
  res.status(500).send(http["500"]);
};

const handleErrorResponseV2 = (
  res,
  message = "Error en la petición",
  code = 400
) => {
  res.status(code).send({
    error: http[code]?.error || "Error",
    reason: message,
    code
  });
};

module.exports = { handleHttpError, handleErrorResponse, handleHttpErrorV2, handleErrorResponseV2 };
