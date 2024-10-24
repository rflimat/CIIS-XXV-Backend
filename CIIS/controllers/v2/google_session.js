const Users = require("../../models/Users");
const http = require("../../utils/http.msg");
const { compare } = require("../../utils/password.utils");
const jwt = require("jsonwebtoken");
const Inscriptions = require("../../models/Inscriptions");

const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");

const CONTROLLER_GOOGLE_SESSION = {};

CONTROLLER_GOOGLE_SESSION.POST = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://127.0.0.1:4000/api/v2/google/oauth";

  const oAuthClient = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl,
  );

  const authorizeUrl = oAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile email openid",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

module.exports = CONTROLLER_GOOGLE_SESSION;
