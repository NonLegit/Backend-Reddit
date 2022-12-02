const { subredditErrors } = require("../error_handling/errors");

class subredditController {
  constructor({ subredditService, UserService }) {
    this.subredditServices = subredditService; // can be mocked in unit testing
    this.userServices = UserService;
  }

  createSubreddit = async (req, res) => {
    let data = req.body;
    let userId = req.user._id;
    let userName = req.user.userName;

    const validReq = data.fixedName && data.type && data.nsfw;
    if (!validReq) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }
    if (isEmpty(data)) {
      res.status(400).json({
        status: "fail",
        message: "please provide a body",
      });
      return;
    }

    // set the owner (user already logged in) in data
    data.owner = userId;
    data.name = data.fixedName;

    let subreddit = await this.subredditServices.createSubreddit(
      data,
      userName,
      req.user.profilePicture
    );

    if (!subreddit.success) {
      let msg, stat;
      switch (subreddit.error) {
        case subredditErrors.ALREADY_EXISTS:
          msg = "This name is already taken";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = subreddit.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({
      id: subreddit.data._id,
    });
  };

  

  updateSubredditSettings = async (req, res) => {
    let subredditName = req.params.subredditName;
    let data = req.body;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter subredditName",
      });
      return;
    }
    if (isEmpty(data)) {
      res.status(400).json({
        status: "fail",
        message: "please provide a body",
      });
      return;
    }

    let subreddit = await this.subredditServices.updateSubreddit(
      subredditName,
      userId,
      data
    );

    if (!subreddit.success) {
      let msg, stat;
      switch (subreddit.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this request";
          stat = 401;
          break;
        case subredditErrors.MONGO_ERR:
          msg = subreddit.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: subreddit.data,
    });
  };

  // TODO: fix return object
  getSubredditSettings = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter subredditName",
      });
      return;
    }

    let subreddit = await this.subredditServices.retrieveSubreddit(
      userId,
      subredditName
    );

    if (!subreddit.success) {
      let msg, stat;
      switch (subreddit.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.MONGO_ERR:
          msg = subreddit.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: subreddit.data,
    });
  };

  deleteSubreddit = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter subredditName",
      });
      return;
    }
    //exists - owner - delete

    //check user is moderator or not
    let subreddit = await this.subredditServices.deleteSubreddit(
      subredditName,
      userId
    );

    if (!subreddit.success) {
      let msg, stat;
      switch (subreddit.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.NOT_OWNER:
          msg = "you are not the owner to this subreddit";
          stat = 401;
          break;

        case subredditErrors.MONGO_ERR:
          msg = subreddit.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({
      status: "success",
    });
  };

  // TODO: Not Finalized (needs a small fix)
  async deletemoderator(req, res, next) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let newModName = req.params.moderatorName;
    console.log(newModName);
    try {
      let response = await this.subredditServices.deleteMod(
        subredditName,
        userId,
        newModName
      );
      console.log(response);
      if (response.status === "fail") {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.message,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.message,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  subredditsJoined = async (req, res) => {
    let userId = req.user._id;
    let location = req.params.where;

    if (!location) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter location",
      });
      return;
    }

    let subreddits = await this.subredditServices.subredditsIamIn(
      userId,
      location
    );

    if (!subreddits.success) {
      let msg, stat;
      switch (subreddits.error) {
        case subredditErrors.INVALID_ENUM:
          msg = "Invalid location value !";
          stat = 400;
          break;

        case subredditErrors.MONGO_ERR:
          msg = subreddits.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({
      status: "success",
      data: subreddits.data,
    });
  };

  async relevantPosts(req, res, next) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let category = req.params.location;
    try {
      // * get posts marked with this category
      let response = await this.subredditServices.getCategoryPosts(
        subredditName,
        userId,
        category
      );
      if (response.status === "fail") {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.err,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          response: subreddit.doc,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  // TODO: need refactoring
  async inviteModerator(req, res) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let newModName = req.params.moderatorName;
    let data = req.body;

    try {
      let response = await this.subredditServices.inviteMod(
        subredditName,
        userId,
        newModName,
        data
      );
      console.log(response);
      if (response.status === "fail") {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.message,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.message,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  // TODO: need refactoring
  async updatePermissions(req, res) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let newModName = req.params.moderatorName;
    let data = req.body;

    try {
      let response = await this.subredditServices.updateModeratorSettings(
        subredditName,
        userId,
        newModName,
        data
      );
      if (response.status === "fail") {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: response.message,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.statusCode,
          doc: response.doc.moderators,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  // ! Doaa's controllers
  async createFlair(req, res) {
    let data = req.body;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    try {
      //  console.log('here2');
      let flair = await this.subredditServices.createFlair(
        subredditName,
        data,
        userId
      );
      if (flair.status === "success") {
        res.status(flair.statusCode).json({
          status: flair.status,
          data: flair.doc,
        });
      } else {
        res.status(flair.statusCode).json({
          status: flair.status,
          errorMessage: flair.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async updateFlair(req, res) {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    //   console.log('hello');
    let data = req.body;
    try {
      let response = await this.subredditServices.updateFlair(
        subredditName,
        flairId,
        data,
        userId
      );
      if (response.status === "success") {
        res.status(response.statusCode).json({
          status: response.status,
          data: response.doc,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async deleteFlair(req, res) {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    // console.log('HII there ❌');
    //console.log(subredditName);
    //deleteSubreddit(subredditName)
    try {
      let response = await this.subredditServices.deleteFlair(
        subredditName,
        flairId,
        userId
      );
      if (response.status === "success") {
        res.status(response.statusCode).json({
          status: response.status,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async getFlair(req, res) {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    try {
      let response = await this.subredditServices.getFlair(
        subredditName,
        flairId
      );
      if (response.status === "success") {
        res.status(response.statusCode).json({
          status: response.status,
          data: response.doc,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  async getFlairs(req, res) {
    let subredditName = req.params.subredditName;
    try {
      let response = await this.subredditServices.getFlairs(subredditName);
      // console.log( response);
      if (response.status === "success") {
        res.status(response.statusCode).json({
          status: response.status,
          data: response.doc,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  async getSubredditId(req, res, next) {
    let subredditName = req.params.subredditName;
    try {
      let response = await this.subredditServices.getSubreddit({
        name: subredditName,
      });
      console.log(response);
      if (response.status === "success") {
        req.toFilter = { owner: response.doc._id };
        console.log(req.toFilter);
        next();
      } else {
        res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  // async getTopPosts(req, res) {
  //   console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeee");
  //   let subredditName = req.params.subredditName;

  //   try {
  //     let subreddit = await this.subredditServices.getSubreddit({ name: subredditName });

  //     // console.log(res.status);
  //     // console.log(subreddit);
  //     if (subreddit.status !== "success") {
  //      return res.status(subreddit.statusCode).json({
  //         status: subreddit.status,
  //         errorMessage: subreddit.err,
  //       });
  //     }

  //     req.query.sort = '-votes';
  //     // console.log(req.query);
  //      console.log(req.query);

  //     let response = await this.postServices.getPosts(req.query, { owner: subreddit.doc._id });
  //     console.log( response);
  //     if (response.status === "success") {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         data: response.doc,
  //       });
  //     } else {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         errorMessage: response.err,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error in subredditservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // }
  // async getNewPosts(req, res) {
  //   let subredditName = req.params.subredditName;
  //   console.log("//////////////////////");
  //   console.log(subredditName);

  //   try {
  //     let subreddit = await this.subredditServices.getSubreddit({ name: subredditName });
  //     console.log(subreddit);
  //     console.log("///////////////////////////////");
  //     console.log(subreddit.status !== "success");
  //     if (subreddit.status !== "success") {
  //      return res.status(subreddit.statusCode).json({
  //         status: subreddit.status,
  //         errorMessage: subreddit.err,
  //       });
  //       console.log(res);
  //     }
  //     req.query.sort = '-createdAt';
  //     console.log("befor");
  //     let response = await this.postServices.getPosts(req.query, { owner: subreddit.doc._id });
  //     console.log("after");
  //     // console.log( response);
  //     if (response.status === "success") {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         data: response.doc,
  //       });
  //     } else {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         errorMessage: response.err,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error in subredditservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // }

  //  async getTrendingPosts(req, res) {
  //   let subredditName = req.params.subredditName;
  //   console.log("here");
  //   try {
  //     let subreddit = await this.subredditServices.getSubreddit({ name: subredditName });
  //     if (subreddit.status !== "success") {
  //       return res.status(subreddit.statusCode).json({
  //         status: subreddit.status,
  //         errorMessage: subreddit.err,
  //       });
  //     }
  //     req.query.sort = '-views';
  //     console.log(req.query);
  //     let response = await this.postServices.getPosts(req.query, { owner: subreddit.doc._id });
  //     // console.log( response);
  //     if (response.status === "success") {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         data: response.doc,
  //       });
  //     } else {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         errorMessage: response.err,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error in subredditservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // }
  //  async getHotPosts(req, res) {
  //   let subredditName = req.params.subredditName;
  //   console.log("here");
  //   try {
  //     let subreddit = await this.subredditServices.getSubreddit({ name: subredditName });
  //     console.log("not in here");
  //     if (subreddit.status !== "success") {

  //       return res.status(subreddit.statusCode).json({
  //         status: subreddit.status,
  //         errorMessage: subreddit.err,
  //       });
  //     }
  //     req.query.sort = '-createdAt,-votes,-commentCount';
  //     console.log(req.query);
  //     console.log(subreddit);
  //     let response = await this.postServices.getPosts(req.query, { owner: subreddit.doc._id });
  //     // console.log( response);
  //     if (response.status === "success") {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         data: response.doc,
  //       });
  //     } else {
  //       res.status(response.statusCode).json({
  //         status: response.status,
  //         errorMessage: response.err,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error in subredditservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // }
  // //   async getFlairs(req, res) {
  //   async getFlairs(req, res) {

  subscribe = async (req, res) => {
    //setting sub default behavior
    const subredditName = req.params.subredditName;
    const action = req.query.action || "sub";
    if (action !== "sub" && action !== "unsub") {
      res.status(400).json({
        status: "fail",
        message: "Invalid action",
      });
      return;
    }
    console.log("kiroo");
    //check if subreddit exists
    const subreddit = await this.subredditServices.subscriable(
      subredditName,
      req.user._id
    );
    console.log("kiroo 2️⃣");
    if (!subreddit.success) {
      let msg, stat;
      switch (subreddit.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.BANNED:
          msg = "user is banned from subreddit";
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    //subscribe or unsubscribe user according to sub
    console.log("kiroo0000000000");
    const subscribed = await this.userServices.subscribe(
      req.user._id,
      subreddit._id,
      action
    );
    if (!subscribed) {
      {
        res.status(400).json({
          status: "fail",
          message: "Invalid subscribtion action",
        });
        return;
      }
    }

    res.status(200).json({
      status: "success",
    });
  };
}
function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}
//export default userController;
module.exports = subredditController;
