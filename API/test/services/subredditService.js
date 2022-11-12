const assert = require("chai").assert;
const expect = require("chai").expect;
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
console.log("secret " + process.env.JWT_SECRET);
const UserService = require("./../../service/userService");
const SubredditService = require("./../../service/subredditService");

const emailServiceObj = {
  sendPasswordReset: (user, resetURL) => {
    return true;
  },
  sendUserName: (user) => {
    return true;
  },
};

describe("Subreddit Test", () => {
  describe("create subreddit Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        createOne: (subredditData) => {
          const response = {
            status: "success",
            statusCode: 201,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
        getOne: (query, dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 404,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.createSubreddit("");
      assert.equal(output.statusCode, 201);
    });
    it("second test(fail operation of database)", async () => {
      const RepositoryObj = {
        createOne: (subredditData) => {
          const response = {
            status: "fail",
            statusCode: 400,
            err: "mongoose err",
          };
          return response;
        },
        getOne: (query, dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 404,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };

      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.createSubreddit("");
      assert.equal(output.statusCode, 400);
    });
  });

  describe("delete-subreddit services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        deleteOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "success",
            statusCode: 204,
            data: null,
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.deleteSubreddit("", "");
      assert.equal(output.statusCode, 204);
    });
    it("second test(fail operation of database => doc not found)", async () => {
      const RepositoryObj = {
        deleteOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 404,
            err: "cannot found document",
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.deleteSubreddit("", "");
      assert.equal(output.statusCode, 404);
    });
    it("thrid test(fail operation of database => bad request)", async () => {
      const RepositoryObj = {
        deleteOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 400,
            err: "bad request",
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.deleteSubreddit("", "");
      assert.equal(output.statusCode, 400);
    });
  });

  describe("update-Subreddit services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        updateOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "success",
            statusCode: 200,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.updateSubreddit("", "");
      assert.equal(output.statusCode, 200);
    });
    it("second test(fail operation of database => doc not found)", async () => {
      const RepositoryObj = {
        updateOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 404,
            err: "cannot found document",
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.updateSubreddit("", "");
      assert.equal(output.statusCode, 404);
    });
    it("thrid test(fail operation of database => bad request)", async () => {
      const RepositoryObj = {
        updateOneByQuery: (dummy1, dummy2) => {
          const response = {
            status: "fail",
            statusCode: 400,
            err: "bad request",
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.updateSubreddit("", "");
      assert.equal(output.statusCode, 400);
    });
  });
  describe("get-Subreddit services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (dummy1, dummy2, dummy3) => {
          const response = {
            status: "success",
            statusCode: 200,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.getSubreddit("");
      assert.equal(output.statusCode, 200);
    });
    it("second test(fail operation of database => doc not found)", async () => {
      const RepositoryObj = {
        getOne: (dummy1, dummy2, dummy3) => {
          const response = {
            status: "fail",
            statusCode: 404,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.getSubreddit("");
      assert.equal(output.statusCode, 404);
    });
    it("thrid test(fail operation of database => bad request)", async () => {
      const RepositoryObj = {
        getOne: (dummy1, dummy2, dummy3) => {
          const response = {
            status: "fail",
            statusCode: 400,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.getSubreddit("");
      assert.equal(output.statusCode, 400);
    });
  });
  describe("is-Moderator services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.isModerator("");
      assert.equal(output, true);
    });

    it("second test(fail operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 400,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.isModerator("");
      assert.equal(output, false);
    });
  });

  describe("is-Owner services Test", () => {
    it("first test (success operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "success",
            statusCode: 200,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.isOwner("");
      assert.equal(output, true);
    });

    it("second test(fail operation of database)", async () => {
      const RepositoryObj = {
        getOne: (userData) => {
          const response = {
            status: "fail",
            statusCode: 400,
            doc: {
              _id: "1",
            },
          };
          return response;
        },
      };
      const subredditService = new SubredditService(
        "",
        RepositoryObj,
        "",
        "",
        "",
        ""
      );
      const output = await subredditService.isOwner("");
      assert.equal(output, false);
    });
  });

});
