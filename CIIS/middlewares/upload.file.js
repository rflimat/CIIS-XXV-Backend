const { handleErrorResponse } = require("./handleError");
const { validateExtensionsToFile } = require("../utils/upload.img");

const uploadFile = (nameFile, allowedExtensions) => (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files[nameFile])
    return handleErrorResponse(res, "Suba el archivo solicitado", 400);

  if (!validateExtensionsToFile(allowedExtensions, req.files[nameFile])) {
    return handleErrorResponse(
      res,
      "La extensión del archivo no es válida",
      400
    );
  }
  next();
};

const uploadMultipleOrSingleFile =
  (nameFile, allowedExtensions) => (req, res, next) => {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files[nameFile]
    )
      return handleErrorResponse(res, "Suba el archivo solicitado", 400);

    if (!Array.isArray(req.files[nameFile])) {
      console.log("no es array");
      if (!validateExtensionsToFile(allowedExtensions, req.files[nameFile])) {
        return handleErrorResponse(
          res,
          "La extensión del archivo no es válida",
          400
        );
      }
    } else {
      console.log("es array");
      for (const file of req.files[nameFile]) {
        if (!validateExtensionsToFile(allowedExtensions, file)) {
          return handleErrorResponse(
            res,
            "La extensión del archivo no es válida",
            400
          );
        }
      }
    }
    next();
  };
module.exports = {
  uploadFile,
  uploadMultipleOrSingleFile,
};
