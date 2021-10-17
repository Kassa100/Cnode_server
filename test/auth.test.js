const supertest = require("supertest");

const { baseUrl } = require("./base");

const request = supertest(baseUrl + "/auth");

describe("auth", async function () {
  const url = "/register";
  const username = `test_${Date.now()}`;
  const password = "123456";

  // 解除 mocha 超时设置
  this.timeout(0);
  describe("register", async () => {
    it("POST /auth/register 400 1011", async () => {
      await request.post(url).expect(400, {
        code: 1011,
        message: "注册用户名和密码不能为空",
      });
    });
    it("POST /auth/register 400 1012", async () => {
      await request
        .post(url)
        .send({
          username,
          password,
          repassword: password + "123",
        })
        .expect(400, {
          code: 1012,
          message: "两次输入的密码不一致",
        });
    });
    it("POST /auth/register 409 1013", async () => {
      await request
        .post(url)
        .send({
          username: "XadillaX",
          password,
          repassword: password,
        })
        .expect(409, {
          code: 1013,
          message: "用户名已经被注册",
        });
    });
    it("POST /auth/register 200 0", async () => {
      await request
        .post(url)
        .send({
          username,
          password,
          repassword: password,
        })
        .expect(200)
        .then((res) => {
          if (res.body.code !== 0) {
            throw new Error("注册失败");
          }
        });
    });
  });
  describe("login", async () => {
    const url = "/login";
    it("POST /auth/login 400 1021", async () => {
      await request.post(url).expect(400, {
        code: 1011,
        message: "登录用户名和密码不能为空",
      });
    });

    it("POST /auth/login 404 1022", async () => {
      await request
        .post(url)
        .send({
          username: `nontest${Date.now()}`,
          password: "123123",
        })
        .expect(404, {
          code: 1022,
          message: "用户不存在",
        });
    });

    it("POST /auth/login 401 1023", async () => {
      await request
        .post(url)
        .send({
          username: `XadillaX`,
          password: "XadillaX",
        })
        .expect(401, {
          code: 1023,
          message: "密码错误",
        });
    });
    it("POST /auth/login 200 0", async () => {
      await request
        .post(url)
        .send({
          username: `test_1634119818515`,
          password: "123456",
        })
        .expect(200)
        .then((res) => {
          let authorization = res.headers.authorization;
          if (!authorization) {
            throw new Error("没有头部信息");
          }
        });
    });
  });
});
