const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
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
  transporter,
};
