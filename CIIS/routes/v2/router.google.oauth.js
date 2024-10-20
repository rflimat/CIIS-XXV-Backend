var express =  require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');


RouterInscription.route("/event/:event/google_oauth/ciis")
  .post(CONTROLLER_GOOGLE_OAUTH.GET);

module.exports = RouterInscription;
