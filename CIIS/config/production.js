module.exports = {
  app: {
    domain: process.env.DOMAIN || "www.ciistacna.com",
    port: process.env.SERVER_PORT || 3000,
  },
  database: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    name: process.env.DB_NAME || "a",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_DOCKER_PORT || "3306",
  },
  secret_key: {
    jwt_key: process.env.JWT_PRIVATE_KEY || "C5hCWr@cB<zl6C*]g8sjG7~P@%v9UcXJ",
  },
};
