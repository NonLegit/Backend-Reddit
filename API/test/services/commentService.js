const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const CommentService = require("./../../service/commentService");

describe("Comment service test", () => {
  const commentRepo = {
    getById: async (id, select) => {
      return { post: "753f647c888b41426fc6abff" };
    },
  };
  const postRepo = {
    getById: async (id, select) => {
      return { _id: "636f647c888b41426fc6abdd" };
    },
  };

  const commentservices = new CommentService(null, commentRepo, postRepo);

  describe("Testing hasValidParent function", () => {
    it("valid post parent", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Post",
        text: "comment text",
      };
      const valid = await commentservices.hasValidParent(comment);
      expect(valid).to.equal(true);
      expect(comment.post).to.equal("636f647c888b41426fc6abdd");
    });

    it("valid comment parent", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      const valid = await commentservices.hasValidParent(comment);
      expect(valid).to.equal(true);
      expect(comment.post).to.equal("753f647c888b41426fc6abff");
    });

    it("invalid comment parent", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Comment",
        text: "comment text",
      };
      commentRepo.getById = (id, select) => false;
      const valid = await commentservices.hasValidParent(comment);
      expect(valid).to.equal(false);
    });

    it("invalid post parent", async () => {
      const comment = {
        parent: "636f647c888b41426fc6abdd",
        parentType: "Post",
        text: "comment text",
      };
      postRepo.getById = (id, select) => false;
      const valid = await commentservices.hasValidParent(comment);
      expect(valid).to.equal(false);
    });
  });

  describe("Testing createComment function", () => {
    it("create comment", async () => {
      const data = {
        author: "1234",
        parent: "636f647c888b41426fc6abdd",
        parentType: "Post",
        text: "comment text",
      };

      const newComment = {
        author: data.author,
        post: data.post,
        mentions: [],
        replies: [],
        parent: data.parent,
        parentType: data.parentType,
        text: data.text,
        createdAt: "2022-11-12T09:14:22.112Z",
        isDeleted: false,
        votes: 0,
        repliesCount: 0,
        _id: "636f648a888b41426fc6abe2",
        __v: 0,
      };
      commentRepo.createOne = async (data) => {
        return {
          doc: newComment,
        };
      };
      postRepo.updateOne = () => {};
      const comment = await commentservices.createComment(data);
      expect(comment).to.equal(newComment);
    });
  });
});
