const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const seeder = require("./../../models/seed");

const app = require("./../../app");

describe("Post Controller (user posts) Test", () => {
  describe("user posts Test", () => {
    it("first test", (done) => {
      seeder().then(() => {
        request(app)
          .post("/api/v1/users/login")
          .send({
            email: "ahmedsabry@gmail.com",
            userName: "Ahmed",
            password: "12345678",
          })
          .then((res1) => {
            //console.log(res1.body);

            //console.log(res1.header);
            request(app)
              .get("/api/v1/users/Ahmed/posts")
              .set("Cookie", res1.header["set-cookie"])
              .send()
              .then((res) => {
                expect(res.body.posts.length).to.equal(2);
                //expect(res.body.posts[0].postVoteStatus).to.equal("0");
                done();
              })
              .catch(err);
            {
              console.log("err");
              done();
            }
            //done();
          });
      });
    });
  });
  describe("user saved Test", () => {
    it("first test", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .get("/api/v1/users/saved")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              //console.log(res.body);
              expect(res.body.posts.length).to.equal(0);
              // expect(res.body.posts[0].postVoteStatus).to.equal("1");
              // expect(res.body.posts[1].postVoteStatus).to.equal("-1");
              // expect(res.body.posts[2].postVoteStatus).to.equal("1");
              done();
            })
            .catch(err);
          {
            done();
            console.log("erro");
          }
        });
    });
  });
  describe("user hidden Test", () => {
    it("first test", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .get("/api/v1/users/hidden")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              //console.log(res.body);
              expect(res.body.posts.length).to.equal(3);
              expect(res.body.posts[0].postVoteStatus).to.equal("1");
              expect(res.body.posts[1].postVoteStatus).to.equal("-1");
              expect(res.body.posts[2].postVoteStatus).to.equal("1");
              done();
            })
            .catch(err);
          {
            done();
            console.log("erro");
          }
        });
    });
  });
  describe("user upvoted Test", () => {
    it("first test", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .get("/api/v1/users/upvoted")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              //console.log(res.body);
              expect(res.body.posts.length).to.equal(2);
              expect(res.body.posts[0].ownerType).to.equal("User");
              done();
            })
            .catch(err);
          {
            done();
            console.log("erro");
          }
        });
    });
  });
  describe("user downvoted Test", () => {
    it("first test", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .get("/api/v1/users/downvoted")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              //console.log(res.body);
              expect(res.body.posts.length).to.equal(1);
              expect(res.body.posts[0].ownerType).to.equal("User");
              done();
            })
            .catch(err);
          {
            done();
            console.log("erro");
          }
        });
    });
  });
});
