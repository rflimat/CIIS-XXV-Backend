const {Router}=require("express");
const routerConfig=Router();
const {getTopics}=require("../../controllers/topics.controller");
routerConfig.get('/topics',getTopics);

module.exports=routerConfig;
