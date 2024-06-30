
const { handleErrorResponse, handleHttpError } = require("../../middlewares/handleError");
const speakerServices = require("../../services/speaker.service")
const CONTROLLER_SPEAKER = {};
CONTROLLER_SPEAKER.GET = async (req, res) => {
    try {
        const speakers = await speakerServices.getSpeakers();
        res.json(speakers);
    } catch (error) {
        if (typeof error.code === "number") {
            handleErrorResponse(res, error.message, error.code);
            return;
        }
        handleHttpError(res, error);
    }
}
/* 
CONTROLLER_SPEAKER.DELETE = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const result = await speakerServices.deleteSpeakerById(id);
    } catch (error) {
        handleHttpError(res, error);
    }
} */

module.exports = CONTROLLER_SPEAKER;
