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

    it("parent locked", async () => {
      CommentService.createComment = async (data) => {
        return { success: false, error: commentErrors.PARANT_LOCKED };
      };
      await commentController.createComment(req, res, "");
      expect(res.status).to.have.been.calledWith(409);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Parent is locked, comments are not allowed"
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

  describe("Comment tree test", () => {
    const req = {
      user: {
        _id: "123u4aab2a94c22ae492983a",
      },
      params: {
        postId: "123p4aab2a94c22ae492983a",
      },
      query: {
        limit: 10,
        depth: 5,
        sort: "new",
        commentId: "123c4aab2a94c22ae492983a",
      },
    };
    const UserService = {};
    const CommentService = {
      commentTree: async () => {
        const tree = [];
        return { success: true, tree };
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("comment tree", async () => {
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        comments: [],
      });
    });

    it("default parameters", async () => {
      delete req.query.limit;
      delete req.query.depth;
      delete req.query.sort;
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        comments: [],
      });
    });

    it("post not found", async () => {
      CommentService.commentTree = () => {
        return { success: false, error: commentErrors.POST_NOT_FOUND };
      };
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Post not found",
      });
    });

    it("comment not found", async () => {
      CommentService.commentTree = () => {
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };
      };
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comment not found",
      });
    });

    it("comment not child", async () => {
      CommentService.commentTree = () => {
        return { success: false, error: commentErrors.COMMENT_NOT_CHILD };
      };
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comment is not a child of post",
      });
    });

    it("Invalid request", async () => {
      delete req.params;
      await commentController.commentTree(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Invalid request",
      })
    })
  })
  
  describe("commentVote Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        addVote: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.commentVote(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        addVote: (me, posts) => {
          return false;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.commentVote(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(304).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("thrid test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return true;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        addVote: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.commentVote(req, res, "");
      expect(res.status).to.have.been.calledWith(405);
      expect(res.status(405).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Method Not Allowed",
      });
    });
    it("fourth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        addVote: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.commentVote(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Comment Not Found",
      });
    });
    it("fifth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 2,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        addVote: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.commentVote(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("More children test", () => {
    const req = {
      user: {
        _id: "123u4aab2a94c22ae492983a",
      },
      params: {
        postId: "123p4aab2a94c22ae492983a",
      },
      query: {
        limit: 10,
        depth: 5,
        sort: "new",
        children: "123c4aab2a94c22ae492983a, 123c4aab2a94c22ae492983a",
      },
    };
    const UserService = {};
    const CommentService = {
      moreChildren: async () => {
        return [
          { _id: "123c4aab2a94c22ae492983a" },
          { _id: "123c4aab2a94c22ae492983a" },
        ];
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("more children", async () => {
      await commentController.moreChildren(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        comments: [
          { _id: "123c4aab2a94c22ae492983a" },
          { _id: "123c4aab2a94c22ae492983a" },
        ],
      });
    });

    it("no children found", async () => {
      CommentService.moreChildren = async () => [];
      await commentController.moreChildren(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comments not found",
      });
    });

    it("default parameters", async () => {
      delete req.query.limit;
      delete req.query.depth;
      delete req.query.sort;
      await commentController.moreChildren(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        status: "success",
        comments: [],
      });
    });

    it("children are missing", async () => {
      delete req.query.children;
      await commentController.moreChildren(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Children query parameter is required",
      });
    });
  });

  describe("Must be moderator test", () => {
    const req = {
      user: {
        _id: "123u4aab2a94c22ae492983a",
      },
      params: {
        commentId: "123p4aab2a94c22ae492983a",
      },
    };
    const UserService = {};
    const CommentService = {
      isMod: async () => {
        return { success: true };
      },
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("moderator", async () => {
      await commentController.mustBeMod(req, res, next);
      expect(res.status).to.have.been.calledWith(200);
      //expect(res.status().json).to.have.been.calledWith({});
    });

    it("not moderator", async () => {
      CommentService.isMod = () => {
        return { success: false, error: commentErrors.NOT_MOD };
      };
      await commentController.mustBeMod(req, res, next);
      expect(res.status).to.have.been.calledWith(401);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "User must be moderator",
      });
    });

    it("not subreddit", async () => {
      CommentService.isMod = () => {
        return { success: false, error: commentErrors.OWNER_NOT_SUBREDDIT };
      };
      await commentController.mustBeMod(req, res, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "The comment must belong to a subreddit",
      });
    });

    it("comment not found", async () => {
      CommentService.isMod = () => {
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };
      };
      await commentController.mustBeMod(req, res, next);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Comment not found",
      });
    });

    it("Invalid request", async () => {
      delete req.params;
      await commentController.mustBeMod(req, res, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Invalid request",
      });
    });

  });

  describe("Moderate comment test", () => {
    const req = {
      user: {
        _id: "123u4aab2a94c22ae492983a",
      },
      params: {
        commentId: "123p4aab2a94c22ae492983a",
        action: "approve"
      },
    };
    const UserService = {};
    const CommentService = {
      modAction: async () => true
    };
    const commentController = new CommentController({
      CommentService,
      UserService,
    });

    it("successful action", async () => {
      await commentController.moderateComment(req, res, next);
      expect(res.status).to.have.been.calledWith(204);
      expect(res.status().json).to.have.been.calledWith({});
    });

    it("action arleady done", async () => {
      CommentService.modAction = () => false
      await commentController.moderateComment(req, res, next);
      expect(res.status).to.have.been.calledWith(409);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Action is already performed",
      });
    });

    it("Invalid request", async () => {
      req.params.action = "not a valid action"
      await commentController.moderateComment(req, res, next);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({
        status: "fail",
        message: "Invalid comment moderation action",
      });
    });

  });

  describe("saveComment Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        saveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.saveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        saveComment: (me, posts) => {
          return false;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.saveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(304).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("thrid test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return true;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        saveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.saveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(405);
      expect(res.status(405).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Method Not Allowed",
      });
    });
    it("fourth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        saveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.saveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Comment Not Found",
      });
    });
    it("fifth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 2,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        saveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.saveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("unSaveComment Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSaveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.unSaveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("second test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSaveComment: (me, posts) => {
          return false;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.unSaveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(304).json).to.have.been.calledWith({
        status: "success",
      });
    });
    it("thrid test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return true;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSaveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.unSaveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(405);
      expect(res.status(405).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Method Not Allowed",
      });
    });
    it("fourth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 1,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSaveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.unSaveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Comment Not Found",
      });
    });
    it("fifth test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          postId: "Ahmed",
        },
        body: {
          dir: 2,
        },
      };
      const UserService = {
        checkBlockStatus: async (user, me) => {
          return false;
        },
      };
      const CommentService = {
        findCommentById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSaveComment: (me, posts) => {
          return true;
        },
      };

      const commentController = new CommentController({
        CommentService,
        UserService,
      });
      await commentController.unSaveComment(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("getUserComments Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          userName: "Ahmed",
        },
        query: {
          sort: "New",
          limit: -1,
          page: -1,
        },
      };
      const UserService = {
        getUserByName: async (userName, dummy) => {
          return {
            success: true,
            data: {
              _id: "2",
            },
          };
        },
        checkBlockStatus: async (me, user) => {
          return false;
        },
      };
      const CommentService = {
        getUserComments: async (userid, sorttype) => {
          let posts = [
            {
              _id: "1",
            },
          ];
          return posts;
        },
      };

      const commentController = new CommentController({ CommentService, UserService });
      await commentController.getUserComments(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "1",
          },
        ],
      });
    });
    it("third test fail", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          userName: "ahmed",
        },
        query: {
          sortType: "New",
        },
      };
      const UserService = {
        getUserByName: async (userName, dummy) => {
          return {
            success: false,
          };
        },
        checkBlockStatus: async (me, user) => {
          return false;
        },
      };
      const CommentService = {};
      const commentController = new CommentController({ CommentService, UserService });
      await commentController.getUserComments(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
    it("fourth test fail", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          userName: "ahmed",
        },
        query: {
          sortType: "New",
        },
      };
      const UserService = {
        getUserByName: async (userName, dummy) => {
          return {
            success: true,
            data: {
              _id: "2",
            },
          };
        },
        checkBlockStatus: async (me, user) => {
          return true;
        },
      };
      const CommentService = {};
      const commentController = new CommentController({ CommentService, UserService });
      await commentController.getUserComments(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [],
      });
    });
  });
});
