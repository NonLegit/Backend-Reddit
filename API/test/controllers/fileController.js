const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const FileController = require("./../../controllers/fileController");
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

describe("file Controller Test", () => {
  describe("uploadUserImage Test", () => {
    it("first test success", async () => {
      var file;
      file = fs.readFileSync(`${__dirname}/default.png`);
      const req = {
        body: {
          type: "profileBackground",
        },
        user: {
          userName: "ahmed",
        },
        file: {
          buffer: file,
        },
      };
      const UserService = {
        addUserImageURL: async () => {
          return {
            _id: "",
            userName: "",
            email: "",
            profilePicture: "",
            profileBackground: "",
            canbeFollowed: "",
            lastUpdatedPassword: "",
            followersCount: "",
            friendsCount: "",
            accountActivated: "",
            gender: "",
            displayName: "",
            postKarma: "",
            commentKarma: "",
            createdAt: "",
            joinDate: "",
            description: "",
            adultContent: "",
            nsfw: "",
          };
        },
      };
      const fileController = new FileController({ UserService });
      await fileController.uploadUserImage(req, res, "");
      expect(res.status).to.have.been.calledWith(201);
      expect(res.status(201).json).to.have.been.calledWith({
        status: "success",
        user: {
          _id: "",
          userName: "",
          email: "",
          profilePicture: "",
          profileBackground: "",
          canbeFollowed: "",
          lastUpdatedPassword: "",
          followersCount: "",
          friendsCount: "",
          accountActivated: "",
          gender: "",
          displayName: "",
          postKarma: "",
          commentKarma: "",
          createdAt: "",
          description: "",
          adultContent: "",
          nsfw: "",
        },
      });
    });
    it("second test fail", async () => {
      var file;
      file = fs.readFileSync(`${__dirname}/default.png`);
      const req = {
        body: {
          type: "",
        },
        user: {
          userName: "ahmed",
        },
        file: {
          buffer: file,
        },
      };
      const UserService = {
        addUserImageURL: async () => {
          return {
            _id: "",
            userName: "",
            email: "",
            profilePicture: "",
            profileBackground: "",
            canbeFollowed: "",
            lastUpdatedPassword: "",
            followersCount: "",
            friendsCount: "",
            accountActivated: "",
            gender: "",
            displayName: "",
            postKarma: "",
            commentKarma: "",
            createdAt: "",
            joinDate: "",
            description: "",
            adultContent: "",
            nsfw: "",
          };
        },
      };
      const fileController = new FileController({ UserService });
      await fileController.uploadUserImage(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Please provide correct type of image you want to save",
      });
    });
  });

  describe("multerFilter Test", () => {
    it("first test success", async () => {
      const req = {};
      const file = {
        mimetype: {
          startsWith: (type) => {
            return true;
          },
        },
      };
      let cb = sinon.spy();
      const fileController = new FileController({});
      await fileController.multerFilter(req, file, cb);
      expect(cb).to.have.been.calledWith(null, true);
    });

    it("second test success", async () => {
      const req = {};
      const file = {
        mimetype: {
          startsWith: (type) => {
            return false;
          },
        },
      };
      let cb = sinon.spy();
      const fileController = new FileController({});
      await fileController.multerFilter(req, file, cb);
      expect(cb).to.have.been.calledWith("error", false);
    });
  });
  describe("multerFilter Test", () => {
    it("first test success", async () => {
      const req = {};
      const file = {
        mimetype: {
          startsWith: (type) => {
            return true;
          },
        },
      };
      let cb = sinon.spy();
      const fileController = new FileController({});
      await fileController.getUpload();
    });
  });
});
