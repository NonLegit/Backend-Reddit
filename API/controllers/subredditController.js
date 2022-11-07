class subredditController {
  constructor(subredditServices) {
    console.log("from controller" + subredditServices);
    this.subredditServices = subredditServices; // can be mocked in unit testing
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubredditSettings = this.getSubredditSettings.bind(this);
    this.updateSubredditSettings = this.updateSubredditSettings.bind(this);
  }
  // ! todo: need some refractoring here 
  async createSubreddit(req, res, next) {
    let data = req.body;
    let userId = req.user._id;
    console.log(req.user);
    // let userId = req.params.id;
    data.owner = userId;
    console.log(userId);
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
    console.log(subreddit);
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
    // let userId = req.params._id;
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
}


//export default userController;
module.exports = subredditController;
