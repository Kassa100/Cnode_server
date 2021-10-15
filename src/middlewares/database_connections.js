const mysql2 = require("mysql2/promise");
const getUserService = require("../services/user");
const getCategoiesService = require("../services/category");
const getArticleService = require("../services/article");
let db;
let services;
module.exports = (config) => {
  return async (ctx, next) => {
    if (!db) {
      try {
        db = await mysql2.createConnection(config);
        services = {
          user: getUserService(db),
          category: getCategoiesService(db),
          article: getArticleService(db),
        };
      } catch (err) {
        ctx.throw(500, {
          code: -2,
          message: "数据库连接失败",
          errors: err.toString(),
        });
      }
    }
    if (db) {
      ctx.state.db = db;
      ctx.state.services = services;
    }
    await next();
  };
};
