const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";
const seeder = require("./../../models/seed");

const app = require("./../../app");

describe("Subreddit Controller (get subreddit) Test", () => {
  describe("get subreddit", () => {
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
            request(app)
              .get("/api/v1/subreddit/khaled_Subreddit")
              .set("Cookie", res1.header["set-cookie"])
              .send()
              .then((res) => {
                // console.log(res.body);
                expect(res.body.status).to.equal("success");
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

    // it("second test (fail) subreddit doesn't exist", (done) => {
    //   seeder().then(() => {
    //     request(app)
    //       .post("/api/v1/users/login")
    //       .send({
    //         email: "ahmedsabry@gmail.com",
    //         userName: "Ahmed",
    //         password: "12345678",
    //       })
    //       .then((res1) => {
    //         console.log(res1.body);
    //         request(app)
    //           .get("/api/v1/subreddit/khaled_Sub")
    //           .set("Cookie", res1.header["set-cookie"])
    //           .send()
    //           .then((res) => {
    //             console.log(res);
    //             expect(res.status).to.equal("fail");
    //             done();
    //           })
    //           .catch(err);
    //         {
    //           console.log("err");
    //           done();
    //         }
    //         //done();
    //       });
    //   });
    // });
  });
  describe("Create Subreddit Test", () => {
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
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .post("/api/v1/subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send({
                  owner: res.body.user.id,
                  name: "kiro_Subreddit",
                  type: "Private",
                  nsfw: false,
                })
                .then((res) => {
                  //console.log(res.body);
                  expect(res.body.status).to.equal("success");
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });
    it("second test", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .post("/api/v1/subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send({
                  owner: res.body.user.id,
                  name: "kiro_Subreddit",
                  type: "Private",
                  nsfw: false,
                })
                .then((res) => {
                  expect(res.body.status).to.equal(404);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });
  });
  describe("delete Subreddit Test", () => {
    it("first test (fail) subreddit doesn't exist", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "khaled",
          email: "khaled@gmail.com",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .delete("/api/v1/subreddit/khaled_Subredd")
                .set("Cookie", res1.header["set-cookie"])
                .send()
                .then((res2) => {
                  // console.log(res2.status);
                  expect(res2.status).to.equal(404);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });

    it("second test (fail) not the owner", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "khaled",
          email: "khaled@gmail.com",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .delete("/api/v1/subreddit/kiro_Subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send()
                .then((res2) => {
                  console.log(res2.status);
                  expect(res2.status).to.equal(401);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });

    it("third test (success)", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .delete("/api/v1/subreddit/kiro_Subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send()
                .then((res2) => {
                  // console.log(res2.status);
                  expect(res2.status).to.equal(204);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });
  });
  describe("update subreddit", () => {
    it("first test (success)", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmedsabry@gmail.com",
          userName: "Ahmed",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .patch("/api/v1/subreddit/khaled_Subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send({ nsfw: false })
                .then((res2) => {
                  // console.log(res2);
                  expect(res2.status).to.equal(401);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });

    it("second test (fail) subreddit doesn't exist", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "khaled",
          email: "khaled@gmail.com",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .patch("/api/v1/subreddit/khaled_Subredd")
                .set("Cookie", res1.header["set-cookie"])
                .send()
                .then((res2) => {
                  // console.log(res2.status);
                  expect(res2.status).to.equal(404);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });

    it("third test (fail) not the owner", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          userName: "khaled",
          email: "khaled@gmail.com",
          password: "12345678",
        })
        .then((res1) => {
          // console.log(res1);
          request(app)
            .get("/api/v1/users/me")
            .set("Cookie", res1.header["set-cookie"])
            .send()
            .then((res) => {
              // console.log(res.body);
              request(app)
                .patch("/api/v1/subreddit/khaled_Subreddit")
                .set("Cookie", res1.header["set-cookie"])
                .send()
                .then((res2) => {
                  // console.log(res2.status);
                  expect(res2.status).to.equal(401);
                  done();
                })
                .catch(err);
              {
                done();
                console.log("erro");
              }
            })
            .catch(err);
          {
            console.log("err");
            done();
          }
        });
    });
  });
});
