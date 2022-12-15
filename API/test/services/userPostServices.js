const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config();
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

    describe("getUserPosts function ", () => {
      const PostRepository = {
        getUserPosts: async (userId, sortType) => {
          return {
            success: true,
            doc: [
              {
                _id: "1",
                title: "First Post",
                kind: "self",
                text: "this is my first post on NONLEGIT",
                author: "1",
                owner: "1",
                ownerType: "User",
                nsfw: false,
                spoiler: false,
                sendReplies: true,
                suggestedSort: "top",
                scheduled: false,
                votes: 2,
              },
            ],
          };
        },
      };
      const postservices = new PostService({ PostRepository });
      it("first test,", async () => {
        posts = await postservices.getUserPosts("", "");
        console.log(posts);
        expect(posts.length).to.equal(1);
        expect(posts[0]["_id"]).to.equal("1");
      });
    });
    describe("removehiddenposts function ", () => {
      const postservices = new PostService({});
      it("first test,", async () => {
        let user = {
          hidden: ["1", "4"],
        };
        let user2 = {
          hidden: ["10"],
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
        let posts2 = [
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
        const result = postservices.removeHiddenPosts(user, posts);
        const result2 = postservices.removeHiddenPosts(user2, posts2);
        expect(result.length).to.equal(2);
        expect(result2.length).to.equal(4);
      });
    });
    describe("setSavedPostStatus function ", () => {
      const postservices = new PostService({});
      it("first test,", () => {
        let user = {
          saved: [
            {
              savedPost: "1",
            },
            {
              savedPost: "2",
            },
            {
              savedPost: "3",
            },
          ],
        };
        let user2 = {
          saved: [
            {
              savedPost: "10",
            },
            {
              savedPost: "20",
            },
            {
              savedPost: "30",
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
        let posts2 = [
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
        const result = postservices.setSavedPostStatus(user, posts);
        const result2 = postservices.setSavedPostStatus(user2, posts2);
        expect(result.length).to.equal(4);
        expect(result[0]["isSaved"]).to.equal(true);
        expect(result[1]["isSaved"]).to.equal(true);
        expect(result[2]["isSaved"]).to.equal(false);
        expect(result[3]["isSaved"]).to.equal(false);
        expect(result2.length).to.equal(4);
        expect(result2[0]["isSaved"]).to.equal(false);
        expect(result2[1]["isSaved"]).to.equal(false);
        expect(result2[2]["isSaved"]).to.equal(false);
        expect(result2[3]["isSaved"]).to.equal(false);
      });
    });

    describe("setHiddenPostStatus function ", () => {
      const postservices = new PostService({});
      it("first test,", () => {
        let user = {
          hidden: ["1", "4"],
        };
        let user2 = {
          hidden: ["10"],
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
        let posts2 = [
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
        const result = postservices.setHiddenPostStatus(user, posts);
        const result2 = postservices.setHiddenPostStatus(user2, posts2);
        expect(result.length).to.equal(4);
        expect(result[0]["isHidden"]).to.equal(true);
        expect(result[1]["isHidden"]).to.equal(false);
        expect(result[2]["isHidden"]).to.equal(true);
        expect(result[3]["isHidden"]).to.equal(false);
        expect(result2.length).to.equal(4);
        expect(result2[0]["isHidden"]).to.equal(false);
        expect(result2[1]["isHidden"]).to.equal(false);
        expect(result2[2]["isHidden"]).to.equal(false);
        expect(result2[3]["isHidden"]).to.equal(false);
      });
    });

    describe("setPostOwnerData function ", () => {
      const postservices = new PostService({});
      it("first test,", () => {
        let posts = [
          {
            _id: "1",
            ownerType: "User",
            owner: { _id: "1", userName: "ahmed" },
            author: {
              _id: "1",
              userName: "ahmed",
            },
          },
          {
            _id: "3",
            ownerType: "User",
            owner: {
              _id: "3",
              userName: "ahmed2",
            },
            author: {
              _id: "3",
              userName: "ahmed2",
            },
          },
          {
            _id: "4",
            ownerType: "Subreddit",
            owner: {
              _id: "1",
              fixedName: "ahmed3",
            },
            author: {
              _id: "1",
              userName: "ahmed",
            },
          },
          {
            _id: "6",
            ownerType: "Subreddit",
            owner: {
              _id: "2",
              fixedName: "ahmed4",
            },
            author: {
              _id: "1",
              userName: "ahmed",
            },
          },
        ];
        const result = postservices.setPostOwnerData(posts);
        expect(result.length).to.equal(4);
        expect(result[0]["name"]).to.equal("ahmed");
        expect(result[1]["name"]).to.equal("ahmed2");
        expect(result[2]["name"]).to.equal("ahmed3");
        expect(result[3]["name"]).to.equal("ahmed4");
      });
    });
    describe("setVoteStatus function ", () => {
      const postservices = new PostService({});
      it("first test,", () => {
        let saved = [
          {
            savedPost: {
              _id: "1",
              postVoteStatus: "1",
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
            savedPost: {
              _id: "2",
              postVoteStatus: "1",
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
            },
          },
          {
            savedPost: {
              _id: "3",
              postVoteStatus: "1",
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
            },
          },
        ];
        let user = {
          votePost: [
            {
              posts: "1",
              postVoteStatus: "1",
            },
            {
              posts: "2",
              postVoteStatus: "-1",
            },
            {
              posts: "4",
              postVoteStatus: "-1",
            },
          ],
        };
        const result = postservices.setVoteStatus(user, saved);
        expect(result.length).to.equal(3);
        expect(result[0].savedPost.author.name).to.equal("ahmed");
        expect(result[0].savedPost.author._id).to.equal("1");
        expect(result[0].savedPost.owner.name).to.equal("ahmed");
        expect(result[0].savedPost.owner._id).to.equal("1");
        expect(result[0].savedPost.owner.icon).to.equal(
          `${process.env.BACKDOMAIN}/users/default.png`
        );
        expect(result[0].savedPost.ownerType).to.equal("User");
        expect(result[0].savedPost.postVoteStatus).to.equal("1");
        expect(result[1].savedPost.owner.name).to.equal("ahmed");
        expect(result[1].savedPost.owner._id).to.equal("1");
        expect(result[1].savedPost.owner.icon).to.equal(
          "subreddits/default.png"
        );
        expect(result[1].savedPost.ownerType).to.equal("Subreddit");
        expect(result[1].savedPost.postVoteStatus).to.equal("-1");
        expect(result[2].savedPost.owner.name).to.equal("ahmed");
        expect(result[2].savedPost.owner._id).to.equal("1");
        expect(result[2].savedPost.owner.icon).to.equal(
          "subreddits/default.png"
        );
        expect(result[2].savedPost.ownerType).to.equal("Subreddit");
        expect(result[2].savedPost.postVoteStatus).to.equal("0");
      });
    });
  });
});
