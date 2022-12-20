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
let next = sinon.spy();
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
        getPrefs: async (email, password, userName) => {
          const response = {
            success: true,
            token: "jwt",
          };
          return response;
        },
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
    // add comment
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
          password: "Aa123456*",
          confirmPassword: "Aa123456*",
        },
      };
      const UserService = {
        checkPasswordStrength: (password) => {
          return "Medium";
        },
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
        checkPasswordStrength: (password) => {
          return "Weak";
        },
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
        errorMessage: "Provide password and confirm password",
        errorType: 0,
      });
    });

    it("thrid test expired token ", async () => {
      const req = {
        params: {
          token: "token",
        },
        body: {
          password: "Aa123456*",
          confirmPassword: "Aa123456*",
        },
      };
      const UserService = {
        checkPasswordStrength: (password) => {
          return "Medium";
        },
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
        checkPasswordStrength: (password) => {
          return "Weak";
        },
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
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status(401).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Provide Equal Passwords",
        errorType: 1,
      });
    });
    it("fifth test weak ", async () => {
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
        checkPasswordStrength: (password) => {
          return "Weak";
        },
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
        errorMessage: "Weak password",
        errorType: 2,
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
        decodeToken: async (token) => {
          return "1";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
    it("second test fail", async () => {
      const req = {
        cookies: {},
        headers: {
          authorization: {
            startsWith: (token) => {
              return false;
            },
          },
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
        decodeToken: async (token) => {
          return "1";
        },
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
        decodeToken: async (token) => {
          return "1";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Password is changed , Please login again",
      });
    });

    it("fourth test keeploggedin ", async () => {
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
              keepLoggedIn: true,

              changedPasswordAfter: (time) => {
                return false;
              },
            },
          };
          return response;
        },
        decodeToken: async (token) => {
          return "1";
        },
      };
      let next2 = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next2);
      expect(next2).to.have.been.calledOnce;
    });
    it("fifth test success", async () => {
      const req = {
        cookies: {},
        headers: {
          authorization: {
            startsWith: (token) => {
              return true;
            },
            split: () => {
              return ["Bearer", "Token"];
            },
          },
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
        decodeToken: async (token) => {
          return "1";
        },
      };
      let next3 = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next3);
      expect(next3).to.have.been.calledOnce;
    });

    it("sixth test", async () => {
      const req = {
        cookies: {},
        headers: {
          authorization: {
            startsWith: (token) => {
              return true;
            },
            split: () => {
              return ["Bearer", "Token"];
            },
          },
        },
      };
      const UserService = {
        getUser: async (userId) => {
          const response = {
            success: false,
            data: {
              changedPasswordAfter: (time) => {
                return false;
              },
            },
          };
          return response;
        },
        decodeToken: async (token) => {
          return "1";
        },
      };
      let next3 = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next3);
      expect(res.status(404).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "User not found",
      });
    });
    it("seventh test", async () => {
      const req = {
        cookies: {},
        headers: {
          authorization: {
            startsWith: (token) => {
              return true;
            },
            split: () => {
              return ["Bearer", "Token"];
            },
          },
        },
      };
      const UserService = {
        getUser: async (userId) => {
          const response = {
            success: false,
            data: {
              changedPasswordAfter: (time) => {
                return false;
              },
            },
          };
          return response;
        },
        decodeToken: async (token) => {
          console.log(error);
          return "1";
        },
      };
      let next3 = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.authorize(req, res, next3);
      expect(res.status(401).json).to.deep.calledWith({
        status: "fail",
        errorMessage: "Unauthorized",
      });
    });
  });

  describe("changeEmail  Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed2@gmail.com",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: false,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: true,
            test: "a",
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test fail", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed2@gmail.com",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: false,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          return {
            success: false,
            error: userErrors.EMAIL_ERROR,
            msg: "Cannot Send Emails at that moment ,try again later",
          };
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);

      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });

    it("thrid test fail  ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed2@gmail.com",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: false,
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Email is already taken by another user",
      });
    });

    it("fourth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed2@gmail.com",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return false;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Incorrect password",
      });
    });
    it("fifth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed@gmail.com",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Insert different email",
      });
    });
    it("sixth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed@gmail.com",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide New Email and password",
      });
    });
    it("seventh test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          newEmail: "ahmed",
          password: "12345",
        },
      };
      const UserService = {
        checkPassword: async (password, username) => {
          return true;
        },
        getUserByEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        sendVerificationToken: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
        updateUserEmail: async (token) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changeEmail(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invaild Email",
      });
    });
  });

  describe("cnangePassword  Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "12345",
          confirmNewPassword: "123456",
          newPassword: "123456",
          keepLoggedIn: true,
        },
      };
      const UserService = {
        checkPasswordStrength: (password, username) => {
          return "strong";
        },
        checkPassword: async (token) => {
          return true;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status).to.have.been.calledWith(200);
    });
    it("second test fail", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "12345",
          confirmNewPassword: "123456",
          newPassword: "123456",
        },
      };
      const UserService = {
        checkPasswordStrength: (password, username) => {
          return "strong";
        },
        checkPassword: async (token) => {
          return false;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Incorrect Password",
        errorType: 3,
      });
    });

    it("thrid test fail  ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "12345",
          confirmNewPassword: "123456",
          newPassword: "123456",
        },
      };
      const UserService = {
        checkPasswordStrength: (password, username) => {
          return "Weak";
        },
        checkPassword: async (token) => {
          return false;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Weak password",
        errorType: 2,
      });
    });

    it("fourth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "123456",
          confirmNewPassword: "123456",
          newPassword: "123456",
        },
      };
      const UserService = {
        checkPasswordStrength: (password, username) => {
          return "Weak";
        },
        checkPassword: async (token) => {
          return false;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter New Password not old password",
        errorType: 4,
      });
    });
    it("fifth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "123456",
          confirmNewPassword: "1234556",
          newPassword: "123456",
        },
      };
      const UserService = {
        checkPasswordStrength: async (password, username) => {
          return "weak";
        },
        checkPassword: async (token) => {
          return false;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide Equal Passwords",
        errorType: 1,
      });
    });
    it("sixth test fail ", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "123456",
          confirmNewPassword: "1234556",
        },
      };
      const UserService = {
        checkPasswordStrength: async (password, username) => {
          return "weak";
        },
        checkPassword: async (token) => {
          return false;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage:
          "Provide old password and new password and confirmed new password ",
        errorType: 0,
      });
    });
    it("seventh test success", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmed@gmail.com",
        },
        body: {
          oldPassword: "12345",
          confirmNewPassword: "123456",
          newPassword: "123456",
          keepLoggedIn: false,
        },
      };
      const UserService = {
        checkPasswordStrength: (password, username) => {
          return "strong";
        },
        checkPassword: async (token) => {
          return true;
        },
        changePassword: async (token) => {
          return "";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.changePassword(req, res, next);
      expect(res.status).to.have.been.calledWith(200);
    });
  });

  describe("Logout Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          token: "",
        },
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {};
      const authObj = new auth({ UserService });
      await authObj.logOut(req, res, "");
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
  });
  describe("verifyEmail Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          token: "",
        },
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        verifyEmailToken: async (userName) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.verifyEmail(req, res, "");
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {},
        params: {
          token: "",
        },
      };
      const UserService = {
        verifyEmailToken: async (password, userName) => {
          const response = {
            success: false,
            token: "jwt",
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.verifyEmail(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Token Invalid or Has Expired",
      });
    });
  });

  describe("deleteAccount Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          userName: "ahmed",
        },
        params: {
          token: "",
        },
        body: {
          userName: "ahmed",
          password: "12345",
        },
      };
      const UserService = {
        logIn: async (userName, password) => {
          const response = {
            success: true,
          };
          return response;
        },
        deleteAccount: async () => {
          return true;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.deleteAccount(req, res, "");
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        user: {
          userName: "ahmed",
        },
        body: { userName: "ahmed" },
        params: {
          token: "",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: false,
            token: "jwt",
          };
          return response;
        },
        deleteAccount: async () => {
          return true;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.deleteAccount(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide username and password",
      });
    });
    it("thrid test invalid name  ", async () => {
      const req = {
        user: {
          userName: "ahmeddddd",
        },
        body: { userName: "ahmed", password: "123" },
        params: {
          token: "",
        },
      };
      const UserService = {
        logIn: async (password, userName) => {
          const response = {
            success: false,
            token: "jwt",
          };
          return response;
        },
        deleteAccount: async () => {
          return true;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.deleteAccount(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invalid userName",
      });
    });
    it("fourth test ", async () => {
      const req = {
        user: {
          userName: "ahmed",
          password: "123",
        },
        body: { userName: "ahmed", password: "123" },
        params: {
          token: "",
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
        deleteAccount: async () => {
          return true;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.deleteAccount(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Incorrect Password",
      });
    });
  });
  describe("checkResetTokentime Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          token: "",
        },
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        checkResetTokenTime: async (userName) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.checkResetTokentime(req, res, "");
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {},
        params: {
          token: "",
        },
      };
      const UserService = {
        checkResetTokenTime: async (password, userName) => {
          const response = {
            success: false,
          };
          return response;
        },
      };
      const authObj = new auth({ UserService });
      await authObj.checkResetTokentime(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Token is invalid or has expired",
      });
    });
  });

  describe("facebookValidation  Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          user: { _id: "1" },
          email: "ahmed@gmail.com",
          status: "fail",
        },
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        generateRandomPassword: (userName) => {
          return "Apassword1234*";
        },
        signUp: async (userName) => {
          const response = {
            success: true,
            token: "token",
          };
          return response;
        },
        createToken: () => {
          return "token";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.facebookValidation(req, res, "");
      expect(res.status).to.have.been.calledWith(201);
    });
    it("second test bad request not provide all body data", async () => {
      const req = {
        body: {},
        user: {
          status: "fail",
          user: { _id: "1" },
          email: "ahmed@gmail.com",
        },
      };
      const UserService = {
        signUp: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_ALREADY_EXISTS,
            msg: "User Already Exists",
          };
          return response;
        },
        generateRandomPassword: (userName) => {
          return "Apassword1234*";
        },
        createToken: () => {
          return "token";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.facebookValidation(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Already Exists",
      });
    });
    it("thrid test ", async () => {
      const req = {
        body: {},
        user: {
          status: "success",
          user: { _id: "1" },
          email: "ahmed@gmail.com",
        },
      };
      const UserService = {
        signUp: async (password, userName) => {
          const response = {
            success: false,
            error: userErrors.USER_ALREADY_EXISTS,
            msg: "",
          };
          return response;
        },
        generateRandomPassword: (userName) => {
          return "password";
        },
        createToken: () => {
          return "token";
        },
      };
      const authObj = new auth({ UserService });
      await authObj.facebookValidation(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
    });
  });

  describe("facebookAuth Test", () => {
    it("first test success", async () => {
      const profile = {
        emails: [
          {
            value: "ahmed",
          },
        ],
        body: {
          email: "ahmedAgmail.com",
        },
      };
      const UserService = {
        getUserByEmail: async (userName) => {
          const response = {
            success: true,
            data: "data",
          };
          return response;
        },
      };
      let done = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.facebookAuth("", "", profile, done);
      expect(done).to.have.been.calledWith(null, {
        status: "success",
        user: "data",
      });
    });
    it("second test bad request not provide all body data", async () => {
      const profile = {
        body: {},
        emails: [
          {
            value: "ahmed",
          },
        ],
      };
      const UserService = {
        getUserByEmail: async (password, userName) => {
          const response = {
            success: false,
            token: "jwt",
          };
          return response;
        },
      };
      let done2 = sinon.spy();
      const authObj = new auth({ UserService });
      await authObj.facebookAuth("", "", profile, done2);
      expect(done2).to.have.been.calledWith(null, {
        status: "fail",
        email: "ahmed",
      });
    });
  });
  describe("errorResponse Test", () => {
    it("first test success", async () => {
      const UserService = {};
      const authObj = new auth({ UserService });
      let response = await authObj.errorResponse(userErrors.MONGO_ERR, "Error");
      expect(response.msg).to.be.equal("Invalid parent, couldn't create user");
      expect(response.stat).to.be.equal(400);

      response = await authObj.errorResponse(userErrors.INVALID_TOKEN, "Error");
      expect(response.msg).to.be.equal("Error");
      expect(response.stat).to.be.equal(400);
    });
  });
});
