const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { mongoErrors, userErrors } = require("./../../error_handling/errors");
dotenv.config();
const UserService = require("./../../service/userService");

const Email = {
  sendPasswordReset: (user, resetURL) => {
    return true;
  },
  sendUserName: (user) => {
    return true;
  },
};
describe("Authentication Test", () => {
  describe("Sign-up services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        createOne: function (userData) {
          const response = {
            success: true,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      console.log("hi");
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.signUp(
        "ahmed@gmail",
        "ahmed",
        "Aa1234*"
      );
      assert.equal(output.success, true);
      assert.notEqual(output.token, false);
    });
    it("second test(fail operation of database)", async () => {
      const UserRepository = {
        createOne: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
          };
          return response;
        },
      };

      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.signUp(
        "ahmed@gmail",
        "ahmed",
        "Aa1234*"
      );
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.USER_ALREADY_EXISTS);
    });
  });

  describe("Log-in services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              checkPassword: async (data1, data2) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.logIn("ahmed", "Aa1234*");
      assert.equal(output.success, true);
      assert.notEqual(output.token, false);
    });
    it("second test(success operation of database but wrong password)", async () => {
      const UserRepository = {
        findByUserName: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.logIn("", "");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.USER_NOT_FOUND);
    });
    it("thrid test(incorrect password)", async () => {
      const UserRepository = {
        findByUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "123456",
              checkPassword: async (data1, data2) => {
                return false;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.logIn("ahmed", "1234");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.INCORRECT_PASSWORD);
    });
  });

  describe("Forgot-username services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByEmail: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              checkPassword: async (data1, data2) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.forgotUserName("");
      assert.equal(output.success, true);
    });
    it("second test(fail operation of database)", async () => {
      const UserRepository = {
        findByEmail: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.forgotUserName("");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.USER_NOT_FOUND);
    });
    it("third test(exception in mail service)", async () => {
      const UserRepository = {
        findByEmail: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              checkPassword: async (data1, data2) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
      });
      const output = await userServiceObj.forgotUserName("");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.EMAIL_ERROR);
    });
  });
  describe("Forgot-password services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByEmailAndUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              save: (password, passwordDB) => {
                return true;
              },
              createPasswordResetToken: () => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.success, true);
    });
    it("second test(success operation of database but  exception occured)", async () => {
      const UserRepository = {
        findByEmailAndUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              save: (password, passwordDB) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
      });
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.EMAIL_ERROR);
    });
    it("thrid test(fail operation of database)", async () => {
      const UserRepository = {
        getOne: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.success, false);
      assert.notEqual(output.error, userErrors.USER_NOT_FOUND);
    });
  });
  describe("reset-password services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByResetPassword: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              save: (password, passwordDB) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.resetPassword("", "");
      assert.equal(output.success, true);
      assert.notEqual(output.token, false);
    });

    it("second test(fao; operation of database)", async () => {
      const UserRepository = {
        findByResetPassword: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
          };
          return response;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.resetPassword("", "");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.INVALID_RESET_TOKEN);
    });
  });
});
describe("User Services Test", () => {
  describe("Get user preferences ", () => {
    it("test should be success", () => {
      const userServiceObj = new UserService({});
      let user = {
        canbeFollowed: true,
        nsfw: true,
        displayName: "ahmed",
        profilePicture: "img.png",
      };
      let result = userServiceObj.getPrefs(user);
      assert.equal(result.displayName, user.displayName);
      assert.equal(result.nsfw, user.nsfw);
    });
  });

  describe("Update user preferences ", async () => {
    it("test should be success", async () => {
      const UserRepository = {
        updateOne: (userData, body) => {
          const response = {
            doc: {
              canbeFollowed: false,
              nsfw: true,
              displayName: "ahmed",
              profilePicture: "img.png",
            },
          };
          return response;
        },
      };

      const userServiceObj = new UserService({
        UserRepository,
      });
      const query = {
        canbeFollowed: false,
      };

      let result = await userServiceObj.updatePrefs(query, "");
      assert.equal(result.displayName, "ahmed");
      assert.equal(result.canbeFollowed, false);
      assert.equal(result.nsfw, true);
    });
  });
});
