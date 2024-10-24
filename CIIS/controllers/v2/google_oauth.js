var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

async function getUserData(access_token) {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" +
      access_token,
  );
  const data = await express.response.json();
  console.log("data: ", data);
}

const CONTROLLER_GOOGLE_OAUTH = {};

CONTROLLER_GOOGLE_OAUTH.GET = async (req, res, next) => {
  const code = req.query.code;
  try {
    const redirect_url = "http://127.0.0.1:4000/api/v2/google/oauth";
    const oAuthClient = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirect_url,
    );
    const res = await oAuthClient.getToken(code);
    await oAuthClient.setCredentials(res.tokens);
    console.log("Token acquired", res);
    const user = oAuthClient.credentials;
    console.log("credentials", user);
    await getUserData(user.access_token);
  } catch (err) {
    console.log("Error with signing in with Google");
  }
};

module.exports = CONTROLLER_GOOGLE_OAUTH;