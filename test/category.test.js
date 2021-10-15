const supertest = require("supertest");
const { baseUrl } = require("./base");

const request = supertest(baseUrl + "/getCategoies");

describe("文章分类", async function () {
  this.timeout(0);

  describe("文章分类列表", async function () {
    const url = "/";

    it("get /categories 200", async function () {
      await request.get(url).expect(200);
    });
  });
});
