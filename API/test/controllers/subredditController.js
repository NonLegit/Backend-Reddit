const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const server = require("./../../server");

const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

// ! testing is like a tree  (interesting)
// ? how can i deploy test enviroment ?
// *todo: dont forget to update referencing
// ! status codes 400 (Bad request)  and 404 (something not found)

describe("Subreddit Controller Test", async () => {
  describe("Create subreddit Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/subreddit/khalod") //ask about id?
        .send({
          name: "cmp2024 championship",
          type: "Public",
          nsfw: true,
        })
        .then((res) => {
          assert.equal(res.body.status, "success");
          console.log("Passed from first test in create subreddit");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it("second test (fail,not provide all body)", (done) => {
      request(app)
        .post("/api/v1/subreddit/khalod")
        .send({
          name: "cmp2024championship",
          type: "Public",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          console.log("Passed from first test in sign");
        });

      request(app)
        .post("/api/v1/subreddit/khalod")
        .send({
          type: "Public",
          nsfw: true,
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          console.log("Passed from first test in sign");
          done();
        });
    });
  });

  describe("get subreddit Test", () => {
    it("first test success", async () => {
      console.log("make request");
      subredditName = "cmp2024 championship";
      request(app)
        .get(`/api/v1/subreddit/${subredditName}`)
        .then((res) => {
          console.log(res.body.status);
          expect(res.body.status).to.equal("success");
        });
      console.log("end request");
    });
    it("second test (fail,subreddit not existed)", async () => {
      subredditName = "cmp2024ExamsSolutions";
      request(app)
        .get(`/api/v1/subreddit/${subredditName}`)
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 404);
        });
    });
  });

  //! update subreddit
  describe("get subreddit Test", () => {
    it("first test success (provide a valid subreddit with true moderator)", async () => {
      console.log("make request");
      subredditName = "cmp2024 championship";
      userId = "khalod";
      request(app)
        .patch(`/api/v1/subreddit/${subredditName}/${userId}`)
        .send({
          nsfw: "true",
        })
        .then((res) => {
          console.log(res.body.status);
          expect(res.body.status).to.equal("success");
        });
      console.log("end request");
    });
    it("second test (fail,subreddit not existed)", async () => {
      subredditName = "cmp2024ExamsExams";
      userId = "khalod";
      request(app)
        .patch(`/api/v1/subreddit/${subredditName}/${userId}`)
        .send({
          nsfw: "true",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
        });
    });
    it("third test (fail,subreddit existed but not valid moderator )", async () => {
      subredditName = "cmp2024ExamsSolutions";
      userId = "ahmed";
      request(app)
        .patch(`/api/v1/subreddit/${subredditName}/${userId}`)
        .send({
          nsfw: "true",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 401);
        });
    });
  });

  // ! delete subreddit
  describe("get subreddit Test", () => {
    it("first test success", async () => {
      console.log("make request");
      subredditName = "cmp2024 championship";
      userId = "khalod";
      request(app)
        .delete(`/api/v1/subreddit/${subredditName}/${userId}`)
        .then((res) => {
          console.log(res.body.status);
          expect(res.body.status).to.equal("success");
        });
      console.log("end request");
    });
    it("second test (fail,subreddit not existed)", async () => {
      subredditName = "cmp2024ExamsExams";
      userId = "khalod";
      request(app)
        .delete(`/api/v1/subreddit/${subredditName}/${userId}`)
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
        });
    });
    it("third test (fail,subreddit existed but not the owner)", async () => {
      subredditName = "cmp2024ExamsSolutions";
      userId = "khalod";
      request(app)
        .delete(`/api/v1/subreddit/${subredditName}/${userId}`)
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 401);
        });
    });
  });
});
