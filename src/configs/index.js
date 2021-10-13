const path = require("path");

module.exports = {
  app: {
    port: 8888,
  },
  router: {
    prefix: "/api",
  },
  user: {
    passwordSalt: "cnode",
  },
  auth: {
    secretKey: "cnode",
  },
  staticAssets: {
    prefix: "/public",
    dir: path.resolve(__dirname, "../../public"),
  },
  upload: {
    dir: path.resolve(__dirname, "../../public/avatar"),
  },
  database: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "cnode",
  },
};
