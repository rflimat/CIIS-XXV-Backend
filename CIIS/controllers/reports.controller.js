const ExcelJS = require("exceljs");
const { getRegistrationsToUpload,getReportAttendanceByEvent } = require("../services/report.service");
const {handleErrorResponse,handleHttpError}=require("../middlewares/handleError");
const getReportsRegistrations = async (req, res) => {
  try {
    const { idEvent } = req.params;
    const { status = "" } = req.query;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");
    let registerStatus = status;

    if (!registerStatus) {
      registerStatus = "1,2,3";
    }

    const registerFound = await getRegistrationsToUpload(
      idEvent,
      registerStatus
    );
    // // Definir encabezados de columna
    const columns = [
      { header: 'Id', key: 'id_reservation', width: 15 },
      { header: 'Nombre', key: 'name_user', width: 15 },
      { header: 'Apellidos', key: 'lastname_user', width: 15 },
      { header: 'DNI', key: 'dni_user', width: 15 },
      { header: 'Celular', key: 'phone_user', width: 15 },
      { header: 'Correo', key: 'email_user', width: 15 },
      { header: 'Voucher', key: 'num_voucher', width: 15 },
      { header: 'Precio', key: 'price_attendee', width: 15 },
      { header: 'Estado de registro', key: 'register_status', width: 15 },
      { header: 'Tipo de asistente', key: 'type_attendee', width: 15 },
      { header: 'Fecha de creación', key: 'created_at', width: 15 },
      { header: 'Fecha de actualización', key: 'updated_at', width: 15 },
      { header: 'Usuario encargado', key: 'responsible_user', width: 15 },
    ];
    worksheet.columns = columns;
    console.log(registerFound)
    registerFound.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Generar el archivo Excel y enviarlo como descarga
    await workbook.xlsx.write(res)
    res.end();
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res,error);
  }
};

const getReportsAttendanceEvent=async(req,res)=>{
  try {
    const { idEvent } = req.params;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    const registerFound = await getReportAttendanceByEvent(
      idEvent,
    );
    // // Definir encabezados de columna
    const columns = [
      { header: 'Nombre Completo', key: 'fullname', width: 40 },
      { header: 'Asistencias', key: 'attendance', width: 15 },
    ];
    worksheet.columns = columns;
    console.log(registerFound)
    registerFound.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Generar el archivo Excel y enviarlo como descarga
    await workbook.xlsx.write(res)
    res.end();
  } catch (error) {
    if (typeof error.code === "number") {
      handleErrorResponse(res, error.message, error.code);
      return;
    }
    handleHttpError(res,error);
  }
}
module.exports = {
  getReportsRegistrations,
  getReportsAttendanceEvent
};
