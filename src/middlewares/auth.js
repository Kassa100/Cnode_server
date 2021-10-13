// 用户鉴权

const jsonwebtoken = require("jsonwebtoken");

const configs = require("../configs");

module.exports = () => {
  return async (ctx, next) => {
    try {
      let user = jsonwebtoken.verify(
        ctx.headers.authorization,
        configs.auth.secretKey
      );
      ctx.state.user = user;
    } catch (err) {
      ctx.throw(401, {
        code: -1,
        message: "用户未登录",
      });
    }
    await next();
  };
};
