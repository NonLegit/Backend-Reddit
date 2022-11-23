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
          isFollowed: true,
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
          isFollowed: false,
        },
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
