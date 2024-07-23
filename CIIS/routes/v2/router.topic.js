
const { Router } = require("express");
const RouterTopic = Router();
const { getTopic, updateTopic, deleteTopic } = require("../../controllers/v2/topics.controller");
const { getTopics } = require("../../controllers/topics.controller");

RouterTopic.route("/topics/:id").get(getTopic)
RouterTopic.route('/topics/:id').put(updateTopic)
RouterTopic.route('/topics/:id').delete(deleteTopic)
RouterTopic.get('/topics', getTopics);
module.exports = RouterTopic;