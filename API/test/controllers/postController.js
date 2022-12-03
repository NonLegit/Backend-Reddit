const assert = require("chai").assert;
const expect = require("chai").expect;
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const dotenv = require("dotenv");
const auth = require("./../../controllers/postController");
const {
  postErrors,
  subredditErrors,
} = require("./../../error_handling/errors");
dotenv.config();
chai.use(sinonChai);

const statusJsonSpy = sinon.spy();
const next = sinon.spy();
const res = {
  json: sinon.spy(),
  status: sinon.stub().returns({ json: statusJsonSpy }),
  cookie: sinon.spy(),
};

describe("Post Controller Test", () => {
  describe("userPosts Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {
          userName: "Ahmed",
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
      };
      const PostService = {
        getUserPosts: async (userid, sorttype) => {
          let posts = [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
              replies: [],
              title: "First Post",
              kind: "self",
              text: "this is my first post on NONLEGIT",
              images: [],
              createdAt: "2022-11-23T19:29:21.916Z",
              locked: false,
              isDeleted: false,
              sendReplies: true,
              nsfw: false,
              spoiler: false,
              votes: 2,
              views: 0,
              commentCount: 0,
              shareCount: 0,
              suggestedSort: "top",
              scheduled: false,
              postVoteStatus: "1",
              isSaved: false,
              isHidden: false,
              name: "Nour",
            },
          ];
          return posts;
        },
        setVotePostStatus: (me, posts) => {
          return posts;
        },
        setSavedPostStatus: (me, posts) => {
          return posts;
        },
        setHiddenPostStatus: (me, posts) => {
          return posts;
        },
        setPostOwnerData: (posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.userPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            replies: [],
            title: "First Post",
            kind: "self",
            text: "this is my first post on NONLEGIT",
            images: [],
            createdAt: "2022-11-23T19:29:21.916Z",
            locked: false,
            isDeleted: false,
            sendReplies: true,
            nsfw: false,
            spoiler: false,
            votes: 2,
            views: 0,
            commentCount: 0,
            shareCount: 0,
            suggestedSort: "top",
            scheduled: false,
            postVoteStatus: "1",
            isSaved: false,
            isHidden: false,
            name: "Nour",
          },
        ],
      });
    });

    it("second test fail", async () => {
      const req = {
        user: {
          _id: "1",
        },
        params: {},
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
      };
      const PostService = {};
      const authObj = new auth({ PostService, UserService });
      await authObj.userPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Provide userName ",
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
      };
      const PostService = {};
      const authObj = new auth({ PostService, UserService });
      await authObj.userPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
      });
    });
  });
  ////////////////////////////////////////////////////

  describe("getSavedPosts Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          saved: [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
              replies: [],
              title: "First Post",
              kind: "self",
              text: "this is my first post on NONLEGIT",
              images: [],
              createdAt: "2022-11-23T19:29:21.916Z",
              locked: false,
              isDeleted: false,
              sendReplies: true,
              nsfw: false,
              spoiler: false,
              votes: 2,
              views: 0,
              commentCount: 0,
              shareCount: 0,
              suggestedSort: "top",
              scheduled: false,
              postVoteStatus: "1",
              isSaved: false,
              isHidden: false,
              name: "Nour",
            },
          ],
          populate: async (saved, dummy) => {
            return [];
          },
        },
        params: {
          userName: "Ahmed",
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
      };
      const PostService = {
        setVotePostStatus: (me, posts) => {
          return posts;
        },
        removeHiddenPosts: (me, posts) => {
          return posts;
        },
        setPostOwnerData: (posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.getSavedPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            replies: [],
            title: "First Post",
            kind: "self",
            text: "this is my first post on NONLEGIT",
            images: [],
            createdAt: "2022-11-23T19:29:21.916Z",
            locked: false,
            isDeleted: false,
            sendReplies: true,
            nsfw: false,
            spoiler: false,
            votes: 2,
            views: 0,
            commentCount: 0,
            shareCount: 0,
            suggestedSort: "top",
            scheduled: false,
            postVoteStatus: "1",
            isSaved: false,
            isHidden: false,
            name: "Nour",
          },
        ],
      });
    });
  });

  describe("getHiddenPosts Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          hidden: [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
              replies: [],
              title: "First Post",
              kind: "self",
              text: "this is my first post on NONLEGIT",
              images: [],
              createdAt: "2022-11-23T19:29:21.916Z",
              locked: false,
              isDeleted: false,
              sendReplies: true,
              nsfw: false,
              spoiler: false,
              votes: 2,
              views: 0,
              commentCount: 0,
              shareCount: 0,
              suggestedSort: "top",
              scheduled: false,
              postVoteStatus: "1",
              isSaved: false,
              isHidden: true,
              name: "Nour",
            },
          ],
          populate: async (saved, dummy) => {
            return [];
          },
        },
        params: {
          userName: "Ahmed",
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
      };
      const PostService = {
        setVotePostStatus: (me, posts) => {
          return posts;
        },
        removeHiddenPosts: (me, posts) => {
          return posts;
        },
        setPostOwnerData: (posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.getHiddenPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            replies: [],
            title: "First Post",
            kind: "self",
            text: "this is my first post on NONLEGIT",
            images: [],
            createdAt: "2022-11-23T19:29:21.916Z",
            locked: false,
            isDeleted: false,
            sendReplies: true,
            nsfw: false,
            spoiler: false,
            votes: 2,
            views: 0,
            commentCount: 0,
            shareCount: 0,
            suggestedSort: "top",
            scheduled: false,
            postVoteStatus: "1",
            isSaved: false,
            isHidden: true,
            name: "Nour",
          },
        ],
      });
    });
  });

  describe("userUpvotedPosts Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          votePost: [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
              replies: [],
              title: "First Post",
              kind: "self",
              text: "this is my first post on NONLEGIT",
              images: [],
              createdAt: "2022-11-23T19:29:21.916Z",
              locked: false,
              isDeleted: false,
              sendReplies: true,
              nsfw: false,
              spoiler: false,
              votes: 2,
              views: 0,
              commentCount: 0,
              shareCount: 0,
              suggestedSort: "top",
              scheduled: false,
              postVoteStatus: "1",
              isSaved: false,
              isHidden: true,
              name: "Nour",
            },
          ],
          populate: async (saved, dummy) => {
            return [];
          },
        },
        params: {
          userName: "Ahmed",
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
      };
      const PostService = {
        selectPostsWithVotes: (me, posts) => {
          return posts;
        },
        setSavedPostStatus: (me, posts) => {
          return posts;
        },
        setHiddenPostStatus: (me, posts) => {
          return posts;
        },
        setPostOwnerData: (posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.userUpvotedPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            replies: [],
            title: "First Post",
            kind: "self",
            text: "this is my first post on NONLEGIT",
            images: [],
            createdAt: "2022-11-23T19:29:21.916Z",
            locked: false,
            isDeleted: false,
            sendReplies: true,
            nsfw: false,
            spoiler: false,
            votes: 2,
            views: 0,
            commentCount: 0,
            shareCount: 0,
            suggestedSort: "top",
            scheduled: false,
            postVoteStatus: "1",
            isSaved: false,
            isHidden: true,
            name: "Nour",
          },
        ],
      });
    });
  });

  describe("userDownvotedPosts Test", () => {
    it("first test success", async () => {
      const req = {
        user: {
          _id: "1",
          votePost: [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
              replies: [],
              title: "First Post",
              kind: "self",
              text: "this is my first post on NONLEGIT",
              images: [],
              createdAt: "2022-11-23T19:29:21.916Z",
              locked: false,
              isDeleted: false,
              sendReplies: true,
              nsfw: false,
              spoiler: false,
              votes: 2,
              views: 0,
              commentCount: 0,
              shareCount: 0,
              suggestedSort: "top",
              scheduled: false,
              postVoteStatus: "1",
              isSaved: false,
              isHidden: true,
              name: "Nour",
            },
          ],
          populate: async (saved, dummy) => {
            return [];
          },
        },
        params: {
          userName: "Ahmed",
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
      };
      const PostService = {
        selectPostsWithVotes: (me, posts) => {
          return posts;
        },
        setSavedPostStatus: (me, posts) => {
          return posts;
        },
        setHiddenPostStatus: (me, posts) => {
          return posts;
        },
        setPostOwnerData: (posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.userDownvotedPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            replies: [],
            title: "First Post",
            kind: "self",
            text: "this is my first post on NONLEGIT",
            images: [],
            createdAt: "2022-11-23T19:29:21.916Z",
            locked: false,
            isDeleted: false,
            sendReplies: true,
            nsfw: false,
            spoiler: false,
            votes: 2,
            views: 0,
            commentCount: 0,
            shareCount: 0,
            suggestedSort: "top",
            scheduled: false,
            postVoteStatus: "1",
            isSaved: false,
            isHidden: true,
            name: "Nour",
          },
        ],
      });
    });
  });
});
/*
describe("Post controller test", () => {
  describe("Create post Test", () => {
    it("successful post creation", async () => {
      await seeder();
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(res.status).to.equal(201);
    });

    it("unsuccessful post creation", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      res = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "Subreddit",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(res.status).to.equal(400);
    });
  });

  describe("Delete post Test", () => {
    it("successful deletion", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      deleteRes = await request(app)
        .delete(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(204);
    });

    it("delete: non valid id", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      deleteRes = await request(app)
        .delete(`/api/v1/posts/636d490f3ff67d626ec990cb`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(404);
    });

    it("delete: unauthorized", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      deleteRes = await request(app)
        .delete(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send();
      expect(deleteRes.status).to.equal(401);
    });
  });

  describe("Update post Test", () => {
    it("successful update", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      updateRes = await request(app)
        .patch(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "some text" });
      expect(updateRes.status).to.equal(200);
      expect(updateRes._body.data.text).to.equal("some text");
    });

    it("Update: non valid id", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      updateRes = await request(app)
        .patch(`/api/v1/posts/636d490f3ff67d626ec990cb`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "some text" });
      expect(updateRes.status).to.equal(404);
    });

    it("update: unauthorized", async () => {
      res = await request(app).post("/api/v1/users/login").send({
        userName: "kirollos",
        email: "kirollos@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      postRes = await request(app)
        .post("/api/v1/posts")
        .set("Cookie", res.header["set-cookie"])
        .send({
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          ownerType: "User",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        });
      expect(postRes.status).to.equal(201);

      res = await request(app).post("/api/v1/users/login").send({
        userName: "khaled",
        email: "khaled@gmail.com",
        password: "12345678",
      });
      expect(res.status).to.equal(200);

      updateRes = await request(app)
        .patch(`/api/v1/posts/${postRes._body.data._id}`)
        .set("Cookie", res.header["set-cookie"])
        .send({ text: "some text" });
      expect(updateRes.status).to.equal(401);
    });
  });
});
*/
