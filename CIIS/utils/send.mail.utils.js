const { transporter } = require("../config/nodemailer");

const sendMailWithFile = async (mailOptions) => {
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

async function sendMail(email, subject, content) {
  const mailOptions = {
    from: "CIIS Tacna Perú <web.team@ciistacna.com>",
    to: email,
    subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    console.log(err);
  });
}

module.exports = {
  sendMail,
  sendMailWithFile
};
