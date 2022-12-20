const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const CommentController = require("./../../controllers/commentController");
const { commentErrors } = require("./../../error_handling/errors");
dotenv.config();
chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("Comment Controller CRUD operations", () => {
  describe("Create comment test", () => {
    const req = {
      user: {
        _id: "123e4aab2a94c22ae492983a",
      },
      body: {
        parent: "637769a739070007b3bf4de1",
        parentType: "Comment",
        text: "comment text",
      },
    };

    const UserService = {};
    const CommentService = {
      createComment: async (data) => {
        return { success: true, data };
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("successful creation", async () => {
      await commentController.createComment(req, res, () => {
        return true;
      });
      expect(res.status).to.have.been.calledWith(201);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        data: {
          author: "123e4aab2a94c22ae492983a",
          parent: "637769a739070007b3bf4de1",
          parentType: "Comment",
          text: "comment text",
        },
      });
    });

    it("Invalid parent", async () => {
      CommentService.createComment = async (data) => {
        return { success: false, error: commentErrors.INVALID_PARENT };
      };
      await commentController.createComment(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Invalid parent, couldn't create comment",
      });
    });

    it("mongo error", async () => {
      CommentService.createComment = async (data) => {
        return {
          success: false,
          error: commentErrors.MONGO_ERR,
          msg: "message",
        };
      };
      await commentController.createComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "message",
      });
    });

    it("Invalid request", async () => {
      delete req.body.parent;
      await commentController.createComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Missing required parameter",
      });
    });
  });

  describe("Update comment test", () => {
    const req = {
      user: {
        _id: "123e4aab2a94c22ae492983a",
      },
      params: {
        commentId: "456p4aab2a94c22ae492983a",
      },
      body: {
        text: "this is a comment",
      },
    };
    const UserService = {};
    const CommentService = {
      updateComment: async (id, data, userId) => {
        return { success: true, data };
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("successful update", async () => {
      await commentController.updateComment(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        data: {
          text: "this is a comment",
        },
      });
    });

    it("User must be author", async () => {
      CommentService.updateComment = async (data) => {
        return { success: false, error: commentErrors.NOT_AUTHOR };
      };
      await commentController.updateComment(req, res, "");
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "User must be author",
      });
    });

    it("Comment not found", async () => {
      CommentService.updateComment = async (data) => {
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };
      };
      await commentController.updateComment(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comment not found",
      });
    });

    it("mongo error", async () => {
      CommentService.updateComment = async (data) => {
        return {
          success: false,
          error: commentErrors.MONGO_ERR,
          msg: "message",
        };
      };
      await commentController.updateComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "message",
      });
    });

    it("Invalid request", async () => {
      delete req.params;
      await commentController.updateComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Invalid request",
      });
    });
  });

  describe("Delete comment test", () => {
    const req = {
      user: {
        _id: "123e4aab2a94c22ae492983a",
      },
      params: {
        commentId: "456p4aab2a94c22ae492983a",
      },
      body: {
        text: "this is a comment",
      },
    };
    const UserService = {};
    const CommentService = {
      deleteComment: async () => {
        return { success: true };
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("successful delete", async () => {
      await commentController.deleteComment(req, res, "");
      expect(res.status).to.have.been.calledWith(204);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        data: null,
      });
    });

    it("User must be author", async () => {
      CommentService.deleteComment = async () => {
        return { success: false, error: commentErrors.NOT_AUTHOR };
      };
      await commentController.deleteComment(req, res, "");
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "User must be author",
      });
    });

    it("Comment not found", async () => {
      CommentService.deleteComment = async () => {
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };
      };
      await commentController.deleteComment(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comment not found",
      });
    });

    it("Invalid request", async () => {
      delete req.params.commentId;
      await commentController.deleteComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Missing required parameter commentId",
      });
    });
  });
});
