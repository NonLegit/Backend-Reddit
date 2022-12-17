// const assert = require("chai").assert;
// const expect = require("chai").expect;
// const chai = require("chai");
// const sinon = require("sinon");
// const sinonChai = require("sinon-chai");
// const dotenv = require("dotenv");

// const SubredditController = require("./../../controllers/subredditController");
// const {
//   subredditErrors,
//   userErrors,
//   mongoErrors,
// } = require("./../../error_handling/errors");
// dotenv.config();
// chai.use(sinonChai);
// // const proxyquire = require("proxyquire");

// //var res = { send: sinon.spy() ,status: sinon.spy(),json: sinon.spy()};
// const statusJsonSpy = sinon.spy();
// const next = sinon.spy();
// const res = {
//   json: sinon.spy(),
//   status: sinon.stub().returns({ json: statusJsonSpy }),
//   cookie: sinon.spy(),
// };

// describe("Subreddit Controller Test", () => {
//   describe("Create Subreddit Test", () => {
//     it("first test success", async () => {
//       const req = {
//         body: {
//           fixedName: "Subreddit name",
//           type: "Public",
//           nsfw: true,
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         createSubreddit: async (data, userName, profilePicture) => {
//           const response = {
//             success: true,
//             data: { _id: "10" },
//           };
//           return response;
//         },
//       };


//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.createSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         id: "10",
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         body: {
//           type: "Public",
//           nsfw: true,
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         createSubreddit: async (data, userName, profilePicture) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.createSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid request",
//       });
//     });

//     //********************************************** */
//     it("third test fail", async () => {
//       const req = {
//         body: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         createSubreddit: async (data, userName, profilePicture) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.createSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid request",
//       });
//     });

//     //****************************************************************** */

//     it("fourth test fail", async () => {
//       const req = {
//         body: {
//           fixedName: "Subreddit name",
//           type: "Public",
//           nsfw: true,
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         createSubreddit: async (data, userName, profilePicture) => {
//           const response = {
//             success: false,
//             error: subredditErrors.ALREADY_EXISTS,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.createSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "This name is already taken",
//       });
//     });

//     it("fifth test fail", async () => {
//       const req = {
//         body: {
//           fixedName: "k",
//           type: "Public",
//           nsfw: true,
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         createSubreddit: async (data, userName, profilePicture) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//             msg: "Invalid data: A subreddit name must have more or equal then 2 characters",
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.createSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage:
//           "Invalid data: A subreddit name must have more or equal then 2 characters",
//       });
//     });
//   });
//   // ! **********************************************************************
//   describe("get Subreddit Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         retrieveSubreddit: async (userId, name, checkOnly) => {
//           const response = {
//             success: true,
//             data: { _id: "10", fixedName: "Subreddit name" },
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.getSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: {
//           _id: "10",
//           fixedName: "Subreddit name",
//         },
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         retrieveSubreddit: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.getSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     //********************************* */
//     it("third test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         retrieveSubreddit: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             errorMessage: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.getSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//   });
//   //! ********************************************************
//   describe("delete Subreddit Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteSubreddit: async (subredditName, userId) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({
//         status: "success",
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteSubreddit: async (subredditName, userId) => {
//           const response = {
//             success: false,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.deleteSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ********************************************************
//     it("third test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteSubreddit: async (subredditName, userId) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     it("fourth test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteSubreddit: async (subredditName, userId) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_OWNER,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteSubreddit(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not the owner to this subreddit",
//       });
//     });
//   });
//   //! ********************************************************

//   describe("update Subreddit Test", () => {
//     it("first test success", async () => {
//       const req = {
//         body: {
//           nsfw: false,
//         },
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateSubreddit: async (subredditName, userId, data) => {
//           const response = {
//             success: true,
//             data: {
//               fixedName: "Subreddit name",
//               nsfw: false,
//             },
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updateSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: {
//           fixedName: "Subreddit name",
//           nsfw: false,
//         },
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         body: {
//           nsfw: false,
//         },
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateSubreddit: async (subredditName, userId, data) => {
//           const response = {
//             success: false,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updateSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     //*********************************** */
//     it("third test fail", async () => {
//       const req = {
//         body: {
//           nsfw: false,
//         },
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateSubreddit: async (subredditName, userId, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updateSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     //*************************************** */
//     it("fourth test fail", async () => {
//       const req = {
//         body: {
//           nsfw: false,
//         },
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateSubreddit: async (subredditName, userId, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updateSubredditSettings(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this request",
//       });
//     });
//     //********************************************** */
//   });
//   //! *************************************************** */
//   describe("/subreddits/mine/{where} Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           where: "moderator",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         subredditsIamIn: async (userId, location) => {
//           const response = {
//             success: true,
//             data: [
//               {
//                 fixedName: "Subreddit name",
//                 nsfw: false,
//               },
//             ],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.subredditsJoined(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [
//           {
//             fixedName: "Subreddit name",
//             nsfw: false,
//           },
//         ],
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         subredditsIamIn: async (userId, location) => {
//           const response = {
//             success: false,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.subredditsJoined(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter location",
//       });
//     });
//     //************************************ */
//     it("third test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           where: "subscriberr",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         subredditsIamIn: async (userId, location) => {
//           const response = {
//             success: false,
//             error: subredditErrors.INVALID_ENUM,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.subredditsJoined(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid location value !",
//       });
//     });
//     //********************************************** */
//   });
//   // ! *************************************************************
//   describe("/subreddits/moderator/{username} Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           username: "khaled",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         subredditsModeratedBy: async (userName) => {
//           const response = {
//             success: true,
//             data: [
//               {
//                 fixedName: "Subreddit name",
//                 nsfw: false,
//               },
//             ],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.subredditsModerated(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [
//           {
//             fixedName: "Subreddit name",
//             nsfw: false,
//           },
//         ],
//       });
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         params: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         subredditsModeratedBy: async (userName) => {
//           const response = {
//             success: false,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       await subredditController.subredditsModerated(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter userName",
//       });
//     });

//     //********************************************** */
//   });
//   // !================================================
//   describe("invite moderator Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//     });
//     // ***********************************************************************
//     it("second test fail", async () => {
//       const req = {
//         params: {
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ============================================
//     it("third test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter moderatorName",
//       });
//     });
//     //********************************************** */
//     it("fourth test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "please provide a permissions",
//       });
//     });
//     //============================================
//     it("fifth test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ==================================================
//     it("6th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false, error: subredditErrors.NOT_MODERATOR };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.inviteModerator(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//     // =====================================================
//     it("7th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false, error: userErrors.USER_NOT_FOUND };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);

//       await subredditController.inviteModerator(req, res);

//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user not found",
//       });
//     });
//     // ==============================================
//     it("8th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           permissions: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false, error: userErrors.ALREADY_MODERATOR };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);

//       await subredditController.inviteModerator(req, res);

//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is already moderator",
//       });
//     });
//     // =============================
//     it("9th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "1",
//         },
//         body: {
//           p: {
//             all: false,
//             access: true,
//             config: true,
//             flair: false,
//             posts: false,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         inviteMod: async (subredditName, userId, modName, data) => {
//           return { success: false, error: subredditErrors.MONGO_ERR };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);

//       await subredditController.inviteModerator(req, res);

//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });
//   // !===============================================================
//   describe("ModeratorInvitation invite Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "accept",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//     });
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "reject",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//     });
//     //============================
//     it("3rd test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "acceptt",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: false };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid Enum value",
//       });
//     });
//     // =======================================
//     it("4th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: false };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter action",
//       });
//     });
//     // ***********************************************************************
//     it("5th test success", async () => {
//       const req = {
//         params: {
//           action: "accept",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: true };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     //********************************************** */
//     it("6th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "accept",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ===============================
//     it("7th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "accept",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: false, error: userErrors.ALREADY_MODERATOR };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user already moderator",
//       });
//     });
//     //========================================
//     it("8th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "accept",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: false, error: subredditErrors.NO_INVITATION };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "there is no moderation invitation to this subreddit",
//       });
//     });
//     //======================================================
//     it("9th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "subreddit",
//           action: "reject",
//         },
//         user: {
//           _id: "1",
//           userName: "khaled",
//           profilePicture: "defult.png",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleInvitation: async (
//           userId,
//           userName,
//           profilePicture,
//           subredditName,
//           action
//         ) => {
//           return { success: false, error: subredditErrors.MONGO_ERR };
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.ModeratorInvitation(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("Subscribe Test", () => {
//     const req = {
//       params: {
//         subredditName: "Subreddit name",
//       },
//       query: {
//         action: "sub",
//       },
//       user: {
//         _id: "10",
//       },
//     };

//     const UserService = {
//       subscribe: async () => true,
//     };
//     const subredditService = {
//       subscriable: async () => {
//         return { success: true };
//       },
//       updateUserCount: async () => {},
//     };

//     const subredditController = new SubredditController({
//       subredditService,
//       UserService,
//     });

//     it("successful subscribe", async () => {
//       await subredditController.subscribe(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status().json).to.have.been.calledWith({
//         status: "success",
//       });
//     });

//     it("invalid action", async () => {
//       UserService.subscribe = async () => false;
//       await subredditController.subscribe(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status().json).to.have.been.calledWith({
//         status: "fail",
//         message: "Invalid subscribtion action",
//       });
//     });

//     it("user banned", async () => {
//       subredditService.subscriable = async () => {
//         return { success: false, error: subredditErrors.BANNED };
//       };
//       await subredditController.subscribe(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status().json).to.have.been.calledWith({
//         status: "fail",
//         message: "user is banned from subreddit",
//       });
//     });

//     it("subreddit not found", async () => {
//       subredditService.subscriable = async () => {
//         return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
//       };
//       await subredditController.subscribe(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status().json).to.have.been.calledWith({
//         status: "fail",
//         message: "Subreddit not found",
//       });
//     });

//     it("invalid request", async () => {
//       delete req.params.subredditName;
//       await subredditController.subscribe(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status().json).to.have.been.calledWith({
//         status: "fail",
//         message: "Invalid request",
//       });
//     });
//   });

//   // !=================================
//   describe("updatePermissions Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({
//         status: "success",
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         params: {
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ***********************************************************************

//     it("3rd test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter moderatorName",
//       });
//     });
//     // ***********************************************************************

//     it("4th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ***********************************************************************

//     it("5th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//     // ***********************************************************************

//     it("6th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: false,
//             error: userErrors.USER_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user not found",
//       });
//     });
//     // ***********************************************************************

//     it("7th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: false,
//             error: userErrors.Not_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is not a moderator",
//       });
//     });
//     // ***********************************************************************

//     it("8th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           moderatorName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           permissions: {
//             all: true,
//             access: true,
//             config: true,
//             flair: true,
//             posts: true,
//           },
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         updateModeratorSettings: async (
//           subredditName,
//           userId,
//           modName,
//           data
//         ) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.updatePermissions(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//     // ***********************************************************************
//   });

//   describe("leaveModerator Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         leaveMod: async (userId, subredditName) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaveModerator(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: {
//           _id: "10",
//           fixedName: "Subreddit name",
//         },
//       });
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         leaveMod: async (userId, subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaveModerator(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ***********************************************************************

//     it("3rd test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         leaveMod: async (userId, subredditName) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaveModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ***********************************************************************

//     it("4th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         leaveMod: async (userId, subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaveModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is not a moderator",
//       });
//     });
//     // ***********************************************************************

//     it("5th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         leaveMod: async (userId, subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaveModerator(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//     // ***********************************************************************
//   });

//   describe("Favourite Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleFavourite: async (userId, subredditName) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.Favourite(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({
//         status: "success",
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleFavourite: async (userId, subredditName) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.Favourite(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ***********************************************************************

//     it("3rd test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleFavourite: async (userId, subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.Favourite(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ***********************************************************************

//     it("4th test fail", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         handleFavourite: async (userId, subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.Favourite(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//     // ***********************************************************************
//   });

//   describe("favouriteSubreddits Test", () => {
//     it("first test success", async () => {
//       const req = {
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         getFavourites: async (userId) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", fixedName: "Subreddit name" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.favouriteSubreddits(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [{ _id: "10", fixedName: "Subreddit name" }],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         getFavourites: async (userId) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.favouriteSubreddits(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//     // ***********************************************************************
//   });

//   describe("banSettings Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(204).json).to.have.been.calledWith({});
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ***********************************************************************

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter banedUser",
//       });
//     });
//     // ***********************************************************************

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter action",
//       });
//     });
//     // ***********************************************************************

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "bann",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid Enum value [ban,unban]",
//       });
//     });
//     // ***********************************************************************

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ***********************************************************************

//     it("7th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//     // ***********************************************************************

//     it("8th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: userErrors.ALREADY_BANED,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is already banned",
//       });
//     });
//     // ***********************************************************************

//     it("9th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: userErrors.Not_BANED,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is not baned to unban",
//       });
//     });
//     // ***********************************************************************

//     it("10th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banUnban: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.banSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//     // ***********************************************************************
//   });

//   describe("muteSettings Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(204).json).to.have.been.calledWith({});
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });
//     // ***********************************************************************

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter banedUser",
//       });
//     });
//     // ***********************************************************************

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter action",
//       });
//     });
//     // ***********************************************************************

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "bann",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Invalid Enum value [mute,unmute]",
//       });
//     });
//     // ***********************************************************************

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });
//     // ***********************************************************************

//     it("7th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//     // ***********************************************************************

//     it("8th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: userErrors.ALREADY_BANED,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is already banned",
//       });
//     });
//     // ***********************************************************************

//     it("9th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: userErrors.Not_BANED,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "user is not baned to unban",
//       });
//     });
//     // ***********************************************************************

//     it("10th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           action: "ban",
//           userName: "khaled",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {
//           punish_type: "No Spoiler",
//           Note: "he is bad person",
//           punishReason: "not dowing his homework",
//           duration: 20,
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muteUnmute: async (userId, subredditName, banedUser, action, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.muteSettings(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("bannedUsers Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banned: async (subredditName) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", userName: "khaled" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.bannedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [{ _id: "10", userName: "khaled" }],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banned: async (subredditName) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", userName: "khaled" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.bannedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banned: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.bannedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banned: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.bannedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         banned: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.bannedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//   });

//   describe("mutedUsers Test", () => {
//     it("1st test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muted: async (subredditName) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", userName: "khaled" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.mutedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [{ _id: "10", userName: "khaled" }],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muted: async (subredditName) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", userName: "khaled" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.mutedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muted: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.mutedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muted: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.mutedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         muted: async (subredditName) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.mutedUsers(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });
//   });

//   describe("addRule Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({});
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter rule title",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.RULE_TAKEN,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "this title is already taken",
//       });
//     });

//     it(" 7th success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         addRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.addRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("editRule Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({});
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter rule title",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.RULE_TAKEN,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "this title is already taken",
//       });
//     });

//     it(" 7th success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         editRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.editRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("deleteRule Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(204);
//       expect(res.status(204).json).to.have.been.calledWith({});
//     });
//     // ***********************************************************************
//     it("2nd test success", async () => {
//       const req = {
//         params: {
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: true,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Missing required parameter rule title",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.RULE_TAKEN,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "this title is already taken",
//       });
//     });

//     it(" 7th success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           title: "rule 1",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//         body: {},
//       };
//       const UserService = {};
//       const subredditService = {
//         deleteRule: async (subredditName, userId, title, data) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.deleteRule(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("modPosts Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [
//           {
//             _id: "10",
//           },
//         ],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         params: {
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         message: "Missing required parameter subredditName",
//       });
//     });

//     it("3rd test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         message: "Missing required parameter location",
//       });
//     });

//     it("4th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             error: subredditErrors.SUBREDDIT_NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(404);
//       expect(res.status(404).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "Subreddit not found",
//       });
//     });

//     it("5th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             error: mongoErrors.NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [],
//       });
//     });

//     it("6th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             error: subredditErrors.NOT_MODERATOR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(401);
//       expect(res.status(401).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: "you are not moderator to preform this action",
//       });
//     });

//     it("7th test success", async () => {
//       const req = {
//         params: {
//           subredditName: "Subreddit name",
//           location: "spammed",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedPosts: async (userId, name, checkOnly) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.modPosts(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("leaderboardCategory Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {
//           category: "sport",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedSubreddits: async (category, query) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", fixedName: "Subreddit name" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardCategory(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [
//           {
//             _id: "10",
//             fixedName: "Subreddit name",
//           },
//         ],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedSubreddits: async (category, query) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", fixedName: "Subreddit name" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardCategory(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         message: "Missing required parameter location",
//       });
//     });

//     it("3rd test fail", async () => {
//       const req = {
//         params: {
//           category: "sport",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedSubreddits: async (category, query) => {
//           const response = {
//             success: false,
//             error: mongoErrors.NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardCategory(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [],
//       });
//     });

//     it("4th test fail", async () => {
//       const req = {
//         params: {
//           category: "sport",
//         },
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         categorizedSubreddits: async (category, query) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardCategory(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });

//   describe("leaderboardRandom Test", () => {
//     it("first test success", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         randomSubreddits: async (category, query) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", fixedName: "Subreddit name" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardRandom(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [
//           {
//             _id: "10",
//             fixedName: "Subreddit name",
//           },
//         ],
//       });
//     });
//     // ***********************************************************************
//     it("2nd test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         randomSubreddits: async (category, query) => {
//           const response = {
//             success: true,
//             data: [{ _id: "10", fixedName: "Subreddit name" }],
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardRandom(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         message: "Missing required parameter location",
//       });
//     });

//     it("3rd test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         randomSubreddits: async (category, query) => {
//           const response = {
//             success: false,
//             error: mongoErrors.NOT_FOUND,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardRandom(req, res);
//       expect(res.status).to.have.been.calledWith(200);
//       expect(res.status(200).json).to.have.been.calledWith({
//         status: "success",
//         data: [],
//       });
//     });

//     it("4th test fail", async () => {
//       const req = {
//         params: {},
//         user: {
//           _id: "10",
//           userName: "khaled hesham",
//         },
//       };
//       const UserService = {};
//       const subredditService = {
//         randomSubreddits: async (category, query) => {
//           const response = {
//             success: false,
//             error: subredditErrors.MONGO_ERR,
//           };
//           return response;
//         },
//       };

//       const subredditController = new SubredditController({
//         subredditService,
//         UserService,
//       });
//       // console.log(subredditController);
//       await subredditController.leaderboardRandom(req, res);
//       expect(res.status).to.have.been.calledWith(400);
//       expect(res.status(400).json).to.have.been.calledWith({
//         status: "fail",
//         errorMessage: undefined,
//       });
//     });
//   });
// });
