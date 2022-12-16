const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const PostService = require("./../../service/postService");
const { postErrors } = require("../../error_handling/errors");
const ObjectId = require("mongoose").Types.ObjectId;

describe("Post service test", () => {
  describe("create post", () => {
    const PostRepository = {
      createOne: async (data) => {
        return { success: true, doc: data };
      },
    };
    const SubredditRepository = {
      findById: async (id, fields) => {
        return {
          success: true,
          doc: {
            flairIds: ["123d493c3ff67d626ec994f7", "666d493c3ff67d626ec990d1"],
          },
        };
      },
    };
    const postServices = new PostService({
      PostRepository,
      SubredditRepository,
    });
    let post;
    it("successful post create in subreddit", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "Subreddit",
        flairId: "123d493c3ff67d626ec994f7",
      };
      const { success, data } = await postServices.createPost(post);
      expect(success).to.equal(true);
      expect(data).to.eql(post);
    });
    it("successful post create in user profile", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "User",
      };
      const { success, data } = await postServices.createPost(post);
      expect(success).to.equal(true);
      expect(data.owner).to.equal(post.author);
    });
    it("invalid kind", async () => {
      let post = {
        kind: "link",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        ownerType: "Subreddit",
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.INVALID_POST_KIND);
    });
    it("invalid owner 1", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "Subreddit",
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.INVALID_OWNER);
    });
    it("invalid owner 2", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        author: "879d493c3ff67d626ec990e5",
        owner: "259d493c3ff67d626ec990e5",
        ownerType: "Not a valid owner",
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.INVALID_OWNER);
    });
    it("flair not found", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "Subreddit",
        flairId: "456d493c3ff67d626ec994f7",
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.FLAIR_NOT_FOUND);
    });
    it("Error in data access layer", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "Subreddit",
        flairId: "123d493c3ff67d626ec994f7",
      };
      PostRepository.createOne = async (data) => {
        return { success: false };
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.MONGO_ERR);
    });
    it("invalid subreddit", async () => {
      post = {
        title: "kiro post",
        kind: "self",
        text: "this is a post",
        owner: "636d493c3ff67d626ec990d0",
        author: "879d493c3ff67d626ec990e5",
        ownerType: "Subreddit",
      };
      SubredditRepository.findById = async (id, fields) => {
        return { success: false };
      };
      const { success, error } = await postServices.createPost(post);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.SUBREDDIT_NOT_FOUND);
    });
  });

  describe("Testing update post", () => {
    const PostRepository = {
      exists: async (id, fields) => {
        const post = {
          author: ObjectId("578a5fccf267fc3a463b35e4"),
          kind: "self",
          sharedFrom: false,
        };
        return { success: true, doc: post };
      },
      updateText: async (id, text) => {
        const post = {
          text: "updated post text",
        };
        return { doc: post };
      },
    };
    const SubredditRepository = {};
    const postServices = new PostService({
      PostRepository,
      SubredditRepository,
    });
    let data = {
      text: "updated post text",
    };
    let id = "636a5fccf267fc3a463b35d9";
    let userId = "578a5fccf267fc3a463b35e4";
    it("successful post update", async () => {
      const { success, data: updatedData } = await postServices.updatePost(
        id,
        data,
        userId
      );
      expect(success).to.equal(true);
      expect(updatedData.text).to.equal("updated post text");
    });
    it("unathorized user", async () => {
      userId = "578a5fccf267fc3a463b35e";
      const { success, error } = await postServices.updatePost(
        id,
        data,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.NOT_AUTHOR);
    });
    it("post not editable", async () => {
      userId = "578a5fccf267fc3a463b35e4";

      PostRepository.exists = async (id, fields) => {
        const post = {
          author: ObjectId("578a5fccf267fc3a463b35e4"),
          kind: "link",
          sharedFrom: false,
        };
        return { success: true, doc: post };
      };
      const { success, error } = await postServices.updatePost(
        id,
        data,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.NOT_EDITABLE);
    });
    it("post not found", async () => {
      PostRepository.exists = async (id, fields) => {
        return { success: false };
      };
      const { success, error } = await postServices.updatePost(
        id,
        data,
        userId
      );
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.POST_NOT_FOUND);
    });
  });

  describe("Testing delete post", () => {
    const PostRepository = {
      exists: async (id, fields) => {
        const post = {
          author: ObjectId("578a5fccf267fc3a463b35e4"),
        };
        return { success: true, doc: post };
      },
      deletePost: async (id) => {},
    };
    const SubredditRepository = {};
    const postServices = new PostService({
      PostRepository,
      SubredditRepository,
    });
    let id = "636a5fccf267fc3a463b35d9";
    let userId = "578a5fccf267fc3a463b35e4";
    it("successful post delete", async () => {
      const { success } = await postServices.deletePost(id, userId);
      expect(success).to.equal(true);
    });
    it("unathorized user", async () => {
      userId = "578a5fccf267fc3a463b35e";
      const { success, error } = await postServices.deletePost(id, userId);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.NOT_AUTHOR);
    });
    it("post not found", async () => {
      PostRepository.exists = async (id, fields) => {
        return { success: false };
      };
      const { success, error } = await postServices.deletePost(id, userId);
      expect(success).to.equal(false);
      expect(error).to.equal(postErrors.POST_NOT_FOUND);
    });
  });
  // describe("Testing get posts",()=>{
  //    it("1) test success", async () => {
  //     const PostRepository = {
  //       getPosts: async(x,y) => {
  //         const response = {
  //           success: true,
  //           doc: [{
  //             _id: "636e901bbc485bd111dd3880",
  //             text: "first post"
  //           }]        
  //         };
          
  //         return response;
  //       },
  //        getPosts: async(x,y) => {
  //         const response = {
  //           success: true,
  //           doc: [{
  //             _id: "636e901bbc485bd111dd3880",
  //             text: "first post"
  //           }]        
  //         };
          
  //         return response;
  //       },
  //        getPosts: async(x,y) => {
  //         const response = {
  //           success: true,
  //           doc: [{
  //             _id: "636e901bbc485bd111dd3880",
  //             text: "first post"
  //           }]        
  //         };
          
  //         return response;
  //       },
  //        getPosts: async(x,y) => {
  //         const response = {
  //           success: true,
  //           doc: [{
  //             _id: "636e901bbc485bd111dd3880",
  //             text: "first post"
  //           }]        
  //         };
          
  //         return response;
  //       },
  //        getPosts: async(x,y) => {
  //         const response = {
  //           success: true,
  //           doc: [{
  //             _id: "636e901bbc485bd111dd3880",
  //             text: "first post"
  //           }]        
  //         };
          
  //         return response;
  //       },
        
  //     };
  //     const on = {};
  //     const subredditServiceObj = new SubredditService({  SubredditRepository,on, on});
  //     const subredditName = " ";
      
  //     const result = await subredditServiceObj.getFlairs(subredditName);
  //     expect(result.success).to.equal(true);
  //     expect(result.data[0].text).to.equal( "first flair");
      
  //   });
  // })
});
