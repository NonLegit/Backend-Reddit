const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();
const subredditService = require("./../../service/subredditService");
const {
  subredditErrors,
  mongoErrors,
  userErrors,
} = require("../../error_handling/errors");

describe("Subreddit Test", () => {
  describe("Subreddit services Test", () => {
    describe("createSubreddit function ", () => {
      it("first test", async () => {
        const UserRepository = {
          createOne: async (userData) => {
            const response = {
              success: true,
              doc: {
                _id: "10",
              },
            };
            return response;
          },
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          subscribe: async (subredditId, userId) => {
            return true;
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              data: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          subscribe: async (subredditId, userId) => {
            return true;
          },
          disInvite: async (userId, subredditName) => {
            return true;
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });
        let userName = "khaled";

        let data = {
          owner: userName,
          fixedName: "subreddit",
          type: "Public",
          nsfw: true,
        };

        let profilePicture = "profile.png";

        const result = await subredditServices.createSubreddit(
          data,
          userName,
          profilePicture
        );

        expect(result.data._id).to.equal("10");
      });

      it("second test (fail) ", async () => {
        const UserRepository = {
          createOne: async (userData) => {
            const response = {
              success: true,
              doc: {
                _id: "10",
              },
            };
            return response;
          },
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              data: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });
        let userName = "khaled";

        let data = {
          owner: userName,
          fixedName: "subreddit",
          type: "Public",
          nsfw: true,
        };

        let profilePicture = "profile.png";

        const result = await subredditServices.createSubreddit(
          data,
          userName,
          profilePicture
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.ALREADY_EXISTS);
      });

      it("Third test (fail) ", async () => {
        const UserRepository = {
          createOne: async (userData) => {
            const response = {
              success: true,
              doc: {
                _id: "10",
              },
            };
            return response;
          },
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return {
              success: false,
              msg: "Invalid data: A subreddit name must have more or equal then 2 characters",
            };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              data: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });
        let userName = "khaled";

        let data = {
          owner: userName,
          fixedName: "s",
          type: "Public",
          nsfw: true,
        };

        let profilePicture = "profile.png";

        const result = await subredditServices.createSubreddit(
          data,
          userName,
          profilePicture
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
        expect(result.msg).to.equal(
          "Invalid data: A subreddit name must have more or equal then 2 characters"
        );
      });
    });
    // ! =====================================================

    describe("retrieveSubreddit function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.retrieveSubreddit(
          "1",
          "subreddit",
          true
        );

        expect(result.data._id).to.equal("10");
        expect(result.data.fixedName).to.equal("subreddit");
        expect(result.data.nsfw).to.equal(true);
      });

      it("second test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              error: subredditErrors.SUBREDDIT_NOT_FOUND,
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.retrieveSubreddit(
          "1",
          "subreddit",
          true
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });
    });
    // !=====================================================================
    describe("deleteSubreddit function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isOwner: async (subredditName, userID) => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
          delete: async (subredditName) => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteSubreddit(
          "subreddit",
          "1"
        );

        expect(result.success).to.equal(true);
      });

      it("second test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isOwner: async (subredditName, userID) => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
          delete: async (subredditName) => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteSubreddit(
          "subreddit",
          "1"
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("third test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isOwner: async (subredditName, userID) => {
            return { success: false, error: mongoErrors.NOT_FOUND };
          },
          delete: async (subredditName) => {
            return { success: false, doc: { fixedName: "subreddit" } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteSubreddit(
          "subreddit",
          "1"
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NOT_OWNER);
      });

      it("fourth test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isOwner: async (subredditName, userID) => {
            return { success: true, error: mongoErrors.NOT_FOUND };
          },
          delete: async (subredditName) => {
            return {
              success: false,
              error: mongoErrors.UNKOWN,
              msg: "mongo error",
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteSubreddit(
          "subreddit",
          "1"
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(mongoErrors.UNKOWN);
        expect(result.msg).to.equal("mongo error");
      });
    });
    // !==========================================================

    describe("updateSubredit function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return { success: true, doc: { moderators: [{ id: "1" }] } };
          },
          update: async (subredditName, data) => {
            return { success: true, doc: { _id: "10", nsfw: false } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateSubreddit(
          "subreddit",
          "1",
          {
            nsfw: false,
          }
        );
        expect(result.success).to.equal(true);
        expect(result.data._id).to.equal("10");
        expect(result.data.nsfw).to.equal(false);
      });

      it("second test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return { success: true, doc: { moderators: [{ id: "1" }] } };
          },
          update: async (subredditName, data) => {
            return { success: true, doc: { _id: "10", nsfw: false } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateSubreddit(
          "subreddit",
          "1",
          {
            nsfw: false,
          }
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("third test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return { success: false };
          },
          update: async (subredditName, data) => {
            return { success: true, doc: { _id: "10", nsfw: false } };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateSubreddit(
          "subreddit2",
          "1",
          {
            nsfw: false,
          }
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NOT_MODERATOR);
      });

      it("fourth test (fail)", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return { success: true, doc: { moderators: [{ id: "1" }] } };
          },
          update: async (subredditName, data) => {
            return {
              success: false,
              error: subredditErrors.MONGO_ERR,
              msg: "mongo error",
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateSubreddit(
          "subreddit2",
          "1",
          {
            nsfw: false,
          }
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
        expect(result.msg).to.equal("mongo error");
      });
    });
    // !=====================================================
    describe("subredditsIamIn function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return true;
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: {
                    find: function (val) {
                      return false;
                    },
                  },
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: {
                    find: function (val) {
                      return false;
                    },
                  },
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          "1",
          "moderator"
        );

        expect(result.success).to.equal(true);
        expect(result.data[0].fixedName).to.equal("subreddit");
      });

      it("second test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return true;
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  subscribed: [
                    {
                      fixedName: "subreddit",
                    },
                  ],
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: {
                subscribed: [
                  {
                    fixedName: "subreddit",
                  },
                ],
              },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          "1",
          "subscriber"
        );

        expect(result.success).to.equal(true);
        expect(result.data[0].fixedName).to.equal("subreddit");
      });

      it("third test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return true;
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: false,
              error: subredditErrors.MONGO_ERR,
              msg: "mongo error",
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          "1",
          "moderator"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
      });
      it("fourth test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return true;
          },
          getSubreddits: async (userId, type) => {
            return {
              success: false,
              error: subredditErrors.MONGO_ERR,
              msg: "mongo error",
            };
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          "1",
          "subscriber"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
      });

      it("fifth test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return true;
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn("1", "sub");

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.INVALID_ENUM);
      });
    });

    describe("subredditsModeratedBy function ", () => {
      it("first test", async () => {
        const UserRepository = {};
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsModeratedBy("khaled");

        expect(result.success).to.equal(true);
        expect(result.data[0].fixedName).to.equal("subreddit");
      });

      it("second test", async () => {
        const UserRepository = {};
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: false,
              error: subredditErrors.MONGO_ERR,
              msg: "mongo error",
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsModeratedBy("fathy");

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
      });
    });

    describe("inviteMod function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(true);
      });

      it("second test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(false);
      });

      it("third test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: false,
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(false);
      });

      it("fourth test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: false };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.USER_NOT_FOUND);
      });

      it("fifth test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.ALREADY_MODERATOR);
      });

      it("6th test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1" }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.inviteMod(
          "subreddit",
          "1",
          "khaled",
          {
            permissions: {
              all: false,
              access: true,
              config: true,
              flair: false,
              posts: false,
            },
          }
        );
        expect(result.success).to.equal(true);
      });
    });
    // !=======================
    describe("handleInvitation function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          checkInvetation: async (userId, subredditId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          returnInvitations: async (userId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          updateInvitations: async (userId, invitations) => {
            return { success: true, doc: { _id: "1" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: {
                  equals: function (val) {
                    return false;
                  },
                },
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
          addModerator: async () => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
          disInvite: async () => {
            return true;
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.handleInvitation(
          "1",
          "khaled",
          "default.png",
          "subreddit",
          "accept"
        );

        expect(result.success).to.equal(true);
      });

      it("2nd test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          checkInvetation: async (userId, subredditId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          returnInvitations: async (userId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          updateInvitations: async (userId, invitations) => {
            return { success: true, doc: { _id: "1" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
            };
          },
          addModerator: async () => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
          disInvite: async () => {
            return true;
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.handleInvitation(
          "1",
          "khaled",
          "default.png",
          "subreddit",
          "accept"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("3rd test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          checkInvetation: async (userId, subredditId) => {
            return {
              success: false,
            };
          },
          returnInvitations: async (userId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          updateInvitations: async (userId, invitations) => {
            return { success: true, doc: { _id: "1" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: {
                  equals: function (val) {
                    return false;
                  },
                },
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
          addModerator: async () => {
            return { success: true, doc: { fixedName: "subreddit" } };
          },
          disInvite: async () => {
            return true;
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.handleInvitation(
          "1",
          "khaled",
          "default.png",
          "subreddit",
          "accept"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NO_INVITATION);
      });

      it("4th test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          checkInvetation: async (userId, subredditId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          returnInvitations: async (userId) => {
            return {
              success: true,
              doc: {
                pendingInvitations: [
                  {
                    subredditId: "10",
                    permissions: {
                      all: false,
                      access: true,
                      config: true,
                      flair: false,
                      posts: false,
                    },
                  },
                ],
              },
            };
          },
          updateInvitations: async (userId, invitations) => {
            return { success: true, doc: { _id: "1" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: {
                  equals: function (val) {
                    return false;
                  },
                },
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
          addModerator: async () => {
            return { success: false };
          },
          disInvite: async () => {
            return true;
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.handleInvitation(
          "1",
          "khaled",
          "default.png",
          "subreddit",
          "accept"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.MONGO_ERR);
      });
    });
    describe("deleteMod function ", () => {
      it("first test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          "khaled"
        );

        expect(result.success).to.equal(true);
      });

      it("2nd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          "khaled"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("3rd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: false,
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          "khaled"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NOT_MODERATOR);
      });

      it("4th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: false };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          "khaled"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.USER_NOT_FOUND);
      });

      it("5th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          true
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.Not_MODERATOR);
      });

      it("6th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.retrieveSubreddit(
          "1",
          "subreddit",
          true
        );

        expect(result.success).to.equal(true);
      });

      it("7th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.deleteMod(
          "1",
          "subreddit",
          true
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.CANNOT_DELETE);
      });
    });

    describe("subredditsIamIn function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  ],
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "moderator"
        );

        expect(result.success).to.equal(true);
      });

      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          getSubreddits: async (userId) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  ],
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subscriber"
        );

        expect(result.success).to.equal(true);
      });

      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          getSubreddits: async (userId) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  ],
                },
              ],
            };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                fixedName: "subreddit",
                nsfw: true,
              },
            };
          },
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  ],
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsIamIn(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "moderatorrrr"
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.INVALID_ENUM);
      });
    });

    describe("subredditsModeratedBy function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
        };
        const SubredditRepository = {
          getSubreddits: async (userId, type) => {
            return {
              success: true,
              doc: [
                {
                  fixedName: "subreddit",
                  users: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  ],
                },
              ],
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.subredditsModeratedBy("khaled");

        expect(result.success).to.equal(true);
      });
    });

    describe("getFavourites function ", () => {
      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          getFavouriteSubreddits: async (userId) => {
            return { success: true, doc: { fixedName: "sub" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.getFavourites("19148901");

        expect(result.success).to.equal(true);
      });

      it("first test", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          getFavouriteSubreddits: async (userId) => {
            return { success: false, doc: { fixedName: "sub" } };
          },
        };
        const SubredditRepository = {
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.getFavourites("19148901");

        expect(result.success).to.equal(false);
      });

      describe("retrieveSubreddit function ", () => {
        it("first test", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
          };
          const SubredditRepository = {
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });

          const result = await subredditServices.retrieveSubreddit(
            "1",
            "subreddit",
            true
          );

          expect(result.success).to.equal(true);
        });
      });
    });

    describe("updateModeratorSettings function ", () => {
      it("first test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(true);
      });

      it("2nd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("3rd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: false,
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NOT_MODERATOR);
      });

      it("4th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: false };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.USER_NOT_FOUND);
      });

      it("5th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.Not_MODERATOR);
      });

      it("6th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
      });

      it("7th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.updateModeratorSettings(
          "subreddit",
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "khaled",
          {}
        );

        expect(result.success).to.equal(false);
      });
    });

    describe("banUnban function ", () => {
      it("first test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
          checkPunished: async (userId, subredditName, action) => {
            return { success: false };
          },
          banUser: async (user, subredditName, data) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(true);
      });

      it("first test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
          checkPunished: async (userId, subredditName, action) => {
            return { success: false };
          },
          banUser: async (user, subredditName, data) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.mongoErrors);
      });

      it("2nd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: false,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.SUBREDDIT_NOT_FOUND);
      });

      it("3rd test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: false,
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(subredditErrors.NOT_MODERATOR);
      });

      it("4th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: false };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });
        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.USER_NOT_FOUND);
      });

      it("5th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: false,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: true };
          },
          checkPunished: async (userId, subredditName, action) => {
            return { success: true };
          },
          banUser: async (user, subredditName, data) => {
            return { success: true };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
        expect(result.error).to.equal(userErrors.ALREADY_BANED);
      });

      it("6th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return {
              success: true,
              doc: {
                _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                userName: "khaled",
              },
            };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 10,
                  },
                ],
              },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: {
                _id: "10",
                moderators: [
                  {
                    _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    modDate: 15,
                  },
                ],
              },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return {
              success: true,
              doc: {
                moderators: [
                  {
                    user: {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                    },
                  },
                ],
              },
            };
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
      });

      it("7th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "ban",
          {}
        );

        expect(result.success).to.equal(false);
      });

      it("7th test ", async () => {
        const UserRepository = {
          isSubscribed: async (user, subreddit) => {
            return false;
          },
          findByUserName: async (userName, select, pop) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          updateByName: async (userName, subredditId, permissions) => {
            return { success: true, doc: { _id: "1", userName: "khaled" } };
          },
          checkInvetation: async (userId, subredditId) => {
            return { suucess: true };
          },
        };
        const SubredditRepository = {
          create: async (data, userName, profilePicture) => {
            return { success: true, doc: { _id: "10" } };
          },
          getsubreddit: async (name, select, popOptions) => {
            return {
              success: true,
              doc: { _id: "10", fixedName: "subreddit", nsfw: true },
            };
          },
          isModerator_1: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
            };
          },
          isModerator_2: async (subredditName, userID) => {
            return {
              success: true,
              doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
            };
          },
          invite: async (userId, subredditName) => {
            return { success: true };
          },
          getModerators: async (subredditName) => {
            return true;
          },
          updateModerators: async (subredditName, moderators) => {
            return { success: false };
          },
          checkPunished: async (userId, subredditName, action) => {
            return { success: true };
          },
          banUser: async (user, subredditName, data) => {
            return { success: true };
          },
          getPunished:async (subredditName)=>{
            return {doc:{punished:{}}}
          }

        };
        const FlairRepository = {};
        const subredditServices = new subredditService({
          SubredditRepository,
          FlairRepository,
          UserRepository,
        });

        const result = await subredditServices.banUnban(
          mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
          "subreddit",
          "khaled",
          "unban",
          {}
        );

        expect(result.success).to.equal(false);
      });
    });


    describe("muteUnmute function ", () => {
        it("first test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 10,
                    },
                  ],
                },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: false,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 15,
                    },
                  ],
                },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return {
                success: true,
                doc: {
                  moderators: [
                    {
                      user: {
                        _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      },
                    },
                  ],
                },
              };
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: true };
            },
            checkPunished: async (userId, subredditName, action) => {
              return { success: false };
            },
            banUser: async (user, subredditName, data) => {
              return { success: true };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
        });
  
        it("first test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 10,
                    },
                  ],
                },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: false,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 15,
                    },
                  ],
                },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return {
                success: true,
                doc: {
                  moderators: [
                    {
                      user: {
                        _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      },
                    },
                  ],
                },
              };
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: true };
            },
            checkPunished: async (userId, subredditName, action) => {
              return { success: false };
            },
            banUser: async (user, subredditName, data) => {
              return { success: false };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
        });
  
        it("2nd test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: false,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return true;
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: true };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);

        });
  
        it("3rd test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: false,
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return true;
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: true };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
          expect(result.error).to.equal(subredditErrors.NOT_MODERATOR);
        });
  
        it("4th test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return { success: false };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 10 }] },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return true;
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: true };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
          expect(result.error).to.equal(userErrors.USER_NOT_FOUND);
        });
  
       
        it("6th test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return {
                success: true,
                doc: {
                  _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                  userName: "khaled",
                },
              };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 10,
                    },
                  ],
                },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: {
                  _id: "10",
                  moderators: [
                    {
                      _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      modDate: 15,
                    },
                  ],
                },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return {
                success: true,
                doc: {
                  moderators: [
                    {
                      user: {
                        _id: mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
                      },
                    },
                  ],
                },
              };
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: false };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
        });
  
        it("7th test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return true;
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: false };
            },
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "ban",
            {}
          );
  
          expect(result.success).to.equal(false);
        });
  
        it("7th test ", async () => {
          const UserRepository = {
            isSubscribed: async (user, subreddit) => {
              return false;
            },
            findByUserName: async (userName, select, pop) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            updateByName: async (userName, subredditId, permissions) => {
              return { success: true, doc: { _id: "1", userName: "khaled" } };
            },
            checkInvetation: async (userId, subredditId) => {
              return { suucess: true };
            },
          };
          const SubredditRepository = {
            create: async (data, userName, profilePicture) => {
              return { success: true, doc: { _id: "10" } };
            },
            getsubreddit: async (name, select, popOptions) => {
              return {
                success: true,
                doc: { _id: "10", fixedName: "subreddit", nsfw: true },
              };
            },
            isModerator_1: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 30 }] },
              };
            },
            isModerator_2: async (subredditName, userID) => {
              return {
                success: true,
                doc: { _id: "10", moderators: [{ _id: "1", modDate: 15 }] },
              };
            },
            invite: async (userId, subredditName) => {
              return { success: true };
            },
            getModerators: async (subredditName) => {
              return true;
            },
            updateModerators: async (subredditName, moderators) => {
              return { success: false };
            },
            checkPunished: async (userId, subredditName, action) => {
              return { success: true };
            },
            banUser: async (user, subredditName, data) => {
              return { success: true };
            },
            getPunished:async (subredditName)=>{
              return {doc:{punished:{}}}
            }
  
          };
          const FlairRepository = {};
          const subredditServices = new subredditService({
            SubredditRepository,
            FlairRepository,
            UserRepository,
          });
  
          const result = await subredditServices.muteUnmute(
            mongoose.Types.ObjectId("636e901bbc485bd111dd3880"),
            "subreddit",
            "khaled",
            "unban",
            {}
          );
  
          expect(result.success).to.equal(false);
        });
      });


    
  });
});
