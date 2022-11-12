class subredditController {
  constructor(subredditServices, userServices) {
    this.subredditServices = subredditServices; // can be mocked in unit testing
    this.userServices = userServices;
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubredditSettings = this.getSubredditSettings.bind(this);
    this.updateSubredditSettings = this.updateSubredditSettings.bind(this);
    this.relevantPosts = this.relevantPosts.bind(this);
    this.inviteModerator = this.inviteModerator.bind(this);
    this.deletemoderator = this.deletemoderator.bind(this);
    this.subredditsJoined = this.subredditsJoined.bind(this);
    this.updatePermissions = this.updatePermissions.bind(this);
    // this.setPrimaryTopic=this.setPrimaryTopic.bind(this);
    //! ***************************
    this.createFlair = this.createFlair.bind(this);
    this.deleteFlair = this.deleteFlair.bind(this);
    this.updateFlair = this.updateFlair.bind(this);
    this.getFlair = this.getFlair.bind(this);
    this.getFlairs = this.getFlairs.bind(this);

    this.subscribe = this.subscribe.bind(this);
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
          message: subreddit.message,
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
      let subreddit = await this.subredditServices.getSubreddit({
        name: subredditName,
      });
      // console.log(subreddit);
      if (subreddit.status === "fail") {
        res.status(404).json({
          status: 404,
          message: "subreddit doesn't exist",
        });
      } else {
        let canUpdate = await this.subredditServices.isModerator(
          subredditName,
          userId
        );
        if (!canUpdate) {
          res.status(401).json({
            status: 401,
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
              subreddit: response.doc,
            });
          } else {
            res.status(response.statusCode).json({
              status: response.statusCode,
              message: response.err,
            });
          }
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
      let subreddit = await this.subredditServices.getSubreddit({
        name: subredditName,
      });
      // console.log(subreddit);
      if (subreddit.status === "fail") {
        res.status(404).json({
          status: 404,
          message: "subreddit doesn't exist",
        });
      } else {
        let canDelete = await this.subredditServices.isOwner(
          subredditName,
          userId
        );
        if (!canDelete) {
          res.status(401).json({
            status: 401,
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
            console.log(response);
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
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

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

  // async setPrimaryTopic(req,res){
  //   let subredditName = req.params.subredditName;
  //   let userId = req.user._id;
  //   try {

  //   } catch (err) {
  //     console.log("error in subredditservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // }

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

  async subscribe(req, res) {
    //setting sub default behavior
    const action = req.query.action || "sub";

    //check if subreddit exists
    const subreddit = await this.subredditServices.subExists(
      req.params.subredditName,
      "_id"
    );
    if (!subreddit) {
      res.status(404).json({
        status: "fail",
        message: "Subreddit not found",
      });
      return;
    }

    //check if user is not banned
    const banned = await this.subredditServices.isBanned(
      subreddit._id,
      req.user._id
    );
    if (banned) {
      res.status(400).json({
        status: "fail",
        message: "User is banned from the subreddit",
      });
      return;
    }

    //subscribe or unsubscribe user according to sub
    const success = await this.userServices.subscribe(
      req.user._id,
      subreddit._id,
      action
    );

    if (!success) {
      res.status(400).json({
        status: "fail",
        message: "Invalid subscribtion action",
      });
      return;
    }

    res.status(200).json({
      status: "success",
    });
  }
}

//export default userController;
module.exports = subredditController;
