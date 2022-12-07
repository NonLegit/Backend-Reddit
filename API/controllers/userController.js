/**
 * UserController Class which handles user services
 */
class UserController {
  /**
   * Constructor
   * Depends on user services object
   * @param {object} UserService - user service objec
   */
  constructor({ UserService }) {
    this.userServices = UserService; // can be mocked in unit testing
  }
  // createUser = async (req, res, next) => {
  //   let data = req.body;
  //   try {
  //     let user = await this.userServices.createUser(data);
  //     if (user.status === "success") {
  //       res.status(user.statusCode).json({
  //         status: user.status,
  //         user: user.doc,
  //       });
  //     } else {
  //       res.status(user.statusCode).json({
  //         status: user.status,
  //         message: user.err,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("error in userservices " + err);
  //     res.status(500).json({
  //       status: "fail",
  //     });
  //   }
  // };
  /**
   * @property {Function} getPrefs get user preferences
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  getPrefs = async (req, res, next) => {
    const prefs = this.userServices.getPrefs(req.user);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  };
  /**
   * @property {Function} updatePrefs update user preferences
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  updatePrefs = async (req, res, next) => {
    const query = req.body;
    const prefs = await this.userServices.updatePrefs(query, req.user._id);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  };

  usernameAvailable = async (req, res) => {
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
  };
  /**
   *
   * @property {Function} getMe return all data of authenticated user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  getMe = async (req, res, next) => {
    const user = req.user;
    console.log(user);
    const me = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      profilePicture: user.profilePicture,
      profileBackground: user.profileBackground,
      canbeFollowed: user.canbeFollowed,
      lastUpdatedPassword: user.lastUpdatedPassword,
      followersCount: user.followersCount,
      friendsCount: user.friendsCount,
      accountActivated: user.accountActivated,
      gender: user.gender,
      displayName: user.displayName,
      postKarma: user.postKarma,
      commentKarma: user.commentKarma,
      createdAt: user.joinDate,
      description: user.description,
      adultContent: user.adultContent,
      nsfw: user.nsfw,
      socialLinks: user.socialLinks,
      country: user.country,
    };
    res.status(200).json({
      status: "success",
      user: me,
    });
  };
  /**
   *
   * @property {Function} about return information about another user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  // should check if user blocked me or not ?!
  about = async (req, res, next) => {
    if (!req.params.userName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide userName ",
      });
    } else {
      const me = req.user;
      const userName = req.params.userName;
      let user = await this.userServices.getUserByName(userName, "");
      // get id of user with its name
      if (user.success !== false) {
        // check if i followed him
        const relation = me.meUserRelationship.find(
          (element) => element.userId === user.data._id
        );
        let isFollowed = false;
        if (relation) {
          if (relation.status === "followed") isFollowed = true;
        }
        const searchUser = {
          id: user.data._id,
          userName: user.data.userName,
          profilePicture: user.data.profilePicture,
          profileBackground: user.data.profileBackground,
          canbeFollowed: user.data.canbeFollowed,
          followersCount: user.data.followersCount,
          friendsCount: user.data.friendsCount,
          gender: user.data.gender,
          displayName: user.data.displayName,
          postKarma: user.data.postKarma,
          commentKarma: user.data.commentKarma,
          description: user.data.description,
          createdAt: user.data.joinDate,
          nsfw: user.data.nsfw,
          autoplayMedia: user.data.autoplayMedia,
          adultContent: user.data.adultContent,
          isFollowed: isFollowed,
          country: user.country,
        };
        res.status(200).json({
          status: "success",
          user: searchUser,
        });
      } else {
        res.status(404).json({
          status: "fail",
          errorMessage: "User Not Found",
        });
      }
    }
  };
  getSocialLinks = async (req, res, next) => {
    let data = await this.userServices.getSocialLinks();

    res.status(200).json({
      status: "success",
      socialLinks: data,
    });
  };
  addSocialLink = async (req, res, next) => {
    let displayText = req.body.displayText;
    let userLink = req.body.userLink;
    let socialId = req.body.socialId;
    let me = req.user;
    if (
      displayText === undefined ||
      userLink === undefined ||
      socialId === undefined
    ) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide displayText , userLink and socialId ",
      });
    } else {
      let data = await this.userServices.createSocialLinks(
        me,
        displayText,
        userLink,
        socialId
      );
      if (data.success === true) {
        res.status(201).json({
          status: "success",
        });
      } else {
        if (data.error === 8) {
          res.status(400).json({
            status: "fail",
            errorMessage: data.msg,
          });
        } else {
          res.status(404).json({
            status: "fail",
            errorMessage: data.msg,
          });
        }
      }
    }
  };

  updateSocialLink = async (req, res, next) => {
    let displayText = req.body.displayText;
    let userLink = req.body.userLink;
    let me = req.user;
    let id = req.params.id;
    if (displayText === undefined && userLink === undefined) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide displayText or userLink.",
      });
    } else {
      console.log("start");
      let data = await this.userServices.updateSocialLinks(
        me,
        id,
        userLink,
        displayText
      );
      if(data.success === true)
      {
        res.status(200).json({
          status: "success",
          socialLinks: data.socialLinks,
        });
      }
      else {
        res.status(404).json({
          status: "fail",
          errorMessage: "socialLink id not found",
        });
      }

    }
  };
  deleteSocialLink = async (req, res, next) => {
    let id = req.params.id;
    let me = req.user;
    let data = await this.userServices.deleteSocialLinks(me, id);

    if (data.success === true) {
      res.status(204).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        errorMessage: "Invalid Social id",
      });
    }
  };
}
//export default userController;
module.exports = UserController;
