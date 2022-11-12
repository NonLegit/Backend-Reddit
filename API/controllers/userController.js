class UserController {
  constructor(UserServices) {
    this.userServices = UserServices; // can be mocked in unit testing
    this.createUser = this.createUser.bind(this);
    this.getPrefs = this.getPrefs.bind(this);
    this.updatePrefs = this.updatePrefs.bind(this);
    this.usernameAvailable = this.usernameAvailable.bind(this);
    this.about = this.about.bind(this);
  }
  async createUser(req, res, next) {
    let data = req.body;
    try {
      let user = await this.userServices.createUser(data);
      if (user.status === "success") {
        res.status(user.statusCode).json({
          status: user.status,
          user: user.doc,
        });
      } else {
        res.status(user.statusCode).json({
          status: user.status,
          message: user.err,
        });
      }
    } catch (err) {
      console.log("error in userservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async getPrefs(req, res, next) {
    console.log(req.user);
    const prefs = this.userServices.getPrefs(req.user);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  }
  async updatePrefs(req, res, next) {
    console.log(req.body);
    const query = req.body;
    const prefs = await this.userServices.updatePrefs(query, req.user._id);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  }

  async usernameAvailable(req, res) {
    if (!req.query.userName) {
      res.status(400).json({
        status: "fail",
        message: "userName query paramater is required",
      });
      return;
    }
    const available = await this.userServices.isAvailable(req.query.userName);
    if (available) {
      res.status(200).json({
        status: "success",
        available: true,
      });
    } else {
      res.status(200).json({
        status: "success",
        available: false,
      });
    }
  }
  async getMe(req, res, next) {
    const user = req.user;
    const me = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      contentVisibility: user.contentVisibility,
      canbeFollowed: user.canbeFollowed,
      lastUpdatedPassword: user.lastUpdatedPassword,
      followersCount: user.followersCount,
      friendsCount: user.friendsCount,
      accountActivated: user.accountActivated,
      gender: user.gender,
      displayName: user.displayName,
      postKarma: user.postKarma,
      commentKarma: user.commentKarma,
    };
    res.status(200).json({
      status: "success",
      user: me,
    });
  }
  async about(req, res, next) {
    if (!req.params.userName) {
      res.status(400).json({
        status: "fail",
        message: "Provide userName ",
      });
    } else {
      const me = req.user;
      const userName = req.params.userName;
      let user = await this.userServices.getUserByName(userName, "");
      // get id of user with its name
      console.log(user);
      if (user.status !== "fail") {
        // check if i followed him
        const relation = me.meUserRelationship.find(
          (element) => element.userId === user.doc._id
        );
        let isFollowed = false;
        if (relation) {
          if (relation.status === "followed") isFollowed = true;
        }
        const searchUser = {
          id: user.doc._id,
          userName: user.doc.userName,
          profilePicture: user.doc.profilePicture,
          contentVisibility: user.doc.contentVisibility,
          canbeFollowed: user.doc.canbeFollowed,
          followersCount: user.doc.followersCount,
          friendsCount: user.doc.friendsCount,
          gender: user.doc.gender,
          displayName: user.doc.displayName,
          postKarma: user.doc.postKarma,
          commentKarma: user.doc.commentKarma,
          isFollowed: isFollowed,
        };
        res.status(200).json({
          status: "success",
          user: searchUser,
        });
      } else {
        res.status(200).json({
          status: "fail",
          errorMessage: "user not found",
        });
      }
    }
  }
}
//export default userController;
module.exports = UserController;
