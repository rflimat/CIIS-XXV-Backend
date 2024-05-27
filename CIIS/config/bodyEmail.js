const bodyEmail=`
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .container {
      width: 600px;
      margin: 0 auto;
    }
    
    .header {
      background-color: rgba(0, 151, 136,1);
      padding: 20px;
      text-align: center;
    }
    
    .header h2 {
      font-size: 28px;
      color:  rgba(252, 252, 252,1);
      margin: 0;
      text-transform: uppercase;
    }
    .header h3 {
      color:  rgba(252, 252, 252,1);
      margin: 0;
      text-transform: uppercase;
    }
    
    .content {
      padding: 20px;
    }
    
    .content p {
      margin: 0 0 15px;
    }
    
    .footer {
      background-color: rgba(0, 151, 136,1);
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: rgba(255, 252, 255,1);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>POSTMASTER XX</h2>
      <h3>Confirmación de Pre-Inscripción</h3>
    </div>
    <div class="content">
      <p>Estimado/a,</p>
      
      <p>Le escribimos para confirmar que su inscripción ha sido recibida correctamente. Agradecemos su interés en el POSTMASTER XX.</p>
      
      <p>Actualmente estamos procesando las inscripciones y nos comunicaremos con usted a la brevedad para brindarle más detalles y confirmar su participación.</p>
      
      <p>Por favor, esté atento/a a su bandeja de entrada. Pronto recibirá un correo electrónico con la confirmación oficial de su participación.</p>
      
      <p>Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nosotros.</p>
      
      <p>Gracias de nuevo por su inscripción y esperamos tenerlo/a con nosotros en el POSTMASTER XX.</p>
      
      <p>Atentamente,</p>
      
      <p>El equipo de tecnología web del CIIS XXIV</p>
    </div>
    <div class="footer">
      <p>No responda a este correo electrónico. Si tiene alguna pregunta, por favor, comuníquese con nosotros a través de los canales indicados en nuestra página web.</p>
    </div>
  </div>
</body>
`;

module.exports=bodyEmail;