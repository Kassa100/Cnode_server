const supertest = require("supertest");
const { baseUrl } = require("./base");
const path = require("path");
const fs = require("fs");

const request = supertest(baseUrl + "/user");

const authStr = fs
  .readFileSync(path.resolve(__dirname, "data/authorization.txt"))
  .toString();

describe("用户", async function () {
  this.timeout(0);

  describe("用户信息", async function () {
    const url = "/getProfile";

    it("get /user/getProfile?type=0&value=1 200", async function () {
      await request
        .get(url)
        .query({
          type: 0,
          value: 1,
        })
        .expect(200);
    });

    it("get /user/getProfile?type=1&value=XadillaX", async function () {
      await request
        .get(url)
        .query({
          type: 1,
          value: "XadillaX",
        })
        .expect(200);
    });
  });

  describe("头像上传", async function () {
    const avatarUploadFile = path.resolve(__dirname, "data/avatar/2.jpg");

    it("patch /user/patchAvatar 401", async function () {
      await request.patch("/patchAvatar").expect(401);
    });

    it("patch /user/patchAvatar 200", async function () {
      await request
        .patch("/patchAvatar")
        .set("authorization", authStr)
        .attach("avatar", avatarUploadFile)
        .expect(200);
    });
  });

  describe("用户发布的文章", async function () {
    const url = "/getArticles";

    it("get /user/getArticles?userId=1 200", async function () {
      await request.get(url).query({ userId: 1 }).expect(200);
    });
  });

  describe("用户回复的文章", async function () {
    const url = "/getReplies";

    it("get /user/getReplies?userId=1 200", async function () {
      await request.get(url).query({ userId: 1 }).expect(200);
    });
  });
});
