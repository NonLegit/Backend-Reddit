// const assert = require("chai").assert;
// const expect = require("chai").expect;
// const dotenv = require("dotenv");
// const { default: mongoose } = require("mongoose");
// dotenv.config({ path: "config/config.env" });

// const SubredditService = require("./../../service/subredditService");

// const emailServiceObj = {
//   sendPasswordReset: (user, resetURL) => {
//     return true;
//   },
//   sendUserName: (user) => {
//     return true;
//   },
// };

// describe("get subreddit flairs", () => {

//     it("first test (success operation of database)", async () => {
//       const RepositoryObj = {
//         getRefrenced: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//               createdAt: "2022-11-11T13:48:22.887Z",
//              flairIds: [
//                 {
//                     _id: "636e901bbc485bd111dd3880",
//                     text: "first flair",
//                     __v: 0
//                 },
//                 {
//                     _id: "636e9024bc485bd111dd3886",
//                     text: "second flair",
//                     __v: 0
//                 },
//                 {
//                     _id: "636e902bbc485bd111dd388c",
//                     text: "third flair",
//                     __v: 0
//                 }
//         ]
//             },
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.getFlairs("");
//       assert.equal(output.statusCode, 200);

//     });
//     it("2)no such subreddit", async () => {
//       const RepositoryObj = {
//         getRefrenced: (userData,data) => {
//           const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//         emailServiceObj
//       );
//       const output = await subredditServiceObj.getFlairs("");
//       assert.equal(output.statusCode, 404);

//     });

//   });

// describe("check flair", () => {

//     it("first test success",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",

//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"636e901bbc485bd111dd3880");
//       assert.equal(output.status, "success");

//     });
//      it("first test fail ,flair not found",  () => {
//         let subreddit = {
//             status: "success",
//             doc: {
//                 name: "first_one",
//                 flairIds: [
//                    "636e901bbc485bd111dd3880",
//                          "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c",

//                 ]
//             }
//         }
//         const subredditServiceObj = new SubredditService( "", "","","");
//       const output = subredditServiceObj.checkFlair(subreddit,"");
//       assert.equal(output.statusCode, 404);

//     });
//   });

// describe("check subreddit", () => {

//     it("first test success subreddit exists", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 name: "first subreddit",
//                 type:"Public",
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.status, "success");

//     });
//     it("2)no such subreddit", async () => {
//       const RepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"document not found"
//           };
//           return response;
//         },
//       };
//       const subredditServiceObj = new SubredditService(
//         "",
//         RepositoryObj,
//         ""
//       );
//       const output = await subredditServiceObj.checkSubreddit("");
//       assert.equal(output.statusCode, 404);

//     });

// });

// describe("get flair", () => {

//     it("first test success", async () => {
//       const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 _id: "636e902bbc485bd111dd388c",
//                 text: "third flair",
//                 },
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.status, "success");

//     });
//     it("2)no such flair", async () => {
//     const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//           const response = {
//             status: "success",
//             statusCode: 200,
//             doc: {
//                 flairIds: [
//                         "636e901bbc485bd111dd3880",
//                         "636e9024bc485bd111dd3886",
//                         "636e902bbc485bd111dd388c"
//                     ]
//             },
//           };
//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","");
//       assert.equal(output.statusCode, 404);

//     });
//     it("3)no such subreddit", async () => {
//      const SubredditRepositoryObj = {
//         getOne: (userData,data) => {
//              const response = {
//                  status: "fail",
//                  statusCode: 404,
//                  err: "document not found"
//              };

//           return response;
//         },
//         };

//       const FlairRepositoryObj = {
//         getOneById: (userData) => {
//             const response = {
//             status: "fail",
//             statusCode: 404,
//             err:"cannot found document"
//             };
//             return response;
//         },
//         };
//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        FlairRepositoryObj
//       );
//       const output = await subredditServiceObj.getFlair("","636e902bbc485bd111dd388c");
//       assert.equal(output.statusCode, 404);

//     });

// });

// describe("delete flair", () => {

//     it("first test success", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },

//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }

//         }

//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.status, "success");

//     });

//     it("second test failure not moderator", async () => {
//         const SubredditRepositoryObj = {
//             getOne: (userData, data) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: ["636e901bbc485bd111dd3880"],
//                     },
//                 };
//                 return response;
//             },

//             removeFromRefrenced: (data, dummy) => {
//                 const response = {
//                     status: "success",
//                     statusCode: 200,
//                     doc: {
//                         name: "firstSubreddit",
//                         owner: mongoose.mongo.ObjectId("636e52a73718b8dbbf1721b2"),
//                         flairIds: [],
//                     },
//                 }
//                 return response;
//             }

//         }

//       const subredditServiceObj = new SubredditService(
//         "",
//         SubredditRepositoryObj,
//           "",
//        ""
//       );
//       const output = await subredditServiceObj.deleteFlair("firstSubreddit","636e901bbc485bd111dd3880",mongoose.mongo.ObjectId("636e52a73718b8cbbf1721b2"));
//       assert.equal(output.statusCode, 403);

//     });

//   });
