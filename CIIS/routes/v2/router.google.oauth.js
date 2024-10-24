var express =  require('express');
const RouterGoogle = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');
const CONTROLLER_GOOGLE_OAUTH = require('../../controllers/v2/google_oauth');
const CONTROLLER_GOOGLE_SESSION = require("../../controllers/v2/google_session");

RouterGoogle.route("/sign")
  .post(CONTROLLER_GOOGLE_SESSION.POST);

RouterGoogle.route("/oauth")
  .post(CONTROLLER_GOOGLE_OAUTH.GET);

module.exports = RouterGoogle;
