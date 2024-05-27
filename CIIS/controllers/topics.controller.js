const TopicService = require("../services/topics.service");
const {
  handleErrorResponse,
  handleHttpError,
} = require("../middlewares/handleError");

const getTopics = async (req, res) => {
  try {
    const { query } = req;
    const topicsFound = await TopicService.getTopics(query);
    res.json(topicsFound);
  } catch (error) {
    if (error.code) {
      return handleErrorResponse(res, error.message, error.code);
    }
    return handleHttpError(res, error);
  }
};

const getTopicsToEvent = async (req, res) => {
  try {
    const { idEvent } = req.params;

    const topicsFound = await TopicService.getTopicsToEvent(idEvent);

    res.json(topicsFound);
  } catch (error) {
    if (error.code) {
      handleErrorResponse(res, error.message, error.code);
      return;
    }

    handleHttpError(res, error);
  }
};
module.exports = {
  getTopics,
  getTopicsToEvent,
};
