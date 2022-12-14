const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const UserController = require("./../../controllers/UserController");
const { userErrors } = require("./../../error_handling/errors");
dotenv.config();
chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("User Controller Test", () => {
  describe("get me Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          userName: "ahmed",
          email: "ahmed@gmail.com",
          profilePicture: "",
          profileBackground: "",
          canbeFollowed: true,
          lastUpdatedPassword: "",
          followersCount: 0,
          friendsCount: 0,
          accountActivated: false,
          gender: "male",
          displayName: "ahmed",
          postKarma: 1,
          commentKarma: 1,
          joinDate: "",
          description: "",
          adultContent: false,
          nsfw: false,
          country: "egypt",
          socialLinks: [],
        },
      };
      const userController = new UserController({});
      await userController.getMe(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        user: {
          id: "1",
          userName: "ahmed",
          email: "ahmed@gmail.com",
          profilePicture: "",
          profileBackground: "",
          canbeFollowed: true,
          lastUpdatedPassword: "",
          followersCount: 0,
          friendsCount: 0,
          accountActivated: false,
          gender: "male",
          displayName: "ahmed",
          postKarma: 1,
          commentKarma: 1,
          createdAt: "",
          description: "",
          adultContent: false,
          nsfw: false,
          country: "egypt",
          socialLinks: [],
        },
      });
    });
  });

  describe("get preferences Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmedAgmail.com",
          userName: "ahmed",
          canbeFollowed: true,
          nsfw: false,
          gender: "male",
          adultContent: false,
          autoplayMedia: true,
          displayName: "Ahmed Sabry",
          profilePicture: "icon.png",
          profileBackground: "icon.png",
          description: "",
          country: "egypt",
          socialLinks: [],
        },
      };
      const UserService = {
        getPrefs: (user) => {
          let response = {
            canbeFollowed: true,
            nsfw: false,
            gender: "male",
            adultContent: false,
            autoplayMedia: true,
            displayName: "Ahmed Sabry",
            profilePicture: "icon.png",
            profileBackground: "icon.png",
            description: "",
            country: "egypt",
            socialLinks: [],
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.getPrefs(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        prefs: {
          canbeFollowed: true,
          nsfw: false,
          gender: "male",
          adultContent: false,
          autoplayMedia: true,
          displayName: "Ahmed Sabry",
          profilePicture: "icon.png",
          profileBackground: "icon.png",
          description: "",
          country: "egypt",
          socialLinks: [],
        },
      });
    });
  });

  describe("update preferences Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          email: "ahmedAgmail.com",
          userName: "ahmed",
          canbeFollowed: true,
          nsfw: false,
          gender: "male",
          adultContent: false,
          autoplayMedia: true,
          displayName: "Ahmed Sabry",
          profilePicture: "icon.png",
          profileBackground: "icon.png",
          description: "",
          country: "egypt",
          socialLinks: [],
        },
      };
      const UserService = {
        updatePrefs: (user) => {
          let response = {
            canbeFollowed: false,
            nsfw: false,
            gender: "male",
            adultContent: false,
            autoplayMedia: true,
            displayName: "Ahmed Sabry",
            profilePicture: "icon.png",
            profileBackground: "icon.png",
            description: "",
            country: "egypt",
            socialLinks: [],
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.updatePrefs(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        prefs: {
          canbeFollowed: false,
          nsfw: false,
          gender: "male",
          adultContent: false,
          autoplayMedia: true,
          displayName: "Ahmed Sabry",
          profilePicture: "icon.png",
          profileBackground: "icon.png",
          description: "",
          country: "egypt",
          socialLinks: [],
        },
      });
    });
  });

  describe("about user Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          meUserRelationship: [
            { userId: "1", status: "followed" },
            { userId: "2", status: "followed" },
            { userId: "3", status: "followed" },
          ],
        },
        params: {
          userName: "name",
        },
      };
      const UserService = {
        getUserByName: (user) => {
          let response = {
            success: true,
            data: {
              _id: "2",
              userName: "mohamed",
              profilePicture: "",
              profileBackground: "",
              canbeFollowed: true,
              followersCount: 0,
              friendsCount: 0,
              gender: "male",
              displayName: "mohamed",
              postKarma: 1,
              commentKarma: 2,
              description: "",
              joinDate: "",
              nsfw: false,
              autoplayMedia: false,
              adultContent: false,
              adultContent: false,
              country: "egypt",
              socialLinks: [],
            },
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.about(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        user: {
          id: "2",
          userName: "mohamed",
          profilePicture: "",
          profileBackground: "",
          canbeFollowed: true,
          followersCount: 0,
          friendsCount: 0,
          gender: "male",
          displayName: "mohamed",
          postKarma: 1,
          commentKarma: 2,
          description: "",
          createdAt: "",
          nsfw: false,
          autoplayMedia: false,
          adultContent: false,
          country: "egypt",
          isFollowed: true,
          socialLinks: [],
        },
      });
    });
    it("second test fail username not found", async () => {
      const req = {
        user: {
          _id: "1",
          meUserRelationship: [
            { userId: "1", status: "followed" },
            { userId: "2", status: "followed" },
            { userId: "3", status: "followed" },
          ],
        },
        params: {
          userName: "name",
        },
      };
      const UserService = {
        getUserByName: (user) => {
          let response = {
            success: false,
            error: userErrors.USER_NOT_FOUND,
            msg: "User Not Found",
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.about(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });

    it("thrid test not followed", async () => {
      const req = {
        user: {
          _id: "1",
          meUserRelationship: [
            { userId: "1", status: "followed" },
            { userId: "2", status: "followed" },
            { userId: "3", status: "followed" },
          ],
        },
        params: {
          userName: "name",
        },
      };
      const UserService = {
        getUserByName: (user) => {
          let response = {
            success: true,
            data: {
              _id: "6",
              userName: "mohamed",
              profilePicture: "",
              profileBackground: "",
              canbeFollowed: true,
              followersCount: 0,
              friendsCount: 0,
              gender: "male",
              displayName: "mohamed",
              postKarma: 1,
              commentKarma: 2,
              description: "",
              joinDate: "",
              nsfw: false,
              autoplayMedia: false,
              adultContent: false,
              country: "egypt",
              socialLinks: [],
            },
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.about(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        user: {
          id: "6",
          userName: "mohamed",
          profilePicture: "",
          profileBackground: "",
          canbeFollowed: true,
          followersCount: 0,
          friendsCount: 0,
          gender: "male",
          displayName: "mohamed",
          postKarma: 1,
          commentKarma: 2,
          description: "",
          createdAt: "",
          nsfw: false,
          autoplayMedia: false,
          adultContent: false,
          country: "egypt",
          isFollowed: false,
          socialLinks: [],
        },
      });
    });
  });

  describe("UsernameAvailable Test", () => {
    const req = {
      query: {
        userName: "kiro",
      },
    };
    const UserService = {};
    const userController = new UserController({ UserService });

    it("available", async () => {
      UserService.isAvailable = async (userName) => true;
      await userController.usernameAvailable(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        available: true,
      });
    });

    it("unavailable", async () => {
      UserService.isAvailable = async (userName) => false;
      await userController.usernameAvailable(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        available: false,
      });
    });

    it("Invalid request", async () => {
      delete req.query;
      await userController.usernameAvailable(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "userName query paramater is required",
      });
    });
  });

  describe("getSocialLinks Test", () => {
    it("first test success", async () => {
      const req = {};
      const UserService = {
        getSocialLinks: () => {
          let socialLinks = [
            {
              _id: "1",
              check: "https://facebook.com/",
              placeholderLink: "https://facebook.com",
              baseLink: "https://facebook.com/",
              type: "facebook",
            },
          ];
          return socialLinks;
        },
      };
      const userController = new UserController({ UserService });
      await userController.getSocialLinks(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        socialLinks: [
          {
            _id: "1",
            check: "https://facebook.com/",
            placeholderLink: "https://facebook.com",
            baseLink: "https://facebook.com/",
            type: "facebook",
          },
        ],
      });
    });
  });
  describe("addSocialLink Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
          socialId: "",
        },
      };
      const UserService = {
        createSocialLinks: (me, displayText, userLink, socialId) => {
          let response = {
            success: true,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.addSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(201);
      expect(res.status(201).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test bad request", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
        },
      };
      const UserService = {
        createSocialLinks: (me, displayText, userLink, socialId) => {
          let response = {
            success: true,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.addSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide displayText , userLink and socialId ",
      });
    });

    it("thrid test bad request", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
          socialId: "",
        },
      };
      const UserService = {
        createSocialLinks: (me, displayText, userLink, socialId) => {
          let response = {
            success: false,
            msg: "error",
            error: 8,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.addSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "error",
      });
    });
    it("fourth test not found", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
          socialId: "",
        },
      };
      const UserService = {
        createSocialLinks: (me, displayText, userLink, socialId) => {
          let response = {
            success: false,
            msg: "error",
            error: 9,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.addSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "error",
      });
    });
  });

  describe("updateSocialLink Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
        },
        user: {},
        params: {
          id: "1",
        },
      };
      const UserService = {
        updateSocialLinks: () => {
          let response = {
            success: true,
            socialLinks: [
              {
                _id: "1",
                check: "https://facebook.com/",
                placeholderLink: "https://facebook.com",
                baseLink: "https://facebook.com/",
                type: "facebook",
              },
            ],
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.updateSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        socialLinks: [
          {
            _id: "1",
            check: "https://facebook.com/",
            placeholderLink: "https://facebook.com",
            baseLink: "https://facebook.com/",
            type: "facebook",
          },
        ],
      });
    });
    it("second test fail", async () => {
      const req = {
        body: {},
        user: {},
        params: {
          id: "1",
        },
      };
      const UserService = {
        updateSocialLinks: () => {
          let response = {
            success: true,
            socialLinks: [
              {
                _id: "1",
                check: "https://facebook.com/",
                placeholderLink: "https://facebook.com",
                baseLink: "https://facebook.com/",
                type: "facebook",
              },
            ],
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.updateSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide displayText or userLink.",
      });
    });

    it("thrid test fail", async () => {
      const req = {
        body: {
          displayText: "",
          userLink: "",
        },
        user: {},
        params: {
          id: "1",
        },
      };
      const UserService = {
        updateSocialLinks: () => {
          let response = {
            success: false,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.updateSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "socialLink id not found",
      });
    });
  });

  describe("deleteSocialLink Test", () => {
    it("first test success", async () => {
      const req = {
        user: {},
        params: {
          id: "1",
        },
      };
      const UserService = {
        deleteSocialLinks: (me, id) => {
          let response = {
            success: true,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.deleteSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(204);
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test fail", async () => {
      const req = {
        user: {},
        params: {
          id: "1",
        },
      };
      const UserService = {
        deleteSocialLinks: () => {
          let response = {
            success: false,
          };
          return response;
        },
      };
      const userController = new UserController({ UserService });
      await userController.deleteSocialLink(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invalid Social id",
      });
    });
  });

  describe("blockUser Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (!me.test) {
            return true;
          } else {
            return false;
          }
        },
        blockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.blockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        blockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.blockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(405);
      expect(res.status(405).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Method Not Allowed",
      });
    });
    it("thrid test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: false,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          }
          return false;
        },
        blockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.blockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(304);
      expect(res.status(304).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("fourth test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: false,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        blockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.blockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
    it("fifth test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "2",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: false,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        blockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.blockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Try Blocking yourself",
      });
    });
  });

  describe("unBlockUser Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (!me.test) {
            return true;
          } else {
            return false;
          }
        },
        unBlockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.unBlockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        unBlockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.unBlockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(405);
      expect(res.status(405).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Method Not Allowed",
      });
    });
    it("thrid test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: false,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: true,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          }
          return false;
        },
        unBlockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.unBlockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(304);
      expect(res.status(304).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("fourth test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "1",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: false,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        unBlockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.unBlockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
    it("fifth test fail", async () => {
      const req = {
        user: {
          userName: "2",
          test: true,
        },
        params: {
          userName: "2",
        },
      };
      const UserService = {
        getUserByName: async (data) => {
          let response = {
            success: false,
            data: {
              test: true,
            },
          };
          return response;
        },
        checkBlockStatus: async (me, data) => {
          if (me.test) {
            return true;
          } else {
            return false;
          }
        },
        unBlockUser: async (me, data) => {
          return true;
        },
      };
      const userController = new UserController({ UserService });
      await userController.unBlockUser(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Try Blocking yourself",
      });
    });
  });
});

// describe("User Controller Test", () => {
//   describe("get preferences Test", () => {
//     it("first test success", (done) => {
//       seeder().then(() => {
//         request(app)
//           .post("/api/v1/users/login")
//           .send({
//             userName: "Ahmed",
//             password: "12345678",
//           })
//           .then((res1) => {
//             assert.equal(res1.body.status, "success");
//             request(app)
//               .get("/api/v1/users/me/prefs")
//               .set("Cookie", res1.header["set-cookie"])
//               .send()
//               .then((res) => {
//                 assert.equal(res.body.status, "success");
//                 assert.equal(res.body.prefs.canbeFollowed, true);
//                 done();
//               });
//           })
//           .catch((err) => {
//             done(err);
//           });
//       });
//     });
//     describe("update preferences Test", () => {
//       it("first test success", (done) => {
//         request(app)
//           .post("/api/v1/users/login")
//           .send({
//             userName: "Ahmed",
//             password: "12345678",
//           })
//           .then((res1) => {
//             assert.equal(res1.body.status, "success");
//             request(app)
//               .patch("/api/v1/users/me/prefs")
//               .set("Cookie", res1.header["set-cookie"])
//               .send({
//                 canbeFollowed: false,
//               })
//               .then((res) => {
//                 //console.log(res.body);
//                 assert.equal(res.body.status, "success");
//                 assert.equal(res.body.prefs.canbeFollowed, false);
//                 done();
//               });
//           })
//           .catch((err) => {
//             done(err);
//           });
//       });
//       it("second test (try update password)", (done) => {
//         request(app)
//           .post("/api/v1/users/login")
//           .send({
//             userName: "Ahmed",
//             password: "12345678",
//           })
//           .then((res1) => {
//             assert.equal(res1.body.status, "success");
//             request(app)
//               .patch("/api/v1/users/me/prefs")
//               .set("Cookie", res1.header["set-cookie"])
//               .send({
//                 allowUpvotesOnPosts: false,
//                 password: "12345",
//               })
//               .then((res) => {
//                 assert.equal(res.body.status, "success");
//                 assert.equal(res.body.prefs.allowUpvotesOnPosts, false);
//                 request(app)
//                   .post("/api/v1/users/login")
//                   .send({
//                     userName: "Ahmed",
//                     password: "12345678",
//                   })
//                   .then((res2) => {
//                     assert.equal(res2.body.status, "success");
//                     done();
//                   });
//               });
//           })
//           .catch((err) => {
//             done(err);
//           });
//       });
//     });
//   });
//   describe("about user Test", () => {
//     it("first test success", (done) => {
//       request(app)
//         .post("/api/v1/users/login")
//         .send({
//           userName: "Ahmed",
//           password: "12345678",
//         })
//         .then((res1) => {
//           assert.equal(res1.body.status, "success");
//           request(app)
//             .get("/api/v1/users/khaled/about")
//             .set("Cookie", res1.header["set-cookie"])
//             .send()
//             .then((res) => {
//               assert.equal(res.body.status, "success");
//               assert.equal(res.body.user.userName, "khaled");
//               done();
//             });
//         })
//         .catch((err) => {
//           done(err);
//         });
//     });
//   });
//   describe("me Test", () => {
//     it("first test success", (done) => {
//       request(app)
//         .post("/api/v1/users/login")
//         .send({
//           userName: "Ahmed",
//           password: "12345678",
//         })
//         .then((res1) => {
//           assert.equal(res1.body.status, "success");
//           request(app)
//             .get("/api/v1/users/me/")
//             .set("Cookie", res1.header["set-cookie"])
//             .send()
//             .then((res) => {
//               assert.equal(res.body.status, "success");
//               assert.equal(res.body.user.userName, "Ahmed");
//               assert.equal(res.body.user.password, undefined);
//               done();
//             });
//         })
//         .catch((err) => {
//           done(err);
//         });
//     });
//   });

//   describe("username_available test", () => {
//     it("username is avilable", async () => {
//       res = await request(app).post("/api/v1/users/login").send({
//         userName: "kirollos",
//         email: "kirollos@gmail.com",
//         password: "12345678",
//       });

//       res = await request(app)
//         .get("/api/v1/users/username_available?userName=kirollos")
//         .set("Cookie", res.header["set-cookie"])
//         .send();
//       expect(res.status).to.equal(200);
//       expect(res._body.available).to.equal(false);
//     });

//     it("username is not avilable", async () => {
//       res = await request(app).post("/api/v1/users/login").send({
//         userName: "kirollos",
//         email: "kirollos@gmail.com",
//         password: "12345678",
//       });

//       res = await request(app)
//         .get("/api/v1/users/username_available?userName=kiro")
//         .set("Cookie", res.header["set-cookie"])
//         .send();
//       expect(res.status).to.equal(200);
//       expect(res._body.available).to.equal(true);
//     });
//   });
// });
