const topicService = require("../../services/topics.service");
const {
    handleErrorResponse,
    handleHttpError,
} = require("../../middlewares/handleError");
const topicDTO = require('../../DTO/topic.dto');
const sequelize = require("../../config/database");

const getTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const topicFound = await topicService.getTopicByID(id);
        res.json(topicFound);
    } catch (error) {
        if (error.code) {
            return handleErrorResponse(res, error.message, error.code);
        }
        return handleHttpError(res, error);
    }
};
const updateTopic = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description, is_active } = await req.body;
        const { id } = await req.params
        const topic = new topicDTO(name, description, is_active)
        //console.log(user)
        await topicService.updateTopicService(id, topic, transaction)
        res.sendStatus(200);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if (error.code) {
            return handleErrorResponse(res, error.message, error.code);
        }
        handleHttpError(res, error);
    }
};
const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await topicService.deleteTopicService(id);
        res.json(result);
    } catch (error) {
        handleHttpError(res, error);
    }
};

module.exports = {
    getTopic,
    updateTopic,
    deleteTopic
}