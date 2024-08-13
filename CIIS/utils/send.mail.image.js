const { transporter } = require("../config/nodemailer");
const sendMail = async (mailOptions) => {
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log(err);
      reject({
        code: 400,
        message: "Error al enviar el correo de preinscripción!",
        sendMailFailed: true,
      });
    });
    resolve();
  });
};

module.exports = sendMail;