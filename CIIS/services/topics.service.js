const Topics = require("../models/Topics");
const TopicEvents = require("../models/TopicsEvents");
const Events = require("../models/Events");
const { Op } = require("sequelize");

const getTopics = async (query) => {
  return new Promise(async (resolve, reject) => {
    const { active = null } = query;

    if (active && (active != 1 && active != 0)) {
      reject({
        code: 400,
        message: "El campo active solo puede ser 1 o 0"
      });
      return;
    }

    if (
      !Object.keys(query).length
    ) {

      const topics = await Topics.findAll({
        attributes: [['id_topic', 'id'], ['name_topic', 'name'], ['description_topic', 'description']]
      });
      resolve(topics);
      return;
    }


    if (Object.keys(query).length == 1 && active) {
      const topics = await Topics.findAll({
        attributes: [['name_topic', 'name'], ['description_topic', 'description']],
        where: {
          is_active_topic: active
        }
      });
      resolve(topics);
      return;
    }

    const { page = 1, limit = 8, search = "" } = query;

    const whereCondition = {};

    if (active) {
      whereCondition.is_active_topic = active;
    }

    if (search) {
      whereCondition[Op.or] = [
        { name_topic: { [Op.like]: `%${search}%` } },
        { description_topic: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Topics.findAndCountAll({
      attributes: [['name_topic', 'name'], ['description_topic', 'description']],
      where: whereCondition,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(count / limit);
    resolve({
      topics: rows,
      totalPages,
      currentPage: page,
    });
    return;
  });
};

const getTopicsToEvent = async (event) => {
  return new Promise(async (resolve, reject) => {
    const topics = await Topics.findAll({
      attributes: [['name_topic', 'name'], ['description_topic', 'description']],
      include: [
        {
          model: TopicEvents,
          attributes: [],
          where: {
            event_id: event
          }
        }
      ]
    });

    if (!topics || !topics.length) {
      reject({
        code: 404,
        message: "No se han encontrado tópicos"
      })
      return;
    }

    resolve(topics);
    return;
  })
}

const getTopicByID = async (id) => {
  return new Promise(async (resolve, reject) => {

    const topicFound = await Topics.findOne({
      where: {
        id_topic: id
      },
    });
    if (!topicFound) {
      reject({ code: 404, message: "El topic no existe" });
      return;
    }
    const topicFormated = {
      id: topicFound.id_topic,
      name: topicFound.name_topic,
      description: topicFound.description_topic,
      is_active: topicFound.is_active_topic
    }
    resolve(topicFormated);
  });
}
const updateTopicService = async (id, topicObject, transaction) => new Promise(async (resolve, reject) => {
  try {
    const topicFound = await Topics.findOne({
      where: {
        id_topic: id
      }
    });

    if (!topicFound) {
      reject({ code: 404, message: "No se ha encontrado el Tópico" });
      return;
    }

    await topicFound.update(topicObject, { transaction });
    resolve(topicFound.toJSON());
  } catch (error) {
    reject(error);
  }
});

const deleteTopicService = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const topic = await Topics.findOne({
        where: {
          id_topic: id
        },
      });

      if (!topic) {
        reject({
          code: 404,
          message: "El Tópico no existe"
        });
        return;
      }

      await topic.destroy();
      resolve({ message: 'Tópico eliminado correctamente' });
    } catch (error) {
      reject({
        code: 500,
        message: "Error al eliminar el Tópico"
      });
    }
  });
};

const createTopicService = (topicObject, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataObject = {
        name_topic: topicObject.name,
        description_topic: topicObject.description
      }
      console.log(dataObject)
      const topicBuild = Topics.build(dataObject, { transaction, })
      const topicCreated = await topicBuild.save({ transaction })
      resolve(topicCreated)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  getTopics,
  getTopicsToEvent,
  getTopicByID,
  updateTopicService,
  deleteTopicService,
  createTopicService
};
