const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const CIIS_API_ROUTES = require("./CIIS/routes/index.routes");
const { app: configServer } = require("./CIIS/config/development.js");
const fs = require("fs");

class Server {
  constructor() {
    this.app = express();
    this.config();
  }

  config() {
    this.app.set("PORT", configServer.port);
    this.app.use(
      cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
      })
    );
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  initialize() {
    this.app.use("/api", CIIS_API_ROUTES);
    this.app.use(express.static(path.join(__dirname, "uploads", "public")));
    // this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(express.static(path.join(__dirname, "out")));

    this.app.get("*", (req, res) => {
      const destinity = path.join(__dirname, "out", `${req.path}.html`);
      fs.access(destinity, fs.constants.F_OK, (err) => {
        if (err) res.redirect("/");
        else {
          res.setHeader("Cache-Control", "public, max-age=604800");
          res.sendFile(destinity);
        }
      });
    });
  }

  listen() {
    const server = this.app.listen(this.app.get("PORT"), (err) => {
      if (err) console.log("Server had fallen. 😢");
      else console.log("Server is alive! 🤑", this.app.get("PORT"));
    });
  }
}

module.exports = Server;
