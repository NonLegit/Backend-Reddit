const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
const CommentService = require("./../../service/searchService");
const { ECDH } = require("crypto");
const ObjectId = require("mongoose").Types.ObjectId;

describe("ser service test", () => {
  const CommentRepository = {
    search: async () => [
      {
        author: {
          _id: ObjectId("456c5fccf267fc3a463b35e4"),
          profilePicture: "pic",
        },
        owner: { icon: "icon" },
        post: {
          author: {
            _id: ObjectId("456c5fccf267fc3a463b35e4"),
            profilePicture: "pic",
          },
        },
      },
    ],
  };
  const PostRepository = {
    search: async () => [
      {
        author: {
          _id: ObjectId("456c5fccf267fc3a463b35e4"),
          profilePicture: "pic",
        },
        owner: { icon: "icon" },
      },
    ],
  };
  const SubredditRepository = { search: async () => [{icon: "icon"}] };
  const UserRepository = {
    search: async () => [
      { _id: ObjectId("456c5fccf267fc3a463b35e4"), profilePicture: "pic" },
    ],
  };

  const searchServices = new CommentService({
    CommentRepository,
    PostRepository,
    SubredditRepository,
    UserRepository,
  });

  const q = "search query";
  const limit = 10;
  const page = 5;
  const time = "all";
  const sort = "new";
  const currentUser = {
    subscribed: [],
    _id: "456c5fccf267fc3a463b35e4",
    meUserRelationship: [
      { userId: ObjectId("456c5fccf267fc3a463b35e4"), status: "blocked" },
    ],
    userMeRelationship: [
      { userId: ObjectId("456c5fccf267fc3a463b35e4"), status: "blocked" },
    ],
  };
  let type;

  it("posts", async () => {
    type = "posts";
    await searchServices.search(q, type, page, limit, sort, time, currentUser);
  });
  it("comments", async () => {
    type = "comments";
    await searchServices.search(q, type, page, limit, sort, time, currentUser);
  });
  it("posts", async () => {
    type = "communities";
    await searchServices.search(q, type, page, limit, sort, time, currentUser);
  });
  it("posts", async () => {
    type = "people";
    await searchServices.search(q, type, page, limit, sort, time, currentUser);
  });
});
