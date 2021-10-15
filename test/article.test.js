const fs = require("fs");
const path = require("path");
const supertest = require("supertest");
const { baseUrl } = require("./base");

const request = supertest(baseUrl + "/article");

const authStr = fs
  .readFileSync(path.resolve(__dirname, "data/authorization.txt"))
  .toString();

describe("文章", async function () {
  this.timeout(0);

  describe("文章列表", async function () {
    const url = "/getAllArticles";

    it("get / 200", async function () {
      await request.get(url).expect(200);
    });
  });

  describe("文章详情", async function () {
    const url = "/getArticle";

    it("get /getArticle/:id 404", async function () {
      await request.get(url + "/-1").expect(404);
    });

    it("get /getArticle/:id 200", async function () {
      await request.get(url + "/1").expect(200);
    });
  });

  describe("添加文章", async function () {
    const url = "/postArticle";

    it("post /postArticle 401", async function () {
      await request.post(url).send({}).expect(401);
    });

    it("post /postArticle 400", async function () {
      await request
        .post(url)
        .set("authorization", authStr)
        .send({})
        .expect(400);
    });

    it("post /postArticle 200", async function () {
      await request
        .post(url)
        .set("authorization", authStr)
        .send({
          categoryId: 1,
          title: "测试标题",
          content: "测试内容",
        })
        .expect(200);
    });
  });

  describe("文章阅读次数", async function () {
    const url = "/article";

    it("patch /article/-1/view_count 404", async function () {
      await request.patch(url + "/-1/view_count").expect(404);
    });

    it("patch /article/1view_count 200", async function () {
      await request.patch(url + "/1/view_count").expect(200);
    });
  });
});
