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
const posts = [
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
          sort: "New",
          limit: -1,
          page:-1
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
        removeHiddenPosts: (me, posts) => {
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
      expect(res.status).to.have.been.calledWith(400);
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
      const PostService = {};
      const authObj = new auth({ PostService, UserService });
      await authObj.userPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [],
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
              name: "Nour",
            },
          ],
          savedComments: [
            {
              _id: "637e7497b207b89c889ac1d6",
              owner: "637e7493b207b89c889ac1c4",
              ownerType: "User",
              author: "637e7493b207b89c889ac1c4",
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
        setVoteStatus: (me, posts) => {
          return posts;
        },
      };
      const CommentService = {
        setVoteStatus: (me, posts) => {
          return posts;
        },
      };

      const authObj = new auth({ PostService, UserService, CommentService });
      await authObj.getSavedPosts(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        savedPosts: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
            name: "Nour",
          },
        ],
        savedComments: [
          {
            _id: "637e7497b207b89c889ac1d6",
            owner: "637e7493b207b89c889ac1c4",
            ownerType: "User",
            author: "637e7493b207b89c889ac1c4",
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
        setSavedPostStatus: (me, posts) => {
          return posts;
        },
        setHiddenPostStatus: (me, posts) => {
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

  describe("postVote Test", () => {
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
      const PostService = {
        findPostById: async (postId) => {
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

      const authObj = new auth({ PostService, UserService });
      await authObj.postVote(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
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

      const authObj = new auth({ PostService, UserService });
      await authObj.postVote(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
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

      const authObj = new auth({ PostService, UserService });
      await authObj.postVote(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
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

      const authObj = new auth({ PostService, UserService });
      await authObj.postVote(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Post Not Found",
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
      const PostService = {
        findPostById: async (postId) => {
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

      const authObj = new auth({ PostService, UserService });
      await authObj.postVote(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("savePost Test", () => {
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        savePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.savePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        savePost: (me, posts) => {
          return false;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.savePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        savePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.savePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        savePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.savePost(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Post Not Found",
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        savePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.savePost(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("unSavePost Test", () => {
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSavePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unSavePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSavePost: (me, posts) => {
          return false;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unSavePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSavePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unSavePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSavePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unSavePost(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Post Not Found",
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unSavePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unSavePost(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("hidePost Test", () => {
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        hidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.hidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        hidePost: (me, posts) => {
          return false;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.hidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        hidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.hidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        hidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.hidePost(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Post Not Found",
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        hidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.hidePost(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("unHidePost Test", () => {
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unHidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unHidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unHidePost: (me, posts) => {
          return false;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unHidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unHidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unHidePost(req, res, "");
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: false,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unHidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unHidePost(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Post Not Found",
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
      const PostService = {
        findPostById: async (postId) => {
          let response = {
            success: true,
            data: {
              author: "1",
              votes: "5",
            },
          };
          return response;
        },
        unHidePost: (me, posts) => {
          return true;
        },
      };

      const authObj = new auth({ PostService, UserService });
      await authObj.unHidePost(req, res, "");
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    });
  });

  describe("overview Test", () => {
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
        checkBlockStatus: async (userName, dummy) => {
          return false;
        },
      };
      const PostService = {
        getUserPosts: (me, posts) => {
          return [{ _id: "1" }];
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
        removeHiddenPosts: (me, posts) => {
          return posts;
        },
        filterPosts: (posts) => {
          return posts;
        },
      };
      const CommentService = {
        getUserComments: async () => {
          return [
            {
              _id: "1",
            },
          ];
        },
      };
      const authObj = new auth({ PostService, UserService, CommentService });
      await authObj.overview(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "1",
          },
        ],
        comments: [
          {
            _id: "1",
          },
        ],
      });
      const authObj2 = new auth({ PostService, UserService, CommentService });
      const req2 = {
        user: {
          _id: "1",
        },
        params: {
          userName: "Ahmed",
        },
        query: {
          sort: "Top",
          page: 5,
          limit: 3,
        },
      };
      await authObj2.overview(req2, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [
          {
            _id: "1",
          },
        ],
        comments: [
          {
            _id: "1",
          },
        ],
      });
    });
    it("second test success", async () => {
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
        checkBlockStatus: async (userName, dummy) => {
          return true;
        },
      };
      const PostService = {
        getUserPosts: (me, posts) => {
          return [{ _id: "1" }];
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
        removeHiddenPosts: (me, posts) => {
          return posts;
        },
        filterPosts: (posts) => {
          return posts;
        },
      };
      const CommentService = {
        getUserComments: async () => {
          return [
            {
              _id: "1",
            },
          ];
        },
      };
      const authObj = new auth({ PostService, UserService, CommentService });
      await authObj.overview(req, res, "");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "success",
        posts: [],
        comments: [],
      });
    });
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
            success: false,
            data: {
              _id: "2",
            },
          };
        },
        checkBlockStatus: async (userName, dummy) => {
          return false;
        },
      };
      const PostService = {
        getUserPosts: (me, posts) => {
          return [{ _id: "1" }];
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
        removeHiddenPosts: (me, posts) => {
          return posts;
        },
        filterPosts: (posts) => {
          return posts;
        },
      };
      const CommentService = {
        getUserComments: async () => {
          return [
            {
              _id: "1",
            },
          ];
        },
      };
      const authObj = new auth({ PostService, UserService, CommentService });
      await authObj.overview(req, res, "");
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        status: "fail",
        errorMessage: "User Not Found",
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
  //////////////////////////////////////////////////////

  describe("get hot posts", () => {
    it("1) test success", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        }
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getHotPosts(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts,
      });
    });
    it("2) test success not logged in", async () => {
      const req = {
        isAuthorized: true,
       
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getHotPosts(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts,
      });
    });

    it("3) test fail subreddit not found", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
        // toFilter: " "
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: false,
            error: subredditErrors.SUBREDDIT_NOT_FOUND,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getHotPosts(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        message: "Subreddit not found",

        status: "Not Found",
      });
    });
    it("4) test fail internal", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
        // toFilter: " "
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getHotPosts(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        message: "Internal server error",
            
        status: "Internal Server Error",
      });
    });
    it("5) test fail exception", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        }
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          throw new Error('divide by zero!');
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getHotPosts(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        status: "fail",
       
      });
    });
  });
  describe("get new posts", () => {
    it("1) test success", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        }
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getNewPosts(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts,
      });
    });
    it("2) test success not logged in", async () => {
      const req = {
        isAuthorized: true,
       
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getNewPosts(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts,
      });
    });

    it("3) test fail subreddit not found", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
        // toFilter: " "
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: false,
            error: subredditErrors.SUBREDDIT_NOT_FOUND,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getNewPosts(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        message: "Subreddit not found",

        status: "Not Found",
      });
    });
    it("4) test fail internal", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
        // toFilter: " "
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getNewPosts(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        message: "Internal server error",
            
        status: "Internal Server Error",
      });
    });
    it("5) test fail exception", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        }
      };
      const UserService = {
        getPeopleUserKnows: async () => {
          const response = {
            success: true,
            data: posts,
          };
          
          return response;
        }
      };
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            data: posts,
          };
          throw new Error('divide by zero!');
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, UserService });
      await postObj.getNewPosts(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        status: "fail",
       
      });
    });
  }); 
  
  describe("get top posts", () => {
      it("1) test success", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          }
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getTopPosts(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.status(200).json).to.have.been.calledWith({
          status: "OK",
          data: posts,
        });
      });
      it("2) test success not logged in", async () => {
        const req = {
          isAuthorized: true,
       
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getTopPosts(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.status(200).json).to.have.been.calledWith({
          status: "OK",
          data: posts,
        });
      });

      it("3) test fail subreddit not found", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          },
          // toFilter: " "
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: false,
              error: subredditErrors.SUBREDDIT_NOT_FOUND,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getTopPosts(req, res);
        expect(res.status).to.have.been.calledWith(404);
        expect(res.status(404).json).to.have.been.calledWith({
          message: "Subreddit not found",

          status: "Not Found",
        });
      });
      it("4) test fail internal", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          },
          // toFilter: " "
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: false,
              error: subredditErrors.MONGO_ERR,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getTopPosts(req, res);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.status(500).json).to.have.been.calledWith({
          message: "Internal server error",
            
          status: "Internal Server Error",
        });
      });
      it("5) test fail exception", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          }
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
          
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            throw new Error('divide by zero!');
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getTopPosts(req, res);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.status(500).json).to.have.been.calledWith({
          status: "fail",
       
        });
      });
    });
describe("get best posts", () => {
      it("1) test success", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          }
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getBestPosts(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.status(200).json).to.have.been.calledWith({
          status: "OK",
          data: posts,
        });
      });
      it("2) test success not logged in", async () => {
        const req = {
          isAuthorized: true,
       
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getBestPosts(req, res);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.status(200).json).to.have.been.calledWith({
          status: "OK",
          data: posts,
        });
      });

      it("3) test fail subreddit not found", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          },
          // toFilter: " "
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: false,
              error: subredditErrors.SUBREDDIT_NOT_FOUND,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getBestPosts(req, res);
        expect(res.status).to.have.been.calledWith(404);
        expect(res.status(404).json).to.have.been.calledWith({
          message: "Subreddit not found",

          status: "Not Found",
        });
      });
      it("4) test fail internal", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          },
          // toFilter: " "
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: false,
              error: subredditErrors.MONGO_ERR,
            };
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getBestPosts(req, res);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.status(500).json).to.have.been.calledWith({
          message: "Internal server error",
            
          status: "Internal Server Error",
        });
      });
      it("5) test fail exception", async () => {
        const req = {
          isAuthorized: true,
          user: {
            _id: " ",
          }
        };
        const UserService = {
          getPeopleUserKnows: async () => {
            const response = {
              success: true,
              data: posts,
            };
          
            return response;
          }
        };
        const PostService = {
          getPosts: async () => {
            const response = {
              success: true,
              data: posts,
            };
            throw new Error('divide by zero!');
            return response;
          },
        };
        const on = {};
        const postObj = new auth({ PostService, UserService });
        await postObj.getBestPosts(req, res);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.status(500).json).to.have.been.calledWith({
          status: "fail",
       
        });
      });
    });

describe("get post", () => {
    it("1) test success", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
        params: {
          postId:" "
        }
      };
      const PostService = {
        getPost: async () => {
          const response = {
            success: true,
            doc: posts[0],
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts[0],
      });
    });
    it("2) test success not logged in", async () => {
      const req = {
        isAuthorized: true,
        params: {
          postId:" "
        }
      };
      
      const PostService = {
        getPosts: async () => {
          const response = {
            success: true,
            doc: posts[0],
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status(200).json).to.have.been.calledWith({
        status: "OK",
        data: posts[0],
      });
    });

    it("3) test fail post not found", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
         params: {
          postId:" "
        }
        // toFilter: " "
      };
     
      const PostService = {
        getPost: async () => {
          const response = {
            success: false,
            error: postErrors.POST_NOT_FOUND,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(404);
      expect(res.status(404).json).to.have.been.calledWith({
        message: "Post not found",

        status: "Not Found",
      });
    });
    it("4) test fail internal", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
         params: {
          postId:" "
        }
        // toFilter: " "
      };
     
      const PostService = {
        getPost: async () => {
          const response = {
            success: false,
            error: subredditErrors.MONGO_ERR,
          };
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        message: "Internal server error",
            
        status: "Internal Server Error",
      });
    });
    it("5) test fail exception", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
         params: {
          postId:" "
        }

      };
     
      const PostService = {
        getPost: async () => {
          const response = {
            success: true,
            data: posts,
          };
          throw new Error('divide by zero!');
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.status(500).json).to.have.been.calledWith({
        status: "fail",
       
      });
    });
    it("6) test fail bad request", async () => {
      const req = {
        isAuthorized: true,
        user: {
          _id: " ",
        },
         params: {
          postId:undefined
        }

      };
     
      const PostService = {
        getPost: async () => {
          const response = {
            success: true,
            data: posts,
          };
         
          return response;
        },
      };
      const on = {};
      const postObj = new auth({ PostService, on });
      await postObj.getPost(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.status(400).json).to.have.been.calledWith({
        status: "fail",
        message: "Missing required parameter",
       
      });
    });
 
});

  

  describe("Post Controller CRUD operations", () => {
    describe("Create post test", () => {
      const req = {
        user: {
          _id: "123e4aab2a94c22ae492983a",
        },
        body: {
          title: "kiro post",
          kind: "self",
          text: "this is a post",
          owner: "637e4aab2a94c22ae492983a",
          ownerType: "Subreddit",
          nsfw: false,
          spoiler: true,
          sendReplies: true,
          suggestedSort: "top",
        },
      };
      const UserService = {};
      const PostService = {
        createPost: async (data) => {
          return { success: true, data };
        },
      };
      const postController = new auth({ PostService, UserService });

      it("successful creation", async () => {
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(201);
        expect(res.status().json).to.have.been.calledWith({
          status: "success",
          data: {
            author: "123e4aab2a94c22ae492983a",
            title: "kiro post",
            kind: "self",
            text: "this is a post",
            owner: "637e4aab2a94c22ae492983a",
            ownerType: "Subreddit",
            nsfw: false,
            spoiler: true,
            sendReplies: true,
            suggestedSort: "top",
          },
        });
      });

      it("Invalid post kind", async () => {
        PostService.createPost = async (data) => {
          return { success: false, error: postErrors.INVALID_POST_KIND };
        };
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Invalid post kind",
        });
      });

      it("Invalid owner type", async () => {
        PostService.createPost = async (data) => {
          return { success: false, error: postErrors.INVALID_OWNER };
        };
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Invalid owner type",
        });
      });

      it("Subreddit not found", async () => {
        PostService.createPost = async (data) => {
          return { success: false, error: postErrors.SUBREDDIT_NOT_FOUND };
        };
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(404);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Subreddit not found",
        });
      });

      it("Flair not found", async () => {
        PostService.createPost = async (data) => {
          return { success: false, error: postErrors.FLAIR_NOT_FOUND };
        };
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Flair not found",
        });
      });

      it("mongo error", async () => {
        PostService.createPost = async (data) => {
          return { success: false, error: postErrors.MONGO_ERR, msg: "message" };
        };
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "message",
        });
      });

      it("Invalid request", async () => {
        delete req.body.kind;
        await postController.createPost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Invalid request",
        });
      });
    });

    describe("Update post test", () => {
      const req = {
        user: {
          _id: "123e4aab2a94c22ae492983a",
        },
        params: {
          postId: "456p4aab2a94c22ae492983a",
        },
        body: {
          text: "this is a post",
        },
      };
      const UserService = {};
      const PostService = {
        updatePost: async (id, data, userId) => {
          return { success: true, data };
        },
      };
      const postController = new auth({ PostService, UserService });

      it("successful update", async () => {
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(201);
        expect(res.status().json).to.have.been.calledWith({
          status: "success",
          data: {
            text: "this is a post",
          },
        });
      });

      it("Post isn't editable", async () => {
        PostService.updatePost = async (data) => {
          return { success: false, error: postErrors.NOT_EDITABLE };
        };
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Post isn't editable",
        });
      });

      it("User must be author", async () => {
        PostService.updatePost = async (data) => {
          return { success: false, error: postErrors.NOT_AUTHOR };
        };
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(401);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "User must be author",
        });
      });

      it("Post not found", async () => {
        PostService.updatePost = async (data) => {
          return { success: false, error: postErrors.POST_NOT_FOUND };
        };
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(404);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Post not found",
        });
      });

      it("mongo error", async () => {
        PostService.updatePost = async (data) => {
          return { success: false, error: postErrors.MONGO_ERR, msg: "message" };
        };
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "message",
        });
      });

      it("Invalid request", async () => {
        delete req.body.text;
        await postController.updatePost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Invalid request",
        });
      });
    });

    describe("Delete post test", () => {
      const req = {
        user: {
          _id: "123e4aab2a94c22ae492983a",
        },
        params: {
          postId: "456p4aab2a94c22ae492983a",
        },
        body: {
          text: "this is a post",
        },
      };
      const UserService = {};
      const PostService = {
        deletePost: async () => {
          return { success: true };
        },
      };
      const postController = new auth({ PostService, UserService });

      it("successful delete", async () => {
        await postController.deletePost(req, res, "");
        expect(res.status).to.have.been.calledWith(204);
        expect(res.status().json).to.have.been.calledWith({
          status: "success",
          data: null,
        });
      });

      it("User must be author", async () => {
        PostService.deletePost = async () => {
          return { success: false, error: postErrors.NOT_AUTHOR };
        };
        await postController.deletePost(req, res, "");
        expect(res.status).to.have.been.calledWith(401);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "User must be author",
        });
      });

      it("Post not found", async () => {
        PostService.deletePost = async () => {
          return { success: false, error: postErrors.POST_NOT_FOUND };
        };
        await postController.deletePost(req, res, "");
        expect(res.status).to.have.been.calledWith(404);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Post not found",
        });
      });

      it("Invalid request", async () => {
        delete req.params.postId;
        await postController.deletePost(req, res, "");
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({
          status: "fail",
          message: "Missing required parameter postId",
        });
      });
    });
  });

  
});
