var express =  require('express');
const RouterGoogle = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const CONTROLLER_GOOGLE_OAUTH = require('../../controllers/v2/google_oauth');

RouterGoogle
  .get("/oauth", CONTROLLER_GOOGLE_OAUTH.GET)
  .get("/user", CONTROLLER_GOOGLE_OAUTH.GET_USER)
  .post("/sign", CONTROLLER_GOOGLE_OAUTH.POST);

module.exports = RouterGoogle;
