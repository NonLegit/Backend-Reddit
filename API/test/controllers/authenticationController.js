const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const auth = require("./../../controllers/authenticationController");
const { userErrors } = require("./../../error_handling/errors");
dotenv.config();
chai.use(sinonChai);
// const proxyquire = require("proxyquire");

//var res = { send: sinon.spy() ,status: sinon.spy(),json: sinon.spy()};
const statusJsonSpy = sinon.spy();
const next = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("Authentication Controller Test", () => {
  describe("Sign-up Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
          userName: "ahmed",
          password: "Aa123456*",
        },
      };
      const UserService = {
        signUp: async (email, password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
        checkPasswordStrength: (password) => {
          return "medium";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.signUp(req, res, "");
      expect(res.status).to.have.been.calledWith(201);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
          userName: "ahmed",
        },
      };
      const UserService = {
        signUp: async (email, password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
        checkPasswordStrength: (password) => {
          return "medium";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.signUp(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide username, email and password",
        errorType: 0,
      });
    });

    it("thrid test bad request user already exists", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
          userName: "ahmed",
          password: "123",
        },
      };
      const UserService = {
        signUp: async (email, password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_ALREADY_EXISTS,
            msg: "User Already Exists",
          };
          return response;
        },
        checkPasswordStrength: (password) => {
          return "medium";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.signUp(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "User Already Exists",
        errorType: 2,
      });
    });

    it("fifth test bad request  weak password", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
          userName: "ahmed",
          password: "123456A",
        },
      };
      const UserService = {
        signUp: async (email, password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_ALREADY_EXISTS,
            msg: "User Already Exists",
          };
          return response;
        },
        checkPasswordStrength: (password) => {
          return "Too weak";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.signUp(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Too weak password",
        errorType: 1,
      });
    });
    it("fourth test bad request Too weak password", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
          userName: "ahmed",
          password: "123",
        },
      };
      const UserService = {
        signUp: async (email, password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_ALREADY_EXISTS,
            msg: "User Already Exists",
          };
          return response;
        },
        checkPasswordStrength: (password) => {
          return "Weak";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.signUp(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Weak password",
        errorType: 1,
      });
    });
  });

  describe("Login Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          userName: "ahmed",
          password: "Aa123456*",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.logIn(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {
          userName: "ahmed",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.logIn(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide username and password",
      });
    });

    it("thrid test bad request user not found ", async () => {
      const req = {
        body: {
          userName: "ahmed",
          password: "123",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_NOT_FOUND,
            msg: "User Already Exists",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.logIn(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });

    it("fourth test incorrect password", async () => {
      const req = {
        body: {
          userName: "ahmed",
          password: "123",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.INCORRECT_PASSWORD,
            msg: "Incorrect Password",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.logIn(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Incorrect Password",
      });
    });
  });

  describe("forgot password Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          userName: "ahmed",
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        forgotPassword: async (password, userName) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(204);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {
          userName: "ahmed",
        },
      };
      const UserService = {
        forgotPassword: async (password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide username and email",
      });
    });

    it("thrid test fail user not found ", async () => {
      const req = {
        body: {
          userName: "ahmed",
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        forgotPassword: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_NOT_FOUND,
            msg: "User Not Found",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
  });

  describe("forgot UserName Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        forgotUserName: async (userName) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotUserName(req, res, "");
      expect(res.status).to.have.been.calledWith(204);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {},
      };
      const UserService = {
        forgotUserName: async (password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotUserName(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide email",
      });
    });

    it("thrid test fail user not found ", async () => {
      const req = {
        body: {
          userName: "ahmed",
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        forgotUserName: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_NOT_FOUND,
            msg: "User Not Found",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.forgotUserName(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
  });

  describe("reset password Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          token: "token",
        },
        body: {
          password: "Aa1234",
          confirmPassword: "Aa1234",
        },
      };
      const UserService = {
        resetPassword: async (resetToken, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.resetPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        params: {
          token: "token",
        },
        body: {
          password: "Aa1234",
        },
      };
      const UserService = {
        resetPassword: async (resetToken, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.resetPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide correct Passwords",
      });
    });

    it("thrid test expired token ", async () => {
      const req = {
        params: {
          token: "token",
        },
        body: {
          password: "Aa1234",
          confirmPassword: "Aa1234",
        },
      };
      const UserService = {
        resetPassword: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.INVALID_RESET_TOKEN,
            msg: "Token Invalid or Has Expired",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.resetPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status(401).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Token Invalid or Has Expired",
      });
    });
    it("fourth test password not equal confirmPassword ", async () => {
      const req = {
        params: {
          token: "token",
        },
        body: {
          password: "Aa1234",
          confirmPassword: "Aa12345",
        },
      };
      const UserService = {
        resetPassword: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.INVALID_RESET_TOKEN,
            msg: "Provide correct Passwords",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.resetPassword(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Token Invalid or Has Expired",
      });
    });
  });

  describe("authorize  Test", () => {
    it("first test success", async () => {
      const req = {
        cookies: {
          jwt: "token",
        },
      };
      const UserService = {
        getUser: async (userId) => {
          const response = {
            success: true,
            data: {
              changedPasswordAfter: (time) => {
                return false;
              },
            },
          };
          return response;
        },
        decodeToken: async (token)=>{
          return "1";
        }
      };
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        cookies: {},
      };
      const UserService = {
        getUser: async (userId) => {
          const response = {
            success: true,
            data: {
              changedPasswordAfter: (time) => {
                return false;
              },
            },
          };
          return response;
        },
        decodeToken: async (token)=>{
          return "1";
        }
      };
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next);
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status(401).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Unauthorized",
      });
    });

    it("thrid test fail password change after token created ", async () => {
      const req = {
        cookies: {
          jwt: "token",
        },
      };
      const UserService = {
        getUser: async (userId) => {
          const response = {
            success: true,
            data: {
              changedPasswordAfter: (time) => {
                return true;
              },
            },
          };
          return response;
        },
        decodeToken: async (token)=>{
          return "1";
        }
      };
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Password is changed , Please login again",
      });
    });
  });
});

// process.env.NODE_ENV = "test";
// const request = require("supertest");
// const seeder = require("./seed");
// const app = require("./../../app");
// const { mockRequest, mockResponse } = require("mock-req-res");
// const { stub, match } = require("sinon");
// const proxyquire = require("proxyquire");

/*
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
}); */

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
