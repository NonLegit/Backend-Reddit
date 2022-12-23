const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
const CommentService = require("./../../service/commentService");
const { commentErrors } = require("../../error_handling/errors");
const { ECDH } = require("crypto");
const ObjectId = require("mongoose").Types.ObjectId;

describe("Comment service test", () => {
  describe("create comment", () => {
    const CommentRepository = {
      createOne: async (data) => {
        const doc = { ...data };
        data.populate = () => {};
        data.author = {
          _id: "639cb530000510cd174a7c15",
          userName: "kiro",
          profilePicture: "/users/default.png",
          profileBackground: "/users/defaultcover.png",
        };
        return { success: true, doc: data };
      },
      getComment: async () => {
        return {
          success: true,
          doc: {
            _id: "1",
            text: "text",
            type: "Post",
            author: {
              _id: "2",
            },
          },
        };
      },
      addReply: async (parent, child) => {},
      findById: async (id, fields) => {
        return {
          success: true,
          doc: { post: "456c5fccf267fc3a463b35e4" },
        };
      },
    };
    const PostRepository = {
      exists: async (id, fields) => {
        return {
          success: true,
          doc: {
            flairIds: ["123d493c3ff67d626ec994f7", "666d493c3ff67d626ec990d1"],
          },
        };
      },
      addReply: async (parent, child) => {},
      incReplies: async (postId) => {},
    };
    const commentServices = new CommentService({
      CommentRepository,
      PostRepository,
    });
    let comment;
    it("successful comment create", async () => {
      comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      const { success, data } = await commentServices.createComment(comment);
      expect(success).to.equal(true);
      comment.post = "456c5fccf267fc3a463b35e4";
      expect(data).to.eql(comment);
    });
    it("error in data access layer", async () => {
      CommentRepository.createOne = async (id, fields) => {
        return { success: false };
      };
      comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      const { success, error } = await commentServices.createComment(comment);
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.MONGO_ERR);
    });
    it("Invalid parent", async () => {
      CommentRepository.findById = async (id, fields) => {
        return { success: false };
      };
      comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      const { success, error } = await commentServices.createComment(comment);
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.INVALID_PARENT);
    });
  });

  describe("Testing update comment", () => {
    const CommentRepository = {
      findById: async (id, fields) => {
        const comment = {
          author: ObjectId("578a5fccf267fc3a463b35e4"),
        };
        return { success: true, doc: comment };
      },
      updateText: async (id, text) => {
        const comment = {
          text: "updated comment text",
        };
        return { doc: comment };
      },
    };
    const PostRepository = {};
    const commentServices = new CommentService({
      CommentRepository,
      PostRepository,
    });
    let data = {
      text: "updated comment text",
    };
    let id = "636a5fccf267fc3a463b35d9";
    let userId = "578a5fccf267fc3a463b35e4";
    it("successful comment update", async () => {
      const { success, data: updatedData } =
        await commentServices.updateComment(id, data, userId);
      expect(success).to.equal(true);
      expect(updatedData.text).to.equal("updated comment text");
    });
    it("unathorized user", async () => {
      userId = "578a5fccf267fc3a463b35e";
      const { success, error } = await commentServices.updateComment(
        id,
        data,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.NOT_AUTHOR);
    });
    it("comment not found", async () => {
      CommentRepository.findById = async (id, fields) => {
        return { success: false };
      };
      const { success, error } = await commentServices.updateComment(
        id,
        data,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.COMMENT_NOT_FOUND);
    });
  });

  describe("Testing delete comment", () => {
    const CommentRepository = {
      exists: async (id, fields) => {
        const comment = {
          author: ObjectId("578a5fccf267fc3a463b35e4"),
          parent: ObjectId("578a5fccf267fc3a463b35e4"),
          parentType: "Comment",
        };
        return { success: true, doc: comment };
      },
      deleteComment: async (id) => {},
      removeReply: async (parent, child) => {},
    };
    const PostRepository = {
      removeReply: async (parent, child) => {},
    };
    const commentServices = new CommentService({
      CommentRepository,
      PostRepository,
    });
    let id = "636a5fccf267fc3a463b35d9";
    let userId = "578a5fccf267fc3a463b35e4";
    it("successful comment delete(parent is comment)", async () => {
      const { success } = await commentServices.deleteComment(id, userId);
      expect(success).to.equal(true);
    });
    it("successful comment delete(parent is post)", async () => {
      const { success } = await commentServices.deleteComment(id, userId);
      expect(success).to.equal(true);
    });
    it("unathorized user", async () => {
      userId = "578a5fccf267fc3a463b35e8";
      const { success, error } = await commentServices.deleteComment(
        id,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.NOT_AUTHOR);
    });
    it("comment not found", async () => {
      CommentRepository.exists = async (id, fields) => {
        return { success: false };
      };
      const { success, error } = await commentServices.deleteComment(
        id,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(commentErrors.COMMENT_NOT_FOUND);
    });
  });

  describe("Testing hasValidParent function", () => {
    const CommentRepository = {
      findById: async (id, fields) => {
        return {
          success: true,
          doc: { post: "456c5fccf267fc3a463b35e4" },
        };
      },
    };
    const PostRepository = {
      findById: async (id, fields) => {
        return {
          success: true,
          doc: { _id: "123p5fccf267fc3a463b35e4" },
        };
      },
    };
    const commentServices = new CommentService({
      CommentRepository,
      PostRepository,
    });
    it("valid parent(Comment)", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      const valid = await commentServices.hasValidParent(comment);
      expect(valid.success).to.equal(true);
      //expect(comment.post).to.equal("456c5fccf267fc3a463b35e4");
    });

    it("valid parent(post)", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Post",
        text: "comment text",
      };
      const valid = await commentServices.hasValidParent(comment);
      expect(valid.success).to.equal(true);
      //expect(comment.post).to.equal("123p5fccf267fc3a463b35e4");
    });

    it("invalid parent(Comment)", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      CommentRepository.findById = async (id, fields) => {
        return { success: false };
      };
      const valid = await commentServices.hasValidParent(comment);
      expect(valid.success).to.equal(false);
    });

    it("invalid parent(Post)", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Post",
        text: "comment text",
      };
      PostRepository.findById = async (id, fields) => {
        return { success: false };
      };
      const valid = await commentServices.hasValidParent(comment);
      expect(valid.success).to.equal(false);
    });
  });

  describe("get users comments", async () => {
    it("first test ", async () => {
      const CommentRepository = {
        getUserComments: async () => {
          return {
            doc: [
              {
                _id: "1",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "1",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "User",
                  owner: {
                    _id: "1",
                    userName: "ahmed",
                    profilePicture: "users/default.png",
                  },
                },
              },
              {
                _id: "2",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "1",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "User",
                  owner: {
                    _id: "1",
                    userName: "ahmed",
                    profilePicture: "users/default.png",
                  },
                },
              },
              {
                _id: "3",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "1",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "User",
                  owner: {
                    _id: "1",
                    userName: "ahmed",
                    profilePicture: "users/default.png",
                  },
                },
              },
            ],
          };
        },
      };
      const user = {
        voteComment: [
          { comments: "1", commentVoteStatus: "1" },
          { comments: "2", commentVoteStatus: "-1" },
        ],
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "3",
          },
        ],
      };
      const PostRepository = {};
      const commentServices = new CommentService({
        CommentRepository,
        PostRepository,
      });
      const comments = await commentServices.getUserComments("1", user, "");
      expect(comments.length).to.equal(1);
    });

    it("second test ", async () => {
      const CommentRepository = {
        getUserComments: async () => {
          return {
            doc: [
              {
                _id: "1",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "1",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "User",
                  owner: {
                    _id: "1",
                    userName: "ahmed",
                    profilePicture: "users/default.png",
                  },
                },
              },
              {
                _id: "2",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "2",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "User",
                  owner: {
                    _id: "1",
                    userName: "ahmed",
                    profilePicture: "users/default.png",
                  },
                },
              },
              {
                _id: "3",
                mentions: [],
                parent: "1",
                parentType: "Post",
                text: "1",
                votes: "1",
                repliesCount: 0,
                createdAt: "",
                isDeleted: "1",
                sortOnHot: 5,
                author: {
                  _id: "1",
                  userName: "ahmed",
                },
                post: {
                  _id: "1",
                  author: {
                    _id: "1",
                    userName: "ahmed",
                  },
                  ownerType: "Subreddit",
                  owner: {
                    _id: "1",
                    fixedName: "ahmed",
                    icon: "users/default.png",
                  },
                },
              },
            ],
          };
        },
      };
      const user = {
        voteComment: [
          { comments: "1", commentVoteStatus: "1" },
          { comments: "2", commentVoteStatus: "-1" },
        ],
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "3",
          },
        ],
      };
      const PostRepository = {};
      const commentServices = new CommentService({
        CommentRepository,
        PostRepository,
      });
      const comments = await commentServices.getUserComments("1", user, "");
      expect(comments.length).to.equal(3);
    });
  });


  describe("addVote function ", () => {
    it("first test ", async () => {
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: -1,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
        save: async () => {},
      };
      let author = {
        commentKarma: 0,
        save: async () => {},
      };
      const CommentRepository = {
        updateVotesCount: async (data) => {
          return { success: true };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.addVote(user, "2", 1, 0, author);
      expect(result).to.equal(true);
    });

    it("second test", async () => {
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: -1,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
        save: async () => {},
      };
      let author = {
        commentKarma: 0,
        save: async () => {},
      };
      const CommentRepository = {
        updateVotesCount: async (data) => {
          return { success: true };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.addVote(user, "5", 1, 0, author);
      expect(result).to.equal(true);
    });

    it("thrid test ", async () => {
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: -1,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
        save: async () => {},
      };
      let author = {
        commentKarma: 0,
        save: async () => {},
      };
      const CommentRepository = {
        updateVotesCount: async (data) => {
          return { success: true };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.addVote(user, "2", -1, 0, author);
      expect(result).to.equal(false);
    });

    it("fourth test ", async () => {
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: -1,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
        save: async () => {},
      };
      let author = {
        commentKarma: 0,
        save: async () => {},
      };
      const CommentRepository = {
        updateVotesCount: async (data) => {
          return { success: true };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.addVote(user, "1", 0, 0, author);
      expect(result).to.equal(true);
    });

    it("fifth test ", async () => {
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: 0,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
        save: async () => {},
      };
      let author = {
        commentKarma: 0,
        save: async () => {},
      };
      const CommentRepository = {
        updateVotesCount: async (data) => {
          return { success: true };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.addVote(user, "2", 1, 0, author);
      expect(result).to.equal(true);
    });

  });

  describe("saveComment function ", () => {
    it("first test ", async () => {
      let user = {
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "2",
          },
          {
            savedComment: "4",
          },
        ],
        save: async () => {},
      };
      const CommentServices = new CommentService({});
      const result = await CommentServices.saveComment(user, "1");
      expect(result).to.equal(false);
    });

    it("second test ", async () => {
      let user = {
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "2",
          },
          {
            savedComment: "4",
          },
        ],
        save: async () => {},
      };
      const CommentServices = new CommentService({});
      const result = await CommentServices.saveComment(user, "3");
      expect(result).to.equal(true);
    });
  });

  describe("unSaveComment function ", () => {
    it("first test ", async () => {
      Array.prototype.pull = function (elem) {
        var i = this.indexOf(elem);

        if (i === -1)
          //w  w w  . j a  v a  2s .  c  o  m
          return;

        return this.splice(i, 1);
      };
      let user = {
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "2",
          },
          {
            savedComment: "4",
          },
        ],
        save: async () => {},
      };
      const CommentServices = new CommentService({});
      const result = await CommentServices.unSaveComment(user, "1");
      expect(result).to.equal(true);
    });

    it("second test ", async () => {
      let user = {
        savedComments: [
          {
            savedComment: "1",
          },
          {
            savedComment: "2",
          },
          {
            savedComment: "4",
          },
        ],
        save: async () => {},
      };
      const CommentServices = new CommentService({});
      const result = await CommentServices.unSaveComment(user, "3");
      expect(result).to.equal(false);
    });
  });

  describe("findCommentById function ", () => {
    it("first test ", async () => {
      const CommentRepository = {
        getCommentwithAuthor: async (data) => {
          return { success: true, doc: [] };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.findCommentById("1");
      expect(result.success).to.equal(true);
    });
    it("second test ", async () => {
      const CommentRepository = {
        getCommentwithAuthor: async (data) => {
          return { success: false, doc: [] };
        },
      };
      const CommentServices = new CommentService({ CommentRepository });
      const result = await CommentServices.findCommentById("1");
      expect(result.success).to.equal(false);
    });
  });

  describe("setVoteStatus function ", () => {
    const CommentServices = new CommentService({});
    it("first test ", () => {
      let saved = [
        {
          savedComment: {
            _id: "1",
            post:{
              _id:"1",
              title:"",
              author:{
                _id:"1",
                userName:"ahmed",
                profilePicture:"icon.png"
              },
              ownerType:"User",
              owner:{
                _id:"1",
                userName:"ahmed",
                profilePicture:"icon.png"
              },
              text:"",
              nsfw:"",
              flairId:"",
            },
            commentVoteStatus: 1,
            owner: {
              _id: "1",
              userName: "ahmed",
              profilePicture: "users/default.png",
            },
            ownerType: "User",
            author: {
              _id: "1",
              userName: "ahmed",
            },
          },
        },
        {
          savedComment: {
            _id: "2",
            commentVoteStatus: 1,
            owner: {
              _id: "1",
              fixedName: "ahmed",
              icon: "subreddits/default.png",
            },
            ownerType: "Subreddit",
            author: {
              _id: "1",
              userName: "ahmed",
            },
            post:{
              _id:"1",
              title:"",
              author:{
                _id:"1",
                userName:"ahmed",
                profilePicture:"icon.png"
              },
              ownerType:"Subreddit",
              owner:{
                _id:"1",
                fixedName:"ahmed",
                icon:"icon.png"
              },
              text:"",
              nsfw:"",
              flairId:"",
            },
          },
        },
        {
          savedComment: {
            _id: "3",
            commentVoteStatus: 1,
            owner: {
              _id: "1",
              fixedName: "ahmed",
              icon: "subreddits/default.png",
            },
            ownerType: "Subreddit",
            author: {
              _id: "1",
              userName: "ahmed",
            },
            post:{
              _id:"2",
              title:"",
              author:{
                _id:"1",
                userName:"ahmed",
                profilePicture:"icon.png"
              },
              ownerType:"Subreddit",
              owner:{
                _id:"1",
                fixedName:"ahmed",
                icon:"icon.png"
              },
              text:"",
              nsfw:"",
              flairId:"",
            },
          },
        },
      ];
      let user = {
        voteComment: [
          {
            comments: "1",
            commentVoteStatus: 1,
          },
          {
            comments: "2",
            commentVoteStatus: -1,
          },
          {
            comments: "4",
            commentVoteStatus: -1,
          },
        ],
      };
      const result = CommentServices.setVoteStatus(user, saved);
      expect(result.length).to.equal(2);
    });
  });

});
