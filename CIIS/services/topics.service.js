const Topics = require("../models/Topics");
const TopicEvents=require("../models/TopicsEvents");
const Events=require("../models/Events");
const {Op}=require("sequelize");

const getTopics = async (query) => {
  return new Promise(async (resolve, reject) => {
    const { active = null} = query;

    if(active && (active!=1 && active!=0)){
        reject({
            code:400,
            message:"El campo active solo puede ser 1 o 0"
        });
        return;
    }
    
    if (
      !Object.keys(query).length
    ) {
        
      const topics = await Topics.findAll({
        attributes:[['name_topic','name'],['description_topic','description']]
      });
      resolve(topics);
      return;
    }


    if(  Object.keys(query).length == 1 && active){
        const topics = await Topics.findAll({
          attributes:[['name_topic','name'],['description_topic','description']],  
          where:{
                is_active_topic:active
            }
        });
        resolve(topics);
        return; 
    }

    const { page = 1, limit = 8, search = "" } = query;

    const whereCondition = {};

    if(active){
        whereCondition.is_active_topic=active;
    }

    if (search) {
      whereCondition[Op.or] = [
        { name_topic: { [Op.like]: `%${search}%` } },
        { description_topic: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Topics.findAndCountAll({
      attributes:[['name_topic','name'],['description_topic','description']],
      where: whereCondition,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(count / limit);
    resolve( {
      topics: rows,
      totalPages,
      currentPage: page,
    });
    return;
  });
};

const getTopicsToEvent=async(event)=>{
  return new Promise(async(resolve, reject) => {
    const topics=await Topics.findAll({
      attributes:[['name_topic','name'],['description_topic','description']],
      include:[
        {
          model:TopicEvents,
          attributes:[],
          where:{
            event_id:event
          }
        }
      ]
    });

    if(!topics || !topics.length){
      reject({
        code:404,
        message:"No se han encontrado tópicos"
      })
      return;
    }

    resolve(topics);
    return;
  })
}
module.exports = {
  getTopics,
  getTopicsToEvent
};
