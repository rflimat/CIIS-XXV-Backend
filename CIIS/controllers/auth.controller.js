const { verifyToken } = require("../utils/jwt.utils");
const { getUserInfoByCode } = require("../services/user.service");
const { handleErrorResponse } = require("../middlewares/handleError");
const { secret_key } = require("../config/development");

const checkAuthToAccesView = async (req, res) => {
  try {
    const { jwt = "" } = req.cookies;

    if (!jwt) {
      res.clearCookie("jwt", {
        sameSite: "none",
        secure: true,
      });
      handleErrorResponse(res, "Debe Iniciar Sesión. ¡Ingrese de nuevo!", 401);
      return;
    }

    const { payload } = await verifyToken(jwt, secret_key.jwt_key);

    const userInfoFound = await getUserInfoByCode(payload.code);

    res.status(200).json({
      fullname: userInfoFound.name_user + " " + userInfoFound.lastname_userl,
      email: userInfoFound.email_user,
    });
  } catch (err) {
    res.clearCookie("jwt", {
      sameSite: "none",
      secure: true,
    });
    if (err.code) {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleErrorResponse(res, "Sesión Caducada. ¡Ingrese de nuevo!", 401);
  }
};

module.exports = {
  checkAuthToAccesView,
};
