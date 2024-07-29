const sequelize = require("../../config/database");
const galleryService = require("../../services/galleryEvent.service");
const {
    handleHttpError,
} = require("../../middlewares/handleError");
const EventService = require("../../services/event.service");

const getGalleryEvent = async (req, res) => {
    try {
        const { idEvent } = req.params
        //console.log(req.params)
        const event = await EventService.getOneEvent(idEvent);

        const gallery = await galleryService.getGalleryEvent(idEvent)
        res.json(gallery);
    } catch (error) {
        handleHttpError(res, error);
    }
}

const deleteGalleryEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await galleryService.deleteGalleryEventService(id);
        res.json(result);
    } catch (error) {
        handleHttpError(res, error);
    }
}
module.exports = {
    getGalleryEvent,
    deleteGalleryEvent
}