const { Router } = require("express");
const routerTypeEvent = Router();
const { getTypeEvents, getEventsByTypeEvent } = require("../../controllers/typeEvent.controller");

routerTypeEvent
.get('/', getTypeEvents);

module.exports=routerTypeEvent;