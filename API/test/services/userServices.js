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
  sendVerificationMail: async (user) => {
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
        findByEmailAndUserName: (userData) => {
          const response = {
            success: false,
            error: mongoErrors.NOT_FOUND,
            msg: "",
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
      assert.equal(output.error, userErrors.USER_NOT_FOUND);
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
        findByName: async (userName) => {
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
        findByName: async (userName) => {
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
    let action = "sub";
    // it("subscribe(success)", async () => {
    //   action = "sub"
    //   UserRepository.isSubscribed = async (userName) => false
    //   const subscribed = await userServices.subscribe(userId, subredditId, action);
    //   expect(subscribed).to.equal(true);
    // });
    it("subscribe(fail)", async () => {
      action = "sub";
      UserRepository.isSubscribed = async (userName) => true;
      const subscribed = await userServices.subscribe(
        userId,
        subredditId,
        action
      );
      expect(subscribed).to.equal(false);
    });
    // it("unsubscribe(success)", async () => {
    //   action = "unsub";
    //   UserRepository.isSubscribed = async (userName) => true
    //   const subscribed = await userServices.subscribe(userId, subredditId, action);
    //   expect(subscribed).to.equal(true);
    // });
    it("unsubscribe(fail)", async () => {
      action = "unsub";
      UserRepository.isSubscribed = async (userName) => false;
      const subscribed = await userServices.subscribe(
        userId,
        subredditId,
        action
      );
      expect(subscribed).to.equal(false);
    });
    it("invalid action", async () => {
      action = "not a valid action";
      const subscribed = await userServices.subscribe(
        userId,
        subredditId,
        action
      );
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
      let result = await userServiceObj.updateSocialLinks(me, "2", true, true);
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
      let result = await userServiceObj.updateSocialLinks(me, "5", true, true);
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
        profilePicture: `${process.env.BACKDOMAIN}/icon.png`,
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
        userMeRelationship: [
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
        userMeRelationship: [
          {
            userId: "3",
            status: "none",
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
        meUserRelationship: [
          {
            userId: "3",
            status: "none",
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

  // follow user

  describe("followUser  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "4",
            status: "followed",
          },
          {
            userId: "3",
            status: "blocked",
          },
        ],
        userMeRelationship: [
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
            userId: "4",
            status: "blocked",
          },
          {
            userId: "5",
            status: "blocked",
          },
        ],
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
      let result = await userServiceObj.followUser(me, other);
      assert.equal(result, false);
      assert.equal(me.meUserRelationship[0].status, "followed");
      assert.equal(other.userMeRelationship[2].status, "followed");
    });
    it("test2 should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "2",
            status: "followed",
          },
        ],
        userMeRelationship: [
          {
            userId: "3",
            status: "none",
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
            userId: "5",
            status: "blocked",
          },
        ],
        meUserRelationship: [
          {
            userId: "3",
            status: "none",
          },
        ],
        _id: "2",
        profileBackground: "",
        profilePicture: "",
        save: async () => {
          return true;
        },
      };
      let result = await userServiceObj.followUser(me, other);
      assert.equal(result, true);
    });
  });

  // unblock user
  describe("unFollowUser  ", () => {
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
      let result = await userServiceObj.unfollowUser(me, other);
      assert.equal(result, false);
      assert.equal(me.meUserRelationship[0].status, "none");
      assert.equal(other.userMeRelationship[0].status, "none");
    });

    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let me = {
        meUserRelationship: [
          {
            userId: "5",
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
      let result = await userServiceObj.unfollowUser(me, other);
      assert.equal(result, true);
    });
  });

  describe("generateRandomPassword  ", () => {
    it("test should be success", () => {
      const userServiceObj = new UserService({});
      let result = userServiceObj.generateRandomPassword();
      assert.notEqual(result, false);
    });
  });
  describe("checkPasswordStrength  ", () => {
    it("test should be success", () => {
      const userServiceObj = new UserService({});
      let result = userServiceObj.checkPasswordStrength("Aa123456*");
      assert.equal(result, "Medium");
    });
  });

  describe("sendVerificationToken  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({ Email });
      let user = {
        profileBackground: "",
        profilePicture: "",
        createVerificationToken: () => {
          return "token";
        },
        save: async () => {
          return true;
        },
      };

      let result = await userServiceObj.sendVerificationToken(user);
      assert.equal(result.success, true);
    });

    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let user = {
        profileBackground: "",
        profilePicture: "",
        createVerificationToken: () => {
          return "token";
        },
        save: async () => {
          return true;
        },
      };

      let result = await userServiceObj.sendVerificationToken(user);
      assert.equal(result.success, false);
    });
  });

  describe("changePassword  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let user = {
        _id: "1",
        save: async () => {
          return true;
        },
      };

      let result = await userServiceObj.changePassword(user);
      assert.notEqual(result, false);
    });
  });
  describe("deleteAccount  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      let user = {
        _id: "1",
        save: async () => {
          return true;
        },
      };

      let result = await userServiceObj.deleteAccount(user);
      assert.equal(result, true);
    });
  });
  describe("decodeToken  ", () => {
    it("test should be success", async () => {
      const userServiceObj = new UserService({});
      token = userServiceObj.createToken("1");
      let result = await userServiceObj.decodeToken(token);
      assert.notEqual(result, false);
    });
  });
  describe("verifyEmailToken services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByVerificationToken: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.verifyEmailToken("ahmed");
      assert.equal(output.success, true);
      assert.notEqual(output.token, false);
    });
    it("second test success", async () => {
      const UserRepository = {
        findByVerificationToken: (userData) => {
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
      const output = await userServiceObj.verifyEmailToken("token");
      assert.equal(output.success, false);
      assert.equal(output.error, userErrors.INVALID_RESET_TOKEN);
    });
  });

  describe("getUser services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findById: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.getUser("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
      const UserRepository = {
        findById: (userData) => {
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
      const output = await userServiceObj.getUser("token");
      assert.equal(output.success, false);
    });
  });

  describe("getUserWithFollowers services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findById: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.getUserWithFollowers("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
      const UserRepository = {
        findById: (userData) => {
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
      const output = await userServiceObj.getUserWithFollowers("token");
      assert.equal(output.success, false);
    });
  });

  describe("getUserByEmail services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByEmail: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.getUserByEmail("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
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
      const output = await userServiceObj.getUserByEmail("token");
      assert.equal(output.success, false);
    });
  });

  describe("getUserByName services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.getUserByName("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
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
      const output = await userServiceObj.getUserByName("token");
      assert.equal(output.success, false);
    });
  });

  describe("checkPassword  ", () => {
    it("test should be success", async () => {
      const UserRepository = {
        findByUserName: (userData) => {
          const response = {
            success: true,
            doc: {
              checkPassword: async () => {
                return true;
              },
            },
          };
          return response;
        },
      };
      const userServiceObj = new UserService({ UserRepository });
      let result = await userServiceObj.checkPassword(token);
      assert.equal(result, true);
    });
  });

  describe("updateUserEmail services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        updateEmailById: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.updateUserEmail("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
      const UserRepository = {
        updateEmailById: (userData) => {
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
      const output = await userServiceObj.updateUserEmail("token");
      assert.equal(output.success, false);
    });
  });

  describe("checkResetTokenTime services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        findByResetPassword: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.checkResetTokenTime("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
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
      const output = await userServiceObj.checkResetTokenTime("token");
      assert.equal(output.success, false);
    });
  });

  describe("about services Test", () => {
    it("first test (success operation of database)", async () => {
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
        userMeRelationship: [
          {
            userId: "2",
            status: "followed",
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
        _id: "2",
        userName: "",
        profilePicture: "",
        profileBackground: "",
        canbeFollowed: 0,
        followersCount: 0,
        friendsCount: 0,
        gender: "",
        displayName: "",
        postKarma: 0,
        commentKarma: 0,
        description: "",
        createdAt: "",
        nsfw: true,
        autoplayMedia: true,
        adultContent: true,
        isFollowed: true,
        country: "",
        socialLinks: [],
        isBlocked: false,
      };

      const userServiceObj = new UserService({});
      const output = await userServiceObj.about(me, other);
      assert.equal(output.profileBackground, "");
      assert.equal(output.isBlocked, false);
      assert.equal(output.isFollowed, true);
    });
    it("second test success", async () => {
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
        userMeRelationship: [
          {
            userId: "2",
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
        _id: "2",
        userName: "",
        profilePicture: `${process.env.BACKDOMAIN}/users/default.png`,
        profileBackground: `${process.env.BACKDOMAIN}/users/defaultcover.png`,
        canbeFollowed: 0,
        followersCount: 0,
        friendsCount: 0,
        gender: "",
        displayName: "",
        postKarma: 0,
        commentKarma: 0,
        description: "",
        createdAt: "",
        nsfw: true,
        autoplayMedia: true,
        adultContent: true,
        isFollowed: false,
        country: "",
        socialLinks: [],
        isBlocked: true,
      };

      const userServiceObj = new UserService({});
      const output = await userServiceObj.about(me, other);
      assert.equal(
        output.profileBackground,
        `${process.env.BACKDOMAIN}/users/defaultcover.png`
      );
      assert.equal(output.isBlocked, false);
      assert.equal(output.isFollowed, false);
    });
    it("thrid test (success operation of database)", async () => {
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
        userMeRelationship: [
          {
            userId: "2",
            status: "followed",
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
        _id: "2",
        userName: "",
        profilePicture: "",
        profileBackground: "",
        canbeFollowed: 0,
        followersCount: 0,
        friendsCount: 0,
        gender: "",
        displayName: "",
        postKarma: 0,
        commentKarma: 0,
        description: "",
        createdAt: "",
        nsfw: true,
        autoplayMedia: true,
        adultContent: true,
        isFollowed: false,
        country: "",
        socialLinks: [],
        isBlocked: true,
      };

      const userServiceObj = new UserService({});
      const output = await userServiceObj.about(me, other);
      assert.equal(output.profileBackground, "");
      assert.equal(output.isBlocked, true);
      assert.equal(output.isFollowed, false);
    });
  });

  describe("saveFirebaseToken services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        addTokenToUser: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.saveFirebaseToken("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
      const UserRepository = {
        addTokenToUser: (userData) => {
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
      const output = await userServiceObj.saveFirebaseToken("token");
      assert.equal(output.success, false);
    });
  });

  describe("getFirebaseToken services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        getFirebaseToken: (userData) => {
          const response = {
            success: true,
            doc: {
              _id: "1",
              password: "Aa1234*",
              profileBackground: "",
              profilePicture: "",
              save: async (data1, data2) => {
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
      const output = await userServiceObj.getFirebaseToken("ahmed");
      assert.equal(output.success, true);
    });
    it("second test success", async () => {
      const UserRepository = {
        getFirebaseToken: (userData) => {
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
      const output = await userServiceObj.getFirebaseToken("token");
      assert.equal(output.success, false);
    });
  });

  describe("getBlockedUsers services Test", () => {
    it("first test (success operation of database)", async () => {
      const UserRepository = {
        getBlocked: (userData) => {
          const users = [
            {
              status: "blocked",
              userId: {
                _id: "1",
                profileBackground: "",
                profilePicture: "",
                userName: "ahmed",
                postKarma: 0,
                commentKarma: 0,
              },
            },
            {
              status: "followed",
              userId: {
                _id: "2",
                profileBackground: "",
                profilePicture: "",
                userName: "mohamed",
                postKarma: 0,
                commentKarma: 0,
              },
            },
          ];

          return users;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.getBlockedUsers("ahmed");
      assert.equal(output.length, 1);
      assert.equal(output[0].userName, "ahmed");
    });
  });
  describe("getFollowers services Test", () => {
    it("first test (success operation of database)", async () => {
      let me = {
        meUserRelationship: [
          {
            userId: "2",
            status: "followed",
          },
        ],
      };
      const UserRepository = {
        getFollowers: (userData) => {
          const users = [
            {
              status: "blocked",
              userId: {
                _id: "1",
                profileBackground: "",
                profilePicture: "",
                userName: "ahmed",
                postKarma: 0,
                commentKarma: 0,
              },
            },
            {
              status: "followed",
              userId: {
                _id: "2",
                profileBackground: "",
                profilePicture: "",
                userName: "mohamed",
                postKarma: 0,
                commentKarma: 0,
              },
            },
          ];

          return users;
        },
      };
      const userServiceObj = new UserService({
        UserRepository,
        Email,
      });
      const output = await userServiceObj.getFollowers(me);
      assert.equal(output.length, 1);
      assert.equal(output[0].userName, "mohamed");
    });
  });
});
