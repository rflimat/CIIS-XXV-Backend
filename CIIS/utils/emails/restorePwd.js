function mail2sendUserCode(user) {
  return `<div class="body" style='font-family: "Roboto", "Helvetica", "Arial", sans-serif;'>
  <div class="allText">
      <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
      <p>Mediante la presente facilitamos el siguiente enlace para ingresar su nueva contraseña.</p>
      
      <p><a href="https://ciistacna.com/recuperacion/${user.code}/${user.token}">Ingrese al siguiente enlace</a></p>  
  
      Atentamente,<br>
      Comité de tecnología web CIIS
  </div>
  </div>
  <div class="block footer">
  <p>Congreso Internacional de Informática y Sistemas</p>
  <p style="margin-top: -5; font-variant: small-caps;">Unjbg • Esis • Tacna • Perú</p>
  <p style="margin-top: -5; font-variant: small-caps;">Responder a: ciistacna@unjbg.edu.pe</p>
  </div>
  </div>`;
}

function mail2sendUserPass(user) {
  return `<div class="body" style='font-family: "Roboto", "Helvetica", "Arial", sans-serif;'>
  <div class="allText">
      <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
      <p>La restauración de contraseña se realizado por completo.</p>
      <p>Puede iniciar sesión ingresando su correo electrónico y su nueva contraseña.</p>
      Atentamente,<br>
      Comité de tecnología web CIIS
  </div>
  </div>
  <div class="block footer">
  <p>Congreso Internacional de Informática y Sistemas</p>
  <p style="margin-top: -5; font-variant: small-caps;">Unjbg • Esis • Tacna • Perú</p>
  <p style="margin-top: -5; font-variant: small-caps;">Responder a: ciistacna@unjbg.edu.pe</p>
  </div>
  </div>`;
}

module.exports = {
  mail2sendUserCode,
  mail2sendUserPass,
};
