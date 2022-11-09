const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const UserService = require("./../../service/userService");

const emailServiceObj = {
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
      const RepositoryObj = {
        createOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 201,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.signUp("", "", "");
      assert.equal(output.status, 201);
      assert.notEqual(output.body.token, false);
    });
    it("second test(fail operation of database)", async () => {
      const RepositoryObj = {
        createOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 400,
            err: "mongoose err",
          };
          return response;
        },
      };

      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.signUp("", "", "");
      assert.equal(output.status, 400);
      assert.equal(output.body.errorMessage, "User already Exists");
    });
  });

  describe("Log-in services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 201,
            doc: {
              _id: "1",
              checkPassword: (password, passwordDB) => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.logIn("", "");
      assert.equal(output.status, 200);
      assert.notEqual(output.body.token, false);
    });
    it("second test(success operation of database but wrong password)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 201,
            doc: {
              _id: "1",
              checkPassword: (password, passwordDB) => {
                return false;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.logIn("", "");
      assert.equal(output.status, 400);
      assert.notEqual(output.body.token, true);
    });
    it("thrid test(fail operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 400,
            err: "mongoose err",
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.logIn("", "");
      //console.log(output);
      assert.equal(output.status, 400);
      assert.notEqual(output.body.token, true);
    });
  });

  describe("Forgot-username services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.forgotUserName("");
      assert.equal(output.status, 204);
    });
    it("secone test(fao; operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 404,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.forgotUserName("");
      assert.equal(output.status, 404);
    });
  });
  describe("Forgot-password services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
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
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.status, 204);
    });
    it("second test(success operation of database but  exception occured)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
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
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.status, 400);
    });
    it("thrid test(fao; operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 404,
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
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.forgotPassword("", "");
      assert.equal(output.status, 404);
      assert.notEqual(output.body.token, false);
    });
  });
  describe("reset-password services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
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
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.resetPassword("", "");
      assert.equal(output.status, 200);
    });

    it("second test(fao; operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 404,
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
      const userServiceObj = new UserService(
        "",
        RepositoryObj,
        emailServiceObj
      );
      const output = await userServiceObj.resetPassword("", "");
      assert.equal(output.status, 400);
      assert.notEqual(output.body.token, false);
    });
  });
});
describe("User Services Test", () => {
  describe("Get user preferences ", () => {
    it("test should be success", () => {
      const userServiceObj = new UserService("", "", "");
      let user = {
        contentVisibility: true,
        canbeFollowed: true,
        nsfw: true,
        allowInboxMessage: true,
        allowMentions: true,
        allowCommentsOnPosts: true,
        allowUpvotesOnComments: true,
        allowUpvotesOnPosts: true,
        displayName: "ahmed",
        profilePicture: "img.png",
      };
      let result = userServiceObj.getPrefs(user);
      assert.equal(result.contentvisibility, user.contentvisibility);
      assert.equal(result.displayName, user.displayName);
      assert.equal(result.allowUpvotesOnComments, user.allowUpvotesOnComments);
      assert.equal(result.nsfw, user.nsfw);
    });
  });

  describe("Update user preferences ", async () => {
    it("test should be success", async () => {
      const RepositoryObj = {
        updateOne: (userData, body) => {
          const response = {
            doc: {
              contentVisibility: false,
              canbeFollowed: false,
              nsfw: true,
              allowInboxMessage: true,
              allowMentions: true,
              allowCommentsOnPosts: true,
              allowUpvotesOnComments: true,
              allowUpvotesOnPosts: true,
              displayName: "ahmed",
              profilePicture: "img.png",
            },
          };
          return response;
        },
      };

      const userServiceObj = new UserService("", RepositoryObj, "");
      const query = {
        contentVisibility: false,
        canbeFollowed: false,
      };

      let result = await userServiceObj.updatePrefs(query, "");
      expect(result.contentVisibility).to.equal(false);
      assert.equal(result.contentVisibility, false);
      assert.equal(result.displayName, "ahmed");
      assert.equal(result.canbeFollowed, false);
      assert.equal(result.nsfw, true);
    });
  });
});
