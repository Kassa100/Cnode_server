const configs = require("../configs");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
module.exports = {
  async register(ctx, next) {
    let { username, password, repassword } = ctx.request.body;
    username = username && username.trim();
    password = password && password.trim();
    repassword = repassword && repassword.trim();
    if (!username || !password) {
      ctx.throw(400, {
        code: 1011,
        message: "注册用户名和密码不能为空",
      });
    }
    if (password !== repassword) {
      ctx.throw(400, {
        code: 1012,
        message: "两次输入的密码不一致",
      });
    }
    const userService = ctx.state.services.user;
    let user = await userService.getUserByUserName(username);
    if (user) {
      ctx.throw(409, {
        code: 1013,
        message: "用户名已经被注册",
      });
    }
    let { id } = await userService.addUser(username, password);
    ctx.body = {
      id,
    };
  },
  async login(ctx, next) {
    let { username, password } = ctx.request.body;
    username = username && username.trim();
    password = password && password.trim();

    if (!username || !password) {
      ctx.throw(400, {
        code: 1011,
        message: "登录用户名和密码不能为空",
      });
    }
    const userService = ctx.state.services.user;

    let user = await userService.getUserByUserName(username);
    if (!user) {
      ctx.throw(404, {
        code: 1022,
        message: "用户不存在",
      });
    }
    const hamc = crypto.createHmac("sha256", configs.user.passwordSalt);
    password = hamc.update(password).digest("hex");
    if (password !== user.password) {
      ctx.throw(401, {
        code: 1023,
        message: "密码错误",
      });
    }
    let token = jsonwebtoken.sign(
      {
        id: user.id,
        username: user.username,
      },
      configs.auth.secretKey
    );
    ctx.set("authorization", token);
    console.log(token);
    ctx.body = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  },
};
