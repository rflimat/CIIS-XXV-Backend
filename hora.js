const {encrypt}=require("./CIIS/utils/password.utils");
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
console.log(getDateUTC())
console.log(getDateTime())

encrypt("admin123").then(res=>console.log(res))
