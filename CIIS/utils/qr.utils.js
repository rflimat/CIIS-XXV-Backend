const { toCanvas} = require("qrcode");
const { createCanvas } = require('canvas');
const { sendQR } = require("./body.email");
const {sendMailWithFile} = require("./send.mail.utils");


const sendQRToEmail = async (users) => {
    return new Promise(async(resolve, reject) => {
        try {
          users.forEach(async (user) => {
            try {
      
              const canvas = createCanvas(600, 600);
              await toCanvas(canvas, user.code, { errorCorrectionLevel: 'H',width: 500 });
              const qrImageData = canvas.toBuffer();
      
               const mailOptions = {
                  from: 'XX POSTMASTER <noreply.test.ciis@gmail.com>',
                  to: user.email,
                  subject: sendQR.subject,
                  html:sendQR.content,
                  attachments: [
                    {
                      filename: 'qr_code.png',
                      content: qrImageData
                    }
                  ]
                };
                await sendMailWithFile(mailOptions);
            } catch (error) {
              console.log("Error al enviar correo");
              console.log(error);
            }
          });
          resolve();

        } catch (error) {
          reject(error);
      }
    })
};

module.exports = {
  sendQRToEmail
};
