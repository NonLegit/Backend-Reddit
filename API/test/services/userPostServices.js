const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const PostService = require("./../../service/postService");

describe("User Post Test", () => {
  describe("User Post services Test", () => {
    describe("setVotePostStatus function ", () => {
      const postservices = new PostService("", "", "", "");
      it("first test,", () => {
        let user = {
          votePost: [
            {
              posts: "1",
              postVoteStatus: "1",
            },
            {
              posts: "2",
              postVoteStatus: "1",
            },
            {
              posts: "3",
              postVoteStatus: "0",
            },
            {
              posts: "4",
              postVoteStatus: "-1",
            },
          ],
        };
        let posts = [
          {
            _id: "1",
          },
          {
            _id: "3",
          },
          {
            _id: "4",
          },
          {
            _id: "6",
          },
        ];
        const result = postservices.setVotePostStatus(user, posts);

        expect(result[0].postVoteStatus).to.equal("1");
        expect(result[1].postVoteStatus).to.equal("0");
        expect(result[2].postVoteStatus).to.equal("-1");
        expect(result[3].postVoteStatus).to.equal("0");
      });
      it("second test", () => {
        let posts = [];
        let user = { votePost: [] };
        const result = postservices.setVotePostStatus(user, posts);
        expect(result.length).to.equal(0);
      });
      it("third test", () => {
        let posts = [
          {
            _id: "1",
          },
          {
            _id: "3",
          },
        ];
        let user = { votePost: [] };
        const result = postservices.setVotePostStatus(user, posts);
        expect(result[0].postVoteStatus).to.equal("0");
        expect(result[1].postVoteStatus).to.equal("0");
      });
    });
    describe("selectPostsWithVotes function ", () => {
      const postservices = new PostService("", "", "", "");
      it("first test,", () => {
        let Posts = [
          {
            posts: { id: "1" },
            postVoteStatus: "1",
          },
          {
            posts: { id: "1" },
            postVoteStatus: "0",
          },
          {
            posts: { id: "1" },
            postVoteStatus: "0",
          },
          {
            posts: { id: "1" },
            postVoteStatus: "0",
          },
        ];
        const result = postservices.selectPostsWithVotes(Posts, "1");

        expect(result.length).to.equal(1);
      });
      it("second test", () => {
        let posts = [];
        let user = { votePost: [] };
        const result = postservices.setVotePostStatus(user, posts);
        expect(result.length).to.equal(0);
      });
      it("third test", () => {
        let posts = [
          {
            _id: "1",
          },
          {
            _id: "3",
          },
        ];
        let user = { votePost: [] };
        const result = postservices.setVotePostStatus(user, posts);
        expect(result[0].postVoteStatus).to.equal("0");
        expect(result[1].postVoteStatus).to.equal("0");
      });
    });
  });
});
