const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { mongoErrors, userErrors } = require("./../../error_handling/errors");
dotenv.config();
const UserService = require("./../../service/userService");

const Email = {
  sendPasswordReset: async (user, resetURL) => {
    return true;
  },
  sendUserName: async (user) => {
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
              profileBackground: {
                replace: () => {
                  return "string";
                },
              },
              profilePicture: {
                replace: () => {
                  return "string";
                },
              },
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
              profileBackground: {
                replace: () => {
                  return "string";
                },
              },
              profilePicture: {
                replace: () => {
                  return "string";
                },
              },
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

  describe("Username available", async () => {
    it("available", async () => {
      const UserRepository = {
        findByUserName: async (userName) => {
          return { success: false };
        },
      };
      const userServices = new UserService({
        UserRepository,
      });
      const available = await userServices.isAvailable("kiro");
      expect(available).to.equal(true);
    });
    it("unavailable", async () => {
      const UserRepository = {
        findByUserName: async (userName) => {
          return { success: true };
        },
      };
      const userServices = new UserService({
        UserRepository,
      });
      const available = await userServices.isAvailable("kiro");
      expect(available).to.equal(false);
    });
  });

  describe("Subscribe", async () => {
    const UserRepository = {
      push: async (id, obj) => {},
      pull: async (id, obj) => {},
    };
    const userServices = new UserService({
      UserRepository,
    });
    const userId = "123d493c3ff67d626ec994f7";
    const subredditId = "456d493c3ff67d626ec994f7";
    let action = "sub"
    it("subscribe(success)", async () => {
      action = "sub"
      UserRepository.isSubscribed = async (userName) => false
      const subscribed = await userServices.subscribe(userId, subredditId, action);
      expect(subscribed).to.equal(true);
    });
    it("subscribe(fail)", async () => {
      action = "sub"
      UserRepository.isSubscribed = async (userName) => true
      const subscribed = await userServices.subscribe(userId, subredditId, action);
      expect(subscribed).to.equal(false);
    });
    it("unsubscribe(success)", async () => {
      action = "unsub";
      UserRepository.isSubscribed = async (userName) => true
      const subscribed = await userServices.subscribe(userId, subredditId, action);
      expect(subscribed).to.equal(true);
    });
    it("unsubscribe(fail)", async () => {
      action = "unsub"
      UserRepository.isSubscribed = async (userName) => false
      const subscribed = await userServices.subscribe(userId, subredditId, action);
      expect(subscribed).to.equal(false);
    });
    it("invalid action", async () => {
      action = "not a valid action"
      const subscribed = await userServices.subscribe(userId, subredditId, action);
      expect(subscribed).to.equal(false);
    });
  });
  describe("addUserImageURL  ", () => {
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
      const userServiceObj = new UserService({ UserRepository });
      let user = {
        canbeFollowed: true,
        nsfw: true,
        displayName: "ahmed",
        profilePicture: "img.png",
        profileBackground: "img.png",
      };
      let result = await userServiceObj.addUserImageURL(
        "!",
        "profilePicture",
        "1"
      );
      assert.equal(result.displayName, user.displayName);
      assert.equal(result.nsfw, user.nsfw);
      result = await userServiceObj.addUserImageURL(
        "!",
        "profileBackground",
        "1"
      );
      assert.equal(result.displayName, user.displayName);
      assert.equal(result.nsfw, user.nsfw);
    });
  });

  describe("getSocialLinks  ", () => {
    it("test should be success", async () => {
      const SocialRepository = {
        getAll: (userData, body) => {
          const response = {
            canbeFollowed: false,
            nsfw: true,
            displayName: "ahmed",
            profilePicture: "img.png",
          };
          return response;
        },
      };
      const userServiceObj = new UserService({ SocialRepository });
      let user = {
        canbeFollowed: true,
        nsfw: true,
        displayName: "ahmed",
        profilePicture: "img.png",
        profileBackground: "img.png",
      };
      let result = await userServiceObj.getSocialLinks(
        "!",
        "profilePicture",
        "1"
      );
      assert.equal(result.displayName, user.displayName);
      assert.equal(result.nsfw, user.nsfw);
    });
  });
  describe("createSocialLinks  ", () => {
    it("test should be success", async () => {
      const SocialRepository = {
        findOne: (userData) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const UserRepository = {
        updateSocialLinks: (userData, body) => {
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
        SocialRepository,
      });
      let me = {
        socialLinks: [],
        _id: "1",
      };
      let result = await userServiceObj.createSocialLinks(
        me,
        "profilePicture",
        "1",
        "1"
      );
      assert.equal(result.success, true);
    });
    it("test should be success", async () => {
      const SocialRepository = {
        findOne: (userData) => {
          const response = {
            success: true,
          };
          return response;
        },
      };
      const UserRepository = {
        updateSocialLinks: (userData, body) => {
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
        SocialRepository,
      });
      let me = {
        socialLinks: ["1", "2", "3", "4", "5"],
        _id: "1",
      };
      let result = await userServiceObj.createSocialLinks(
        me,
        "profilePicture",
        "1",
        "1"
      );
      assert.equal(result.success, false);
      assert.equal(result.msg, "Max Links 5");
    });
    it("test should be success", async () => {
      const SocialRepository = {
        findOne: (userData) => {
          const response = {
            success: false,
          };
          return response;
        },
      };
      const UserRepository = {
        updateSocialLinks: (userData, body) => {
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
        SocialRepository,
      });
      let me = {
        socialLinks: ["1", "2", "3", "4"],
        _id: "1",
      };
      let result = await userServiceObj.createSocialLinks(
        me,
        "profilePicture",
        "1",
        "1"
      );
      assert.equal(result.success, false);
      assert.equal(result.msg, "Invalid social Id");
    });
  });
  describe("updateSocialLinks  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        socialLinks: [
          {
            _id: "1",
            userLink: "",
            displayText: "",
          },
          {
            _id: "2",
            userLink: "",
            displayText: "",
          },
        ],
        _id: "3",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.updateSocialLinks(me, "2");
      assert.equal(result.success, true);
    });
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        socialLinks: [
          {
            _id: "1",
            userLink: "",
            displayText: "",
          },
          {
            _id: "2",
            userLink: "",
            displayText: "",
          },
        ],
        _id: "3",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.updateSocialLinks(me, "5");
      assert.equal(result.success, false);
    });
  });
  describe("deleteSocialLinks  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        socialLinks: [
          {
            _id: "1",
            userLink: "",
            displayText: "",
          },
          {
            _id: "2",
            userLink: "",
            displayText: "",
          },
        ],
        _id: "3",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.deleteSocialLinks(me, "2");
      assert.equal(result.success, true);
    });
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        socialLinks: [
          {
            _id: "1",
            userLink: "",
            displayText: "",
          },
          {
            _id: "2",
            userLink: "",
            displayText: "",
          },
        ],
        _id: "3",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.deleteSocialLinks(me, "5");
      assert.equal(result.success, false);
    });
  });

  // replace profile
  describe("replaceProfile  ", () => {
    it("test should be success", () => {
      const userServiceObj = new UserService({});
      let me = {
        _id: "3",
        profileBackground: "",
        profilePicture: "http://localhost:8000/icon.png",
        save: async () => {
          return true;
        },
      };
      let result = userServiceObj.replaceProfile(me);
      assert.equal(result.profilePicture, "icon.png");
      assert.equal(result.profileBackground, me.profileBackground);
    });
  });
  // check block status

  describe("checkBlockStatus ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "2",
            status: "followed",
          },
          {
            userId: "3",
            status: "blocked",
          },
        ],
        _id: "1",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let other = {
        meUserRelationship: [
          {
            userId: "1",
            status: "followed",
          },
          {
            userId: "4",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.checkBlockStatus(me, other);
      assert.equal(result, false);
    });
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "3",
            status: "blocked",
          },
        ],
        _id: "1",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let other = {
        meUserRelationship: [
          {
            userId: "1",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.checkBlockStatus(me, other);
      assert.equal(result, true);
    });
  });


  // block user

  describe("blockUser  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "2",
            status: "followed",
          },
          {
            userId: "3",
            status: "blocked",
          },
        ],
        _id: "1",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let other = {
        userMeRelationship: [
          {
            userId: "1",
            status: "followed",
          },
          {
            userId: "4",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.blockUser(me, other);
      assert.equal(result, true);
      assert.equal(me.meUserRelationship[0].status, "blocked");
      assert.equal(other.userMeRelationship[0].status, "blocked");
    });
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "3",
            status: "blocked",
          },
        ],
        _id: "1",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let other = {
        userMeRelationship: [
          {
            userId: "4",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.blockUser(me, other);
      assert.equal(result, true);
      assert.equal(me.meUserRelationship[1].status, "blocked");
      assert.equal(other.userMeRelationship[2].status, "blocked");
    });
  });

  // unblock user
  describe("unBlockUser  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "2",
            status: "blocked",
          },
          {
            userId: "3",
            status: "blocked",
          },
        ],
        _id: "1",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let other = {
        userMeRelationship: [
          {
            userId: "1",
            status: "blocked",
          },
          {
            userId: "4",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.unBlockUser(me, other);
      assert.equal(result, true);
      assert.equal(me.meUserRelationship[0].status, "none");
      assert.equal(other.userMeRelationship[0].status, "none");
    });
  });
});
