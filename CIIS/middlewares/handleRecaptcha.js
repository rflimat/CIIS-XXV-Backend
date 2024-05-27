const axios = require("axios").default;
const {
  secret_key: { recaptcha_key },
} = require("../config/development");
const { handleErrorResponse } = require("./handleError");
const handleRecaptcha = (req, res, next) => {
  try {
    const recaptchaValue = req.body["g-recaptcha-response"]
      ? req.body["g-recaptcha-response"]
      : "";
    axios
      .post("https://www.google.com/recaptcha/api/siteverify", null, {
        params: {
          secret: recaptcha_key,
          response: recaptchaValue,
        },
      })
      .then(({ data }) => {
        if (data.success) return next();

        handleErrorResponse(res, "Resuelva el captcha correctamente", 400);
      })
      .catch((err) => {
        handleErrorResponse(
          res,
          "Ha ocurrido un error validando el captcha, intentelo más tarde",
          500
        );
        return;
      });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, "Error", 400);
    return;
  }
};

module.exports = handleRecaptcha;
