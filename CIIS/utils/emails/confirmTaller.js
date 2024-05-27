const confirm = (user, taller) => {
  return `<div class="body" style='font-family: "Roboto", "Helvetica", "Arial", sans-serif;'>
  <div class="allText">
      <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
      <p>Nos complace informar que su inscripción al taller "${
        taller.name
      }" ha sido confirmada.
          Apreciamos su interés y agredecemos el entusiasmo por participar. Lo esperamos en el evento.</p>
      
      <p>Si tuviera alguna pregunta o necesitara asistencia, no dude en contactarnos.
          Esperamos que disfrute de su participación en nuestro evento y que
          encuentre valor en esta experiencia.</p>
  
      <p>Gracias por unirse a nosotros. ¡Nos vemos pronto!</p>
  
  
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
};

const abort = (user, taller) => {
  return `<div class="body" style='font-family: "Roboto", "Helvetica", "Arial", sans-serif;'>
  <div class="allText">
      <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
      <p>Lamentamos informarle que su inscripción al taller "${
        taller.name
      }" ha sido rechazada.
          Es probable que su voucher haya sido observado o no haya podido ser verificado, en cualquier caso escríbamos al correo adjunto.</p>
      
      <p>Si se tratase de un error, no dude en contactarnos.
          Esperamos la situación pueda corregirse para que disfrute de su participación en nuestro evento y que
          encuentre valor en esta experiencia.</p>

      <p>Gracias por considerarnos.</p>


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
};

module.exports = { confirm, abort };
