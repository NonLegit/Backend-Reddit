const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
process.env.NODE_ENV = "test";

const seeder = require("./../../models/seed");
const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

describe("Authentication Controller Test", () => {
  describe("Sign-up Test", () => {
    it("first test success", (done) => {
      seeder().then(() => {
        request(app)
          .post("/api/v1/users/signup")
          .send({
            email: "ahmedsabry123@gmail.com",
            userName: "ahmed123",
            password: "12345678",
          })
          .then((res) => {
            assert.equal(res.body.status, "success");
            request(app)
              .post("/api/v1/users/signup")
              .send({
                email: "ahmedsabry123@gmail.com",
                userName: "ahmed123",
                password: "12345678",
              })
              .then((res) => {
                assert.equal(res.body.status, "fail");
              });
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    it("second test (fail,not provide all body)", (done) => {
      request(app)
        .post("/api/v1/users/signup")
        .send({
          email: "ahmed@gmail.com",
          userName: "ahmedd",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          request(app)
            .post("/api/v1/users/signup")
            .send({
              email: "kahled@gmail.com",
              password: "12345678",
            })
            .then((res) => {
              assert.equal(res.body.status, "fail");
              assert.equal(res.status, 400);
            });
          done();
        });
    });
  });

  describe("login Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/signup")
        .send({
          email: "ahmed1234@gmail.com",
          userName: "ahmed1234",
          password: "12345678",
        })
        .then((res1) => {
          request(app)
            .post("/api/v1/users/login")
            .send({
              userName: "ahmed123",
              password: "12345678",
            })
            .then((res) => {
              expect(res.body.status).to.equal("success");
            });
          done();
        });
    });
    it("second test (fail,not provide all body)", (done) => {
      request(app)
        .post("/api/v1/users/login")
        .send({
          email: "ahmed@gmail.com",
          userName: "ahmedd",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          request(app)
            .post("/api/v1/users/login")
            .send({
              email: "kahled@gmail.com",
              password: "12345678",
            })
            .then((res) => {
              assert.equal(res.body.status, "fail");
              assert.equal(res.status, 400);
            });
          done();
        });
    });
  });
  describe("forgot password Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/forgot_password")
        .send({
          userName: "Ahmed",
          email: "ahmedsabry@gmail.com",
        })
        .then((res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });
    it("second test (fail,not provide all body)", (done) => {
      request(app)
        .post("/api/v1/users/forgot_password")
        .send({
          email: "ahmed@gmail.com",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          done();
        });
    });
    it("thrid test (fail,user not exists )", (done) => {
      request(app)
        .post("/api/v1/users/forgot_password")
        .send({
          email: "ahmed@gmail.com",
          userName: "none",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 404);
          done();
        });
    });
  });
  describe("forgot username Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/forgot_username")
        .send({
          email: "ahmedsabry@gmail.com",
        })
        .then((res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });
    it("second test (fail,not provide all body)", (done) => {
      request(app)
        .post("/api/v1/users/forgot_username")
        .send({})
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          done();
        });
    });
    it("thrid test (fail,user not exists )", (done) => {
      request(app)
        .post("/api/v1/users/forgot_username")
        .send({
          email: "ahmed566666@gmail.com",
        })
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 404);
          done();
        });
    });
  });
  describe("reset password", () => {
    it("first test (fail, provide invalid token)", (done) => {
      request(app)
        .post("/api/v1/users/reset_password/asasa")
        .send({})
        .then((res) => {
          assert.equal(res.body.status, "fail");
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  describe("logout Test", () => {
    it("first test success", (done) => {
      request(app)
        .post("/api/v1/users/logout")
        .send({})
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});

// const mockSave = stub();

// const res = mockResponse();
// const resetStubs = () => {
//     mockSave.resetHistory();
//     res.json.resetHistory();
// };
// const expected = { name: "", description: "", id: 1 };
// before(() => {
//     //save.returns(expected);
// });
//it

// const req = mockRequest({
//     body: { email: "", password: "", userName: "" },
// });

// await authenticationControllerObj.signUp(req, res);
// console.log(res);
