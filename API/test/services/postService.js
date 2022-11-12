const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const PostService = require("./../../service/postService");

describe("Post service test", () => {
  describe("Testing isValidPost function", () => {
    const subredditRepo = {
      isValidId: async (owner) => true,
    };
    const postservices = new PostService("", "", subredditRepo, "");
    it("valid post,", async () => {
      const data = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        ownerType: "Subreddit",
      };
      const valid = await postservices.isValidPost(data);
      expect(valid).to.equal(true);
    });
    it("missing required param,", async () => {
      const data = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
      };
      const valid = await postservices.isValidPost(data);
      expect(valid).to.equal(false);
    });
    it("Invalid owner", async () => {
      const data = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        ownerType: "Subreddit",
      };

      subredditRepo.isValidId = (owner) => false;

      const valid = await postservices.isValidPost(data);
      expect(valid).to.equal(false);
    });

    it("Invalid post type", async () => {
      const data = {
        title: "kiro post",
        kind: "self",
        url: "kiro@gmail.com",
        owner: "636d493c3ff67d626ec990d0",
        ownerType: "Subreddit",
      };

      const valid = await postservices.isValidPost(data);
      expect(valid).to.equal(false);
    });

    it("Added author as owner in case of ownerType: User", async () => {
      const data = {
        title: "kiro post",
        kind: "self",
        text: "Post text",
        ownerType: "User",
        author: "12345678"
      };

      const valid = await postservices.isValidPost(data);
      expect(valid).to.equal(true);
      expect(data.owner).to.equal(data.author);
    });
  });
});
