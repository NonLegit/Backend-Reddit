const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";

const seeder = require("./seed");
const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

describe("User Controller Test", () => {
  describe("get preferences Test", () => {
    it("first test success", (done) => {
      seeder().then(() => {
        request(app)
          .post("/api/v1/users/login")
          .send({
            userName: "Ahmed",
            password: "12345678",
          })
          .then((res1) => {
            assert.equal(res1.body.status, "success");
            request(app)
              .get("/api/v1/users/me/prefs")
              .set("Cookie", res1.header["set-cookie"])
              .send()
              .then((res) => {
                assert.equal(res.body.status, "success");
                assert.equal(res.body.prefs.canbeFollowed, true);
                done();
              });
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe("update preferences Test", () => {
      it("first test success", (done) => {
        request(app)
          .post("/api/v1/users/login")
          .send({
            userName: "Ahmed",
            password: "12345678",
          })
          .then((res1) => {
            assert.equal(res1.body.status, "success");
            request(app)
              .patch("/api/v1/users/me/prefs")
              .set("Cookie", res1.header["set-cookie"])
              .send({
                canbeFollowed: false,
              })
              .then((res) => {
                //console.log(res.body);
                assert.equal(res.body.status, "success");
                assert.equal(res.body.prefs.canbeFollowed, false);
                done();
              });
          })
          .catch((err) => {
            done(err);
          });
      });
      it("second test (try update password)", (done) => {
        request(app)
          .post("/api/v1/users/login")
          .send({
            userName: "Ahmed",
            password: "12345678",
          })
          .then((res1) => {
            assert.equal(res1.body.status, "success");
            request(app)
              .patch("/api/v1/users/me/prefs")
              .set("Cookie", res1.header["set-cookie"])
              .send({
                allowUpvotesOnPosts: false,
                password: "12345",
              })
              .then((res) => {
                assert.equal(res.body.status, "success");
                assert.equal(res.body.prefs.allowUpvotesOnPosts, false);
                request(app)
                  .post("/api/v1/users/login")
                  .send({
                    userName: "Ahmed",
                    password: "12345678",
                  })
                  .then((res2) => {
                    assert.equal(res2.body.status, "success");
                    done();
                  });
              });
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
  describe("about user Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          assert.equal(res1.body.status, "success");
          request(app)
            .get("/api/v1/users/khaled/about")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              assert.equal(res.body.status, "success");
              assert.equal(res.body.user.userName, "khaled");
              done();
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
  describe("me Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          assert.equal(res1.body.status, "success");
          request(app)
            .get("/api/v1/users/me/")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              assert.equal(res.body.status, "success");
              assert.equal(res.body.user.userName, "Ahmed");
              assert.equal(res.body.user.password, undefined);
              done();
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe("username_available test", () => {
    it("username is avilable", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .get("/api/v1/users/username_available?userName=kirollos")
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(res.status).to.equal(200);
      expect(res._body.available).to.equal(false);
    });

    it("username is not avilable", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .get("/api/v1/users/username_available?userName=kiro")
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(res.status).to.equal(200);
      expect(res._body.available).to.equal(true);
    });
  });
});
