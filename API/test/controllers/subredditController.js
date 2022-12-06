const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");

const SubredditController = require("./../../controllers/subredditController");
const { subredditErrors } = require("./../../error_handling/errors");
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

describe("Subreddit Controller Test", () => {
  describe("Create Subreddit Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          fixedName: "Subreddit name",
          type: "Public",
          nsfw: true,
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        createSubreddit: async (data, userName, profilePicture) => {
          const response = {
            success: true,
            data: { _id: "10" },
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.createSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        id: "10",
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        body: {
          type: "Public",
          nsfw: true,
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        createSubreddit: async (data, userName, profilePicture) => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.createSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invalid request",
      });
    });

    //********************************************** */
    it("third test fail", async () => {
      const req = {
        body: {},
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        createSubreddit: async (data, userName, profilePicture) => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.createSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invalid request",
      });
    });

    //****************************************************************** */

    it("fourth test fail", async () => {
      const req = {
        body: {
          fixedName: "Subreddit name",
          type: "Public",
          nsfw: true,
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        createSubreddit: async (data, userName, profilePicture) => {
          const response = {
            success: false,
            error: subredditErrors.ALREADY_EXISTS,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.createSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "This name is already taken",
      });
    });

    it("fifth test fail", async () => {
      const req = {
        body: {
          fixedName: "k",
          type: "Public",
          nsfw: true,
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        createSubreddit: async (data, userName, profilePicture) => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
            msg: "Invalid data: A subreddit name must have more or equal then 2 characters",
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.createSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage:
          "Invalid data: A subreddit name must have more or equal then 2 characters",
      });
    });
  });
  // ! **********************************************************************
  describe("get Subreddit Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        retrieveSubreddit: async (userId, name, checkOnly) => {
          const response = {
            success: true,
            data: { _id: "10", fixedName: "Subreddit name" },
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.getSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        data: {
          _id: "10",
          fixedName: "Subreddit name",
        },
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        retrieveSubreddit: async (userId, name, checkOnly) => {
          const response = {
            success: false,
            error: subredditErrors.SUBREDDIT_NOT_FOUND,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.getSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Subreddit not found",
      });
    });
    //********************************* */
    it("third test fail", async () => {
      const req = {
        params: {},
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        retrieveSubreddit: async (userId, name, checkOnly) => {
          const response = {
            success: false,
            errorMessage: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.getSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
    });
  });
  //! ********************************************************
  describe("delete Subreddit Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        deleteSubreddit: async (subredditName, userId) => {
          const response = {
            success: true,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.deleteSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(204);
      expect(res.status(204).json).to.have.been.calledWith({
        status: "success",
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        params: {},
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        deleteSubreddit: async (subredditName, userId) => {
          const response = {
            success: false,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.deleteSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
    });
    // ********************************************************
    it("third test fail", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        deleteSubreddit: async (subredditName, userId) => {
          const response = {
            success: false,
            error: subredditErrors.SUBREDDIT_NOT_FOUND,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.deleteSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Subreddit not found",
      });
    });
    it("fourth test fail", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        deleteSubreddit: async (subredditName, userId) => {
          const response = {
            success: false,
            error: subredditErrors.NOT_OWNER,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.deleteSubreddit(req, res);
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status(401).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "you are not the owner to this subreddit",
      });
    });
  });
  //! ********************************************************

  describe("update Subreddit Test", () => {
    it("first test success", async () => {
      const req = {
        body: {
          nsfw: false,
        },
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        updateSubreddit: async (subredditName, userId, data) => {
          const response = {
            success: true,
            data: {
              fixedName: "Subreddit name",
              nsfw: false,
            },
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.updateSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        data: {
          fixedName: "Subreddit name",
          nsfw: false,
        },
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        body: {
          nsfw: false,
        },
        params: {},
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        updateSubreddit: async (subredditName, userId, data) => {
          const response = {
            success: false,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.updateSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
    });
    //*********************************** */
    it("third test fail", async () => {
      const req = {
        body: {
          nsfw: false,
        },
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        updateSubreddit: async (subredditName, userId, data) => {
          const response = {
            success: false,
            error: subredditErrors.SUBREDDIT_NOT_FOUND,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.updateSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Subreddit not found",
      });
    });
    //*************************************** */
    it("fourth test fail", async () => {
      const req = {
        body: {
          nsfw: false,
        },
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        updateSubreddit: async (subredditName, userId, data) => {
          const response = {
            success: false,
            error: subredditErrors.NOT_MODERATOR,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.updateSubredditSettings(req, res);
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status(401).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "you are not moderator to preform this request",
      });
    });
    //********************************************** */
  });
  //! *************************************************** */
  describe("/subreddits/mine/{where} Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
          where: "moderator",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        subredditsIamIn: async (userId, location) => {
          const response = {
            success: true,
            data: [
              {
                fixedName: "Subreddit name",
                nsfw: false,
              },
            ],
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.subredditsJoined(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        data: [
          {
            fixedName: "Subreddit name",
            nsfw: false,
          },
        ],
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        subredditsIamIn: async (userId, location) => {
          const response = {
            success: false,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.subredditsJoined(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Missing required parameter location",
      });
    });
    //************************************ */
    it("third test fail", async () => {
      const req = {
        params: {
          subredditName: "Subreddit name",
          where: "subscriberr",
        },
        user: {
          _id: "10",
          userName: "khaled hesham",
        },
      };
      const UserService = {};
      const subredditService = {
        subredditsIamIn: async (userId, location) => {
          const response = {
            success: false,
            error: subredditErrors.INVALID_ENUM,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.subredditsJoined(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Invalid location value !",
      });
    });
    //********************************************** */
  });
  // ! *************************************************************
  describe("/subreddits/moderator/{username} Test", () => {
    it("first test success", async () => {
      const req = {
        params: {
          username: "khaled",
        },
      };
      const UserService = {};
      const subredditService = {
        subredditsModeratedBy: async (userName) => {
          const response = {
            success: true,
            data: [
              {
                fixedName: "Subreddit name",
                nsfw: false,
              },
            ],
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      // console.log(subredditController);
      await subredditController.subredditsModerated(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        data: [
          {
            fixedName: "Subreddit name",
            nsfw: false,
          },
        ],
      });
    });
    // ***********************************************************************
    it("second test fail", async () => {
      const req = {
        params: {},
      };
      const UserService = {};
      const subredditService = {
        subredditsModeratedBy: async (userName) => {
          const response = {
            success: false,
          };
          return response;
        },
      };

      const subredditController = new SubredditController({
        subredditService,
        UserService,
      });
      await subredditController.subredditsModerated(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Missing required parameter userName",
      });
    });

    //********************************************** */
  });
});
