const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const SearchController = require("./../../controllers/searchController");
dotenv.config();
chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("Search controller", () => {
  const req = {
    user: {
      _id: "123e4aab2a94c22ae492983a",
    },
    body: {
      parent: "637769a739070007b3bf4de1",
      parentType: "Comment",
      text: "comment text",
    },
    query: {
      limit: 6,
      page: 2,
      type: "comments",
      time: "hour",
      sort: "new",
      q: "search query",
    },
  };

  const SearchService = {
    search: async (data) => [],
  };

  const searchController = new SearchController({ SearchService });

  it("search", async () => {
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default limit", async () => {
    delete req.query.limit;
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default page", async () => {
    delete req.query.page;
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default type", async () => {
    delete req.query.type;
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default sort", async () => {
    delete req.query.sort;
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default time", async () => {
    req.query.time = "not a valid time";
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });

  it("default query", async () => {
    delete req.query.q;
    await searchController.search(req, res, "");

    expect(res.status).to.have.been.calledWith(200);
    expect(res.status().json).to.have.been.calledWith({
      status: "success",
      data: [],
    });
  });
});
