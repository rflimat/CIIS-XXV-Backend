const { getInfoRoleUserByCode } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt.utils");
const { secret_key } = require("../config/development");
const { handleErrorResponse, handleHttpError } = require("./handleError");
const { decryptToken } = require("../utils/encrypt.utils");
const { validateExistAccountUser } = require("./validateExistenceOfRecord");

const checkAuth = async (req, res, next) => {
  try {
    const { jwt = "" } = req.cookies;
    if (!jwt) {
      res.clearCookie("jwt");
      return handleErrorResponse(
        res,
        "Debe Iniciar Sesión. ¡Ingrese de nuevo!",
        401
      );
    }
    const { payload } = await verifyToken(jwt, secret_key.jwt_key);
    const userInfoFound = await getInfoRoleUserByCode(payload.code);
    req.iduser = userInfoFound.id_user;
    req.role = userInfoFound.role.name_role;
    next();
  } catch (error) {
    res.clearCookie("jwt");

    if (typeof error.code === "number") {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleErrorResponse(res, "Token inválido", 401);
  }
};

const checkRole = (roles) => async (req, res, next) => {
  try {
    const { role = "" } = req;

    if (!roles.includes(role)) {
      handleErrorResponse(res, `No tiene los permisos necesarios.`, 403);
      return;
    }
    next();
  } catch (error) {
    handleHttpError(res, error);
  }
};

const checkSession = async (req, res, next) => {
  const { jwt = "" } = req.cookies;

  if (!jwt) {
    next();
    return;
  }

  return handleErrorResponse(res, "Ya existe una sesión activa", 409);
};

const checkTokenTemporary = async (req, res, next) => {
  try {
    const { cui = "" } = req.query;
    if (!cui) {
      return handleErrorResponse(
        res,
        "No ha enviado ningun codigo de identificación",
        400
      );
    }
    const tokenDecrypt = await decryptToken(cui, secret_key.encrypt_secret_key);
    const { payload } = await verifyToken(
      tokenDecrypt,
      secret_key.encrypt_secret_key
    );
    req.email = payload.email;
    next();
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return handleErrorResponse(
        res,
        "El token a expirado. ¡Vuelva a solicitar un código de verificación!",
        401
      );
    }
    return handleHttpError(res, error);
  }
};

const checkTokenTemporaryToCreateAccount = async (req, res, next) => {
  try {
    const { cui = "" } = req.query;
    if (!cui) {
      return handleErrorResponse(
        res,
        "No ha enviado ningun codigo de identificación",
        400
      );
    }
    const tokenDecrypt = await decryptToken(cui, secret_key.encrypt_secret_key);
    const { payload } = await verifyToken(
      tokenDecrypt,
      secret_key.encrypt_secret_key
    );
    req.body.email = payload.email;
    next();
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return handleErrorResponse(
        res,
        "El token a expirado. ¡Vuelva a solicitar un código de verificación!",
        401
      );
    }
    return handleHttpError(res, error);
  }
};

module.exports = {
  checkAuth,
  checkRole,
  checkSession,
  checkTokenTemporary,
  checkTokenTemporaryToCreateAccount,
};
