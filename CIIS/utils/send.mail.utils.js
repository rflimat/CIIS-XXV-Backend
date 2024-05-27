const { configoAuth2, transporter2 } = require("../config/nodemailer");
const sendMail = async (email, subject, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = await configoAuth2();
      const mailOptions = {
        from: "XXIV CIIS <noreply.test.ciis@gmail.com>",
        to: email,
        subject,
        html: content,
      };

      await transporter.sendMail(mailOptions);
      resolve();
    } catch (error) {
      console.log(error);
      reject({
        code: 400,
        message: "Error al enviar el correo de preinscripción!",
        sendMailFailed: true,
      });
    }
  });
};

const sendMailWithFile = async (mailOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = await configoAuth2();
      await transporter.sendMail(mailOptions);
      resolve();
    } catch (error) {
      console.log(error);
      reject({
        code: 400,
        message: "Error al enviar el correo de preinscripción!",
        sendMailFailed: true,
      });
    }
  });
};

async function sendMailAtDomain(email, subject, content) {
  const mailOptions = {
    from: "CIIS Tacna Perú <web.team@ciistacna.com>",
    to: email,
    subject,
    html: content,
  };

  transporter2.sendMail(mailOptions, (err, info) => {console.log(err)});
}

module.exports = {
  sendMail,
  sendMailWithFile,
  sendMailAtDomain,
};
