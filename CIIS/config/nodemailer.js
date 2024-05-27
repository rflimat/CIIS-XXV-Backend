const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { secret_key } = require("./development");

const configoAuth2 = async () => {
  const oauth2Client = new google.auth.OAuth2(
    secret_key.client_id,
    secret_key.client_secret_key,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: secret_key.refresh_token_email,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "noreply.test.ciis@gmail.com",
      clientId: secret_key.client_id,
      clientSecret: secret_key.client_secret_key,
      refreshToken: secret_key.refresh_token_email,
      accessToken: accessToken,
    },
  });

  return transporter;
};

const transporter2 = nodemailer.createTransport({
  host: "mail.ciistacna.com", // Reemplaza con el host de tu proveedor
  port: 465, // Puerto seguro para el servidor SMTP (puede variar según tu proveedor)
  secure: true, // false para el puerto 587 (TLS), true para el puerto 465 (SSL)
  auth: {
    user: "web.team@ciistacna.com", // Reemplaza con tu dirección de correo
    pass: process.env.EMAIL_PASS_TECH_SUPP, // Reemplaza con tu contraseña
  },
  tls: {
    rejectUnauthorized: false, // Permitir certificados autofirmados
  },
});

module.exports = {
  configoAuth2,
  transporter2,
};
