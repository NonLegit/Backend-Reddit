class subredditController {
  constructor(subredditServices) {
    console.log("from controller" + subredditServices);
    this.subredditServices = subredditServices; // can be mocked in unit testing
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubredditSettings = this.getSubredditSettings.bind(this);
    this.updateSubredditSettings = this.updateSubredditSettings.bind(this);
    this.relevantPosts = this.relevantPosts.bind(this);
    this.inviteModerator = this.inviteModerator.bind(this);
    this.deletemoderator = this.deletemoderator.bind(this);
    this.subredditsJoined = this.subredditsJoined.bind(this);
    //! ***************************
    this.createFlair = this.createFlair.bind(this);
    this.deleteFlair = this.deleteFlair.bind(this);
    this.updateFlair = this.updateFlair.bind(this);
    this.getFlair = this.getFlair.bind(this);
    this.getFlairs = this.getFlairs.bind(this);
  }
  // ! todo: need some refractoring here
  async createSubreddit(req, res, next) {
    let data = req.body;
    let userId = req.user._id;

    data.owner = userId;
    try {
      let subreddit = await this.subredditServices.createSubreddit(data);
      if (subreddit.status === "success") {
        let updateModerators = await this.subredditServices.updateSubreddit(
          { name: data.name },
          {
            $push: {
              moderators: {
                username: userId,
                mod_time: Date.now(),
                permissions: {
                  all: true,
                  access: true,
                  config: true,
                  flair: true,
                  posts: true,
                },
              },
            },
          }
        );
        if (updateModerators.status === "success") {
          res.status(subreddit.statusCode).json({
            status: updateModerators.status,
            subreddit: subreddit.doc._id,
          });
        } else {
          res.status(updateModerators.statusCode).json({
            status: updateModerators.statusCode,
            message: updateModerators.err,
          });
        }
      } else {
        res.status(subreddit.statusCode).json({
          status: subreddit.statusCode,
          message: subreddit.err,
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async updateSubredditSettings(req, res, next) {
    let subredditName = req.params.subredditName;
    let data = req.body;
    let userId = req.user._id;

    try {
      //check user is moderator or not
      let canUpdate = await this.subredditServices.isModerator(
        subredditName,
        userId
      );
      if (canUpdate.status === "fail") {
        canUpdate.statusCode = 401;
        res.status(canUpdate.statusCode).json({
          status: canUpdate.statusCode,
          message: "you are not moderator to this subreddit",
        });
      } else {
        let response = await this.subredditServices.updateSubreddit(
          { name: subredditName },
          data
        );
        if (response.status === "success") {
          res.status(response.statusCode).json({
            status: response.status,
            subreddit: response.data,
          });
        } else {
          res.status(response.statusCode).json({
            status: response.statusCode,
            message: response.err,
          });
        }
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async getSubredditSettings(req, res, next) {
    let subredditName = req.params.subredditName;
    let subreddit = await this.subredditServices.getSubreddit({
      name: subredditName,
    });
    if (subreddit.status === "fail") {
      res.status(subreddit.statusCode).json({
        status: subreddit.statusCode,
        message: subreddit.err,
      });
    } else {
      res.status(subreddit.statusCode).json({
        status: subreddit.status,
        subreddit: subreddit.doc,
      });
    }
  }

  async deleteSubreddit(req, res, next) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    try {
      //check user is moderator or not
      let canDelete = await this.subredditServices.isModerator(
        subredditName,
        userId
      );
      if (canDelete.status === "fail") {
        canDelete.statusCode = 401;
        res.status(canDelete.statusCode).json({
          status: canDelete.statusCode,
          message: "you are not the owner to this subreddit",
        });
      } else {
        let response = await this.subredditServices.deleteSubreddit(
          {
            name: subredditName,
          },
          ""
        );
        if (response.status === "success") {
          res.status(response.statusCode).json({
            status: response.status,
          });
        } else {
          res.status(response.statusCode).json({
            status: response.statusCode,
            message: response.err,
          });
        }
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

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

  async subredditsJoined(req, res) {
    let userId = req.user._id;
    let location = req.params.where;

    try {
      let response = await this.subredditServices.subredditsIamIn(
        userId,
        location
      );
      if (response.status === "fail") {
        res.status(response.statusCode).json({
          status: response.statusCode,
          message: "",
        });
      } else {
        res.status(response.statusCode).json({
          status: response.statusCode,
          subreddits: response.doc,
        });
      }
    } catch (err) {}
  }

  async relevantPosts(req, res, next) {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let category = req.params.location;
    try {
      let canGet = await this.subredditServices.isModerator(
        subredditName,
        userId
      );
      if (canGet.status === "fail") {
        canGet.statusCode = 401;
        res.status(canGet.statusCode).json({
          status: canGet.statusCode,
          message: "you are not moderator to this subreddit",
        });
      } else {
        // * get posts marked with this category
        let response = await this.subredditServices.getCategoryPosts(
          {
            name: subredditName,
            "posts.category": category,
          },
          posts
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
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

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

  // ! Doaa's controllers
  async createFlair(req, res) {
    let data = req.body;
    let subredditName = req.params.subredditName;
    try {
      //  console.log('here2');
      let flair = await this.subredditServices.createFlair(subredditName, data);
      if (flair.status === "success") {
        res.status(flair.statusCode).json({
          status: flair.status,
          data: flair.doc,
        });
      } else {
        res.status(flair.statusCode).json({
          status: flair.statusCode,
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
    //   console.log('hello');
    let data = req.body;
    try {
      let response = await this.subredditServices.updateFlair(
        subredditName,
        flairId,
        data
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
    // console.log('HII there ❌');
    //console.log(subredditName);
    //deleteSubreddit(subredditName)
    try {
      let response = await this.subredditServices.deleteFlair(
        subredditName,
        flairId
      );
      if (response.status === "success") {
        res.status(response.statusCode).json({
          status: response.status,
        });
      } else {
        res.status(response.statusCode).json({
          status: response.statusCode,
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
          status: response.statusCode,
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
          status: response.statusCode,
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
  //   async getFlairs(req, res) {
}

//export default userController;
module.exports = subredditController;
