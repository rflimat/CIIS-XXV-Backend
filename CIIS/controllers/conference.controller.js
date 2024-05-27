const { handleErrorResponse,handleHttpError }=require("../middlewares/handleError");
const conferenceAttendanceServices =require("../services/conference.attendance.service");
const { getDateTime } = require("../utils/getdate.utils");

const getConferenceDayUser = async (req, res) => {
    try {
        const { day } = req.query;
        const user = req.iduser;
        const conferences = await conferenceAttendanceServices.getConferenceByDayByUser(day,user);
        res.json(conferences);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}

module.exports={
    getConferenceDayUser,
}