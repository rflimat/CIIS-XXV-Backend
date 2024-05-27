function mail2sendUserCode(user) {
  return `<div class="body" style='font-family: "Roboto", "Helvetica", "Arial", sans-serif;'>
  <div class="allText">
      <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
      <p>Mediante la presente facilitamos su código único de usuario.</p>
      
      <p><b>${user.code}</b></p>  
  
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
      <p>La restauración de contraseña se realizado por completo. Facilitamos la nueva contraseña, y su nuevo código único de usuario. Puede cambiar la contraseña desde</p>
      <p>Cuenta > Cambiar contraseña</p>
      
      <p>
        Nueva contraseña: <b>${user.pass}</b><br>
        Nuevo código de usuario: <b>${user.code}</b>
      </p>  
  
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
