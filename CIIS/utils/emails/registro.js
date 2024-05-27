const email_registro = `<style type="text/css">
      .block {
          background: linear-gradient(0deg, #12202E 0%, rgba(101, 174, 247, 0.2) 100%), rgb(16, 24, 19);
          color: white;
          padding: 10px 30px;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          font-variant: small-caps;
  
      }
  
      .body {
          margin: 20px 30px;
  
          width: "600px";
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      }
  
      .footer {
          font-size: xx-small;
      }
  
      .allText {
          font-size: x-small;
          font-family: "Roboto", Helvetica, Arial, sans-serif;
      }
  
      .subheader {
          font-size: small;
          letter-spacing: -1;
          margin-top: -10
      }
  
      .title {
          font-size: medium;
      }
  
      .secondary {
          color: rgba(255, 255, 255, .8);
          margin-top: -15;
          font-family: "Arial", sans-serif;
          letter-spacing: -0.5
      }
      .container{
          max-width: 500px;
      }
  </style>
  
  <div class="container">
      <div class="body">
          <div class="allText">
              <p>Saludos Estimado/a</p>
              <p>Nos complace confirmar que su registro en nuestro sistema web CIIS ha sido completado con éxito.
                  Apreciamos su interés y estamos emocionados de tenerlo como parte de nuestra comunidad, a continuación
                  le brindamos detalles de que podrá realizar desde su cuenta:</p>
              &bull; Pre-inscripción CIIS<br>
              &bull; Pre-inscripción a talleres<br>
              &bull; Inscripción concursos<br>
              <p>Si tuviera alguna pregunta o necesitara asistencia, no dude en contactarnos.
                  Esperamos que disfrute de su participación en el Congreso Internacional de Informática y Sistemas y que
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

const emailRegistroTaller = (user, taller) => `<style type="text/css">
.block {
    background: linear-gradient(0deg,  0%, rgba(101, 174, 247, 0.2) 100%), rgb(16, 24, 19);
    color: white;
    padding: 10px 30px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-variant: small-caps;

}

.body {
    margin: 20px 30px;

    width: "600px";
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}

.footer {
    font-size: xx-small;
}

.allText {
    font-size: x-small;
    font-family: "Roboto", Helvetica, Arial, sans-serif;
}

.subheader {
    font-size: small;
    letter-spacing: -1;
    margin-top: -10
}

.title {
    font-size: medium;
}

.secondary {
    color: rgba(255, 255, 255, .8);
    margin-top: -15;
    font-family: "Arial", sans-serif;
    letter-spacing: -0.5
}
.container{
    max-width: 500px;
}
</style>

<div class="body">
    <div class="allText">
        <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
        <p>Nos complace confirmar que Su pre-inscripción en el taller "${
          taller.name
        }" ha sido completado con éxito.
            Apreciamos su interés y agredecemos el entusiasmo por participar, un organizador verificará que todo esté en orden con el pago y dará por confirmada su inscripción. Hasta entonces, su vacante será reservada.</p>
        
        <p>Si tuviera alguna pregunta o necesitara asistencia, no dude en contactarnos.
            Esperamos que disfrutes de tu participación en el Congreso Internacional de Informática y Sistemas y que
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

const emailRegistroCIIS = (user) => `<style type="text/css">
.block {
    background: linear-gradient(0deg,  0%, rgba(101, 174, 247, 0.2) 100%), rgb(16, 24, 19);
    color: white;
    padding: 10px 30px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-variant: small-caps;

}

.body {
    margin: 20px 30px;

    width: "600px";
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}

.footer {
    font-size: xx-small;
}

.allText {
    font-size: x-small;
    font-family: "Roboto", Helvetica, Arial, sans-serif;
}

.subheader {
    font-size: small;
    letter-spacing: -1;
    margin-top: -10
}

.title {
    font-size: medium;
}

.secondary {
    color: rgba(255, 255, 255, .8);
    margin-top: -15;
    font-family: "Arial", sans-serif;
    letter-spacing: -0.5
}
.container{
    max-width: 500px;
}
</style>

<div class="body">
    <div class="allText">
        <p>Saludos Estimado/a ${user.name + " " + user.lastname}</p>
        <p>Nos complace confirmar que su pre-inscripción en el "Congreso Internacional de Informática y Sistemas, 24° Edición" ha sido completado con éxito.
            Apreciamos su interés y agredecemos el entusiasmo por participar, un organizador verificará que todo esté en orden con el pago y dará por confirmada su inscripción. Hasta entonces, su vacante será reservada.</p>
        
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

module.exports = { email_registro, emailRegistroTaller, emailRegistroCIIS };
