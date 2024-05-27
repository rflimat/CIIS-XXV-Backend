const jwt = require("jsonwebtoken");
const http = require("../../utils/http.msg");

const authMid = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send(http["401"]);

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    //console.log(req.user)
    next(); // Aquí solo llamamos a next sin argumentos
  } catch (error) {
    return res.status(401).send(http["401"]);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role == 1) next();
  else return res.status(403).send(http["403"]);
};

const isAtLeastOrganizer = (req, res, next) => {
  if ([1, 3].includes(req.user.role)) next();
  else return res.status(403).send(http["403"]);
};

module.exports = { authMid, isAdmin, isAtLeastOrganizer };
