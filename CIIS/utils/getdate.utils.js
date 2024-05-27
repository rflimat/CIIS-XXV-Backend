const toJSONLocal=(date)=> {
  let local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}

const getDateTimeLocalPeru=()=>{
  const d=new Date();
  const date=toJSONLocal(d);
  const hour=d.toLocaleTimeString('es-PE');
  return date+' '+hour;
}

const getDateTime = () => {
  const timeZoneOffset = -5 * 60 * 60 * 1000;
  const dateMilliseconds = new Date().getTime();
  const currentTimePeru = new Date(dateMilliseconds + timeZoneOffset);
  const anio = currentTimePeru.getFullYear();
  const mes = String(currentTimePeru.getMonth() + 1).padStart(2, "0");
  const dia = String(currentTimePeru.getDate()).padStart(2, "0");
  const horas = String(currentTimePeru.getHours()).padStart(2, "0");
  const minutos = String(currentTimePeru.getMinutes()).padStart(2, "0");
  const segundos = String(currentTimePeru.getSeconds()).padStart(2, "0");

  const datetimeFormat = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

  return datetimeFormat;
};

const getDate = () => {
  const timeZoneOffset = -5 * 60 * 60 * 1000;
  const dateMilliseconds = new Date().getTime();
  const currentTimePeru = new Date(dateMilliseconds + timeZoneOffset);
  const anio = currentTimePeru.getFullYear();
  const mes = String(currentTimePeru.getMonth() + 1).padStart(2, "0");
  const dia = String(currentTimePeru.getDate()).padStart(2, "0");

  const dateFormat = `${anio}-${mes}-${dia}`;

  return dateFormat;
};

const getDateUTC=()=>{
  // Obtener la fecha y hora actual en UTC
  const fechaHoraActualUTC = new Date();
  
  // Ajustar la hora actual para UTC-5 (restar 5 horas)
  fechaHoraActualUTC.setUTCHours(fechaHoraActualUTC.getUTCHours() - 5);
  
  // Obtener la fecha actual en formato UTC-5
  const fechaUTC5 = fechaHoraActualUTC.toISOString().slice(0, 10); // Formato: YYYY-MM-DD
  
  // Obtener la hora actual en formato UTC-5
  const horaUTC5 = fechaHoraActualUTC.toISOString().slice(11, 19); // Formato: HH:mm:ss
  
  return `${fechaUTC5} ${horaUTC5}`;
}

const formatDateToUTC5=(datetimeUTC='2023-10-28T18:00:00.000Z')=>{
   // Obtener la fecha y hora actual en UTC
  const fechaHoraActualUTC = new Date(datetimeUTC);
  
  // Ajustar la hora actual para UTC-5 (restar 5 horas)
  // fechaHoraActualUTC.setUTCHours(fechaHoraActualUTC.getUTCHours() - 5);
  
  // Obtener la fecha actual en formato UTC-5
  const fechaUTC5 = fechaHoraActualUTC.toISOString().slice(0, 10); // Formato: YYYY-MM-DD
  
  // Obtener la hora actual en formato UTC-5
  const horaUTC5 = fechaHoraActualUTC.toISOString().slice(11, 19); // Formato: HH:mm:ss
  
  return `${fechaUTC5} ${horaUTC5}`;
}

module.exports = {
  getDateTime,
  getDate,
  getDateTimeLocalPeru,
  getDateUTC,
  formatDateToUTC5
};
