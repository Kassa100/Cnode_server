const supertest = require("supertest");
const { baseUrl } = require("./base");
const fs = require("fs");
const path = require("path");

const request = supertest(baseUrl + "/reply");

const authStr = fs
  .readFileSync(path.resolve(__dirname, "data/authorization.txt"))
  .toString();

describe("回复", async function () {
  this.timeout(0);

  describe("回复列表", async function () {
    const url = "/getReplies";

    it("get /getReplies 200", async function () {
      await request.get(url).query({ articleId: 1 }).expect(200);
    });
  });

  describe("发表回复", async function () {
    const url = "/postReply";

    it("post /postReply 401", async function () {
      await request.post(url).send().expect(401);
    });

    it("post /postReply 400", async function () {
      await request
        .post(url)
        .set("authorization", authStr)
        .send({
          articleId: -1,
        })
        .expect(400);
    });

    it("post /postReply 200", async function () {
      await request
        .post(url)
        .set("authorization", authStr)
        .send({
          articleId: 1,
          content: "测试回复内容",
        })
        .expect(200);
    });
  });
});
