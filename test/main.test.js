const supertest = require("supertest");

const { baseUrl } = require("./base");

const request = supertest(baseUrl);

describe("main", async function () {
  this.timeout(0);
  it("GET / 200", async () => {
    await request.get("/").expect(200);
  });
});
