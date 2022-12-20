const { query } = require("express");
const {
  subredditErrors,
  userErrors,
  mongoErrors,
} = require("../error_handling/errors");
const { syncIndexes } = require("../models/userModel");

class subredditController {
  constructor({ subredditService, UserService }) {
    this.subredditServices = subredditService; // can be mocked in unit testing
    this.userServices = UserService;
  }
  // TODO: service tests
  createSubreddit = async (req, res) => {
    let data = req.body;
    let userId = req.user._id;
    let userName = req.user.userName;

    const validReq = data.fixedName && data.type;
    if (!validReq) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Invalid request",
      });
      return;
    }
    if (isEmpty(data)) {
      res.status(400).json({
        status: "fail",
        errorMessage: "please provide a body",
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
  // TODO: service tests
  updateSubredditSettings = async (req, res) => {
    let subredditName = req.params.subredditName;
    let data = req.body;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (isEmpty(data)) {
      res.status(400).json({
        status: "fail",
        errorMessage: "please provide a body",
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
  // TODO: service tests
  getSubredditSettings = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let subreddit = await this.subredditServices.retrieveSubreddit(
      userId,
      subredditName,
      false
    );

    console.log(subreddit);

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
  // TODO: service tests
  deleteSubreddit = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
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
  //delete a mod
  deletemoderator = async (req, res, next) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let moderatorName = req.params.moderatorName;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!moderatorName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter moderatorName",
      });
      return;
    }

    let deleted = await this.subredditServices.deleteMod(
      subredditName,
      userId,
      moderatorName
    );

    if (!deleted.success) {
      let msg, stat;
      switch (deleted.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.Not_MODERATOR:
          msg = "user is not a moderator";
          stat = 400;
          break;
        case subredditErrors.CANNOT_DELETE:
          msg = "canot delete mod higher than you in mod tree";
          stat = 401;
          break;
        case subredditErrors.MONGO_ERR:
          msg = deleted.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({ status: "success" });
    req.messageObject = deleted.messageObj;
    return next();
  };

  // TODO: unit tests (service)
  //accept or reject
  ModeratorInvitation = async (req, res) => {
    let userId = req.user._id;
    let userName = req.user.userName;
    let PP = req.user.profilePicture;
    let subredditName = req.params.subredditName;
    let action = req.params.action;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    if (!action) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter action",
      });
      return;
    }
    if (action != "accept" && action != "reject") {
      res.status(400).json({
        status: "fail",
        errorMessage: "Invalid Enum value",
      });
      return;
    }

    let accepted = await this.subredditServices.handleInvitation(
      userId,
      userName,
      PP,
      subredditName,
      action
    );

    if (!accepted.success) {
      let msg, stat;
      switch (accepted.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case userErrors.ALREADY_MODERATOR:
          msg = "user already moderator";
          stat = 400;
          break;
        case subredditErrors.NO_INVITATION:
          msg = "there is no moderation invitation to this subreddit";
          stat = 404;
          break;

        case subredditErrors.MONGO_ERR:
          msg = accepted.msg;
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

  // TODO: service tests
  // TODO: add name with fixedName in body

  subredditsJoined = async (req, res) => {
    let userId = req.user._id;
    let location = req.params.where;

    if (!location) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter location",
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
  // TODO: service tests
  // TODO: this for deleting DB
  subredditsModerated = async (req, res) => {
    let userName = req.params.username;

    if (!userName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter userName",
      });
      return;
    }
    let subreddits = await this.subredditServices.subredditsModeratedBy(
      userName
    );

    if (!subreddits.success) {
      let msg, stat;
      switch (subreddits.error) {
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

  // TODO: service test
  //invite the mod
  inviteModerator = async (req, res, next) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let moderatorName = req.params.moderatorName;
    let data = req.body;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!moderatorName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter moderatorName",
      });
      return;
    }
    if (isEmpty(data)) {
      res.status(400).json({
        status: "fail",
        errorMessage: "please provide a permissions",
      });
      return;
    }
    let invitation = await this.subredditServices.inviteMod(
      subredditName,
      userId,
      moderatorName,
      data
    );

    // console.log(invitation);
    if (!invitation.success) {
      let msg, stat;
      switch (invitation.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.USER_IS_ALREADY_INVITED:
          msg = "user is already invited";
          stat = 400;
          break;
        case userErrors.ALREADY_MODERATOR:
          msg = "user is already moderator";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = invitation.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }

    res.status(204).json({ status: "success" });
    req.messageObject = invitation.messageObj;
    return next();
  };

  // TODO: service tests
  updatePermissions = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let moderatorName = req.params.moderatorName;
    let data = req.body; //new permissions

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!moderatorName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter moderatorName",
      });
      return;
    }

    let update = await this.subredditServices.updateModeratorSettings(
      subredditName,
      userId,
      moderatorName,
      data
    );

    if (!update.success) {
      let msg, stat;
      switch (update.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.Not_MODERATOR:
          msg = "user is not a moderator";
          stat = 400;
          break;
        case subredditErrors.CANNOT_UPDATE:
          msg = "cannot update mod higher than you in mod tree";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = update.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({ status: "success" });
  };

  // TODO: service tests
  // TODO: check if user is mod or not (add security level)
  getModerators = async (req, res) => {
    let subredditName = req.params.subredditName;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let mods = await this.subredditServices.mods(subredditName);

    if (!mods.success) {
      let msg, stat;
      switch (mods.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.MONGO_ERR:
          msg = mods.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: mods.data });
  };

  // TODO: service test
  leaveModerator = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let leave = await this.subredditServices.leaveMod(userId, subredditName);

    if (!leave.success) {
      let msg, stat;
      switch (leave.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.NOT_MODERATOR:
          msg = "user is not a moderator";
          stat = 400;
          break;

        case subredditErrors.MONGO_ERR:
          msg = leave.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
  };
  // TODO: service test
  Favourite = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    let mark = await this.subredditServices.handleFavourite(
      userId,
      subredditName
    );

    if (!mark.success) {
      let msg, stat;
      switch (mark.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.MONGO_ERR:
          msg = mark.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
  };
  // TODO: service tests
  favouriteSubreddits = async (req, res) => {
    let userId = req.user._id;

    let favourites = await this.subredditServices.getFavourites(userId);

    if (!favourites.success) {
      let msg, stat;
      switch (favourites.error) {
        case subredditErrors.MONGO_ERR:
          msg = favourites.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: favourites.data });
  };

  // TODO: service test
  //ban a user
  banSettings = async (req, res, next) => {
    let userId = req.user._id; //me
    let subredditName = req.params.subredditName;
    let banedUser = req.params.userName;
    let action = req.params.action;
    let data = req.body;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!banedUser) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter banedUser",
      });
      return;
    }

    if (!action) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter action",
      });
      return;
    }

    if (action !== "ban" && action !== "unban") {
      res.status(400).json({
        status: "fail",
        errorMessage: "Invalid Enum value [ban,unban]",
      });
      return;
    }

    let result = await this.subredditServices.banUnban(
      userId,
      subredditName,
      banedUser,
      action,
      data
    );
    console.log("ttttttttttttttttttttttttttt");

    if (!result.success) {
      let msg, stat;
      switch (result.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.MODERATOR:
          msg = "user is a moderator cant make this action";
          stat = 400;
          break;
        case userErrors.ALREADY_BANED:
          msg = "user is already banned";
          stat = 400;
          break;
        case userErrors.Not_BANED:
          msg = "user is not baned to unban";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = result.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }

    res.status(204).json({});
    if (action == "ban") {
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      //  let messageObj = {
      // to:result.bannedId,
      // from:req.user._id,
      // type:"subredditBan",
      //    subreddit: result.subredditId
      //  };

      // console.log(messageObj);
      req.messageObject = result.messageObj;

      return next();
    }
    return;
  };

  // TODO: service testing
  //mute a user
  muteSettings = async (req, res, next) => {
    let userId = req.user._id; //me
    let subredditName = req.params.subredditName;
    let mutedUser = req.params.userName;
    let action = req.params.action;
    let data = req.body;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!mutedUser) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter mutedUser",
      });
      return;
    }

    if (!action) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter action",
      });
      return;
    }

    if (action !== "mute" && action !== "unmute") {
      res.status(400).json({
        status: "fail",
        errorMessage: "Invalid Enum value [mute,unmute]",
      });
      return;
    }

    let result = await this.subredditServices.muteUnmute(
      userId,
      subredditName,
      mutedUser,
      action,
      data
    );

    if (!result.success) {
      let msg, stat;
      switch (result.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.MODERATOR:
          msg = "user is a moderator cant make this action";
          stat = 400;
          break;
        case userErrors.ALREADY_MUTED:
          msg = "user is already muted";
          stat = 400;
          break;
        case userErrors.Not_MUTED:
          msg = "user is not muted to unmute";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = result.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    //console.log(result);
    res.status(204).json({});
    console.log("kkkkkkkkkkkkkkkkkkkkkkk");
    if (action == "mute") {
      //  let messageObj = {
      // to:result.mutedId,
      // from:req.user._id,
      // type:"subredditMute",
      // subreddit:result.subredditId};

      req.messageObject = result.messageObj;
      return next();
    }
    return;
    //from action
  };

  // TODO: service tests
  bannedUsers = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let banned = await this.subredditServices.banned(subredditName, userId);

    if (!banned.success) {
      let msg, stat;
      switch (banned.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case subredditErrors.MONGO_ERR:
          msg = banned.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: banned.data });
  };

  // TODO: service tests
  mutedUsers = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let muted = await this.subredditServices.muted(subredditName, userId);

    if (!muted.success) {
      let msg, stat;
      switch (muted.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;

        case subredditErrors.MONGO_ERR:
          msg = muted.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: muted.data });
  };

  // TODO: service tests
  addRule = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let data = req.body;
    let title = req.params.title;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!title) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter rule title",
      });
      return;
    }

    let add = await this.subredditServices.addRule(
      subredditName,
      userId,
      title,
      data
    );

    if (!add.success) {
      let msg, stat;
      switch (add.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case subredditErrors.RULE_TAKEN:
          msg = "this title is already taken";
          stat = 400;
          break;
        case subredditErrors.MONGO_ERR:
          msg = add.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
  };

  // TODO: service tests
  editRule = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let data = req.body;
    let title = req.params.title;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!title) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter rule title",
      });
      return;
    }

    let edit = await this.subredditServices.editRule(
      subredditName,
      userId,
      title,
      data
    );

    if (!edit.success) {
      let msg, stat;
      switch (edit.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case subredditErrors.RULE_NOT_FOUND:
          msg = "this rule doesn't exist";
          stat = 404;
          break;
        case subredditErrors.MONGO_ERR:
          msg = edit.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
  };

  // TODO: service tests
  deleteRule = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let title = req.params.title;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }
    if (!title) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter rule title",
      });
      return;
    }

    let deleteR = await this.subredditServices.deleteRule(
      subredditName,
      userId,
      title
    );

    if (!deleteR.success) {
      let msg, stat;
      switch (deleteR.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case subredditErrors.RULE_NOT_FOUND:
          msg = "this rule doesn't exist";
          stat = 404;
          break;
        case subredditErrors.MONGO_ERR:
          msg = deleteR.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
  };

  // TODO: service tests
  modPosts = async (req, res) => {
    let location = req.params.location;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!location) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter location",
      });
      return;
    }
    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter subredditName",
      });
      return;
    }

    let posts = await this.subredditServices.categorizedPosts(
      req.query,
      subredditName,
      userId,
      location
    );

    if (!posts.success) {
      let msg, stat;
      switch (posts.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case mongoErrors.NOT_FOUND:
          res.status(200).json({
            status: "success",
            data: [],
          });
          return;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;

        case subredditErrors.MONGO_ERR:
          msg = posts.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: posts.data });
  };

  // TODO: service tests
  leaderboardCategory = async (req, res) => {
    let category = req.params.category;
    if (!category) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter location",
      });
      return;
    }

    let subreddits = await this.subredditServices.categorizedSubreddits(
      category,
      req.query,
      req.user._id
    );

    if (!subreddits.success) {
      let msg, stat;
      switch (subreddits.error) {
        case mongoErrors.NOT_FOUND:
          res.status(200).json({
            status: "success",
            data: [],
          });
          return;
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
    res.status(200).json({ status: "success", data: subreddits.data });
  };

  // TODO: service tests
  leaderboardRandom = async (req, res) => {
    let subreddits = await this.subredditServices.randomSubreddits(
      req.query,
      req.user._id
    );

    if (!subreddits.success) {
      let msg, stat;
      switch (subreddits.error) {
        case mongoErrors.NOT_FOUND:
          res.status(200).json({
            status: "success",
            data: [],
          });
          return;
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
    res.status(200).json({ status: "success", data: subreddits.data });
  };
  //approve a user

  //TODO:approve a user message
  approveUser = async (req, res, next) => {
    let userId = req.user._id; //me
    let subredditName = req.params.subredditName;
    let approvedUser = req.params.userName;
    let action = req.params.action;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter subredditName",
      });
      return;
    }

    if (!approvedUser) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter approvedUser",
      });
      return;
    }

    if (!action) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter approvedUser",
      });
      return;
    }
    console.log("ppppppppppppppppppppppppppppppppppppppp");
    let approve = await this.subredditServices.approveUser(
      userId,
      subredditName,
      approvedUser,
      action
    );

    if (!approve.success) {
      let msg, stat;
      switch (approve.error) {
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;
        case userErrors.USER_NOT_FOUND:
          msg = "user not found";
          stat = 404;
          break;
        case userErrors.MODERATOR:
          msg =
            "user is a moderator cant make this action (he is already approved by default)";
          stat = 400;
          break;
        case userErrors.ALREADY_APPROVED:
          msg = "user is already approved before";
          stat = 400;
          break;
        case userErrors.NOT_APPROVED:
          msg = "user is not approved to disapprove";
          stat = 400;
          break;

        case subredditErrors.MONGO_ERR:
          msg = approve.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(204).json({});
    console.log(action);
    if (action == "approve") {
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      //  let messageObj = {
      // to:approve.approvedId,
      // from:req.user._id,
      // type:"subredditApprove",
      //    subreddit: approve.subredditId
      //  };

      //console.log(messageObj);
      req.messageObject = approve.messageObj;

      return next();
    }
    return;
  };

  approvedUsers = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let approved = await this.subredditServices.approved(subredditName, userId);

    if (!approved.success) {
      let msg, stat;
      switch (approved.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;

        case subredditErrors.MONGO_ERR:
          msg = approved.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: approved.data });
  };
  // this is for droping database commit
  reels = async (req, res) => {
    let topic = req.params.topics;

    if (!topic) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter topic",
      });
      return;
    }

    let posts = await this.subredditServices.reels(topic, req.query);
    if (!posts.success) {
      let msg, stat;
      switch (posts.error) {
        case mongoErrors.NOT_FOUND:
          res.status(200).json({
            status: "success",
            data: [],
          });
          return;
        case subredditErrors.MONGO_ERR:
          msg = posts.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: posts.data });
  };

  traffic = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter topic",
      });
      return;
    }

    let reports = await this.subredditServices.traffic(subredditName, userId);

    if (!reports.success) {
      let msg, stat;
      switch (reports.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this request";
          stat = 401;
          break;
        case subredditErrors.MONGO_ERR:
          msg = reports.msg;
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
      data: reports.data,
    });
  };

  pendingInvetations = async (req, res) => {
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Missing required parameter subredditName",
      });
      return;
    }

    let invitation = await this.subredditServices.invitations(
      subredditName,
      userId
    );

    if (!invitation.success) {
      let msg, stat;
      switch (invitation.error) {
        case subredditErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;

        case subredditErrors.NOT_MODERATOR:
          msg = "you are not moderator to preform this action";
          stat = 401;
          break;

        case subredditErrors.MONGO_ERR:
          msg = invitation.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        errorMessage: msg,
      });
      return;
    }
    res.status(200).json({ status: "success", data: invitation.data });
  };

  //!===================================================================================
  createFlair = async (req, res) => {
    let data = req.body;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    if (!data.text || !subredditName || !userId) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }
    try {
      //  console.log('here2');
      let flair = await this.subredditServices.createFlair(
        subredditName,
        data,
        userId
      );

      if (!flair.success) {
        let message, statusCode, status;
        switch (flair.error) {
          case subredditErrors.NOT_MODERATOR:
            message = "Not a subreddit moderator";
            statusCode = 403;
            status = "Forbidden";
            break;
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(201).json({
        status: "Created",
        data: flair.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  updateFlair = async (req, res) => {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;
    let data = req.body;

    if (!flairId || !subredditName || !userId || !data) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }

    try {
      let flair = await this.subredditServices.updateFlair(
        subredditName,
        flairId,
        data,
        userId
      );

      if (!flair.success) {
        let message, statusCode, status;
        switch (flair.error) {
          case subredditErrors.NOT_MODERATOR:
            message = "Not a subreddit moderator";
            statusCode = 403;
            status = "Forbidden";
            break;
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.FLAIR_NOT_FOUND:
            message = "Flair not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        res.status(statusCode).json({
          status: status,
          message: message,
        });
        return;
      }

      res.status(200).json({
        status: "OK",
        data: flair.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  deleteFlair = async (req, res) => {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    let userId = req.user._id;

    if (!flairId || !subredditName || !userId) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }
    try {
      let flair = await this.subredditServices.deleteFlair(
        subredditName,
        flairId,
        userId
      );
      if (!flair.success) {
        let message, statusCode, status;
        switch (flair.error) {
          case subredditErrors.NOT_MODERATOR:
            message = "Not a subreddit moderator";
            statusCode = 403;
            status = "Forbidden";
            break;
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.FLAIR_NOT_FOUND:
            message = "Flair not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      return res.status(204).send();
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  getFlair = async (req, res) => {
    let flairId = req.params.flairId;
    let subredditName = req.params.subredditName;
    if (!flairId || !subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }
    try {
      let flair = await this.subredditServices.getFlair(subredditName, flairId);
      if (!flair.success) {
        let message, statusCode, status;
        switch (flair.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.FLAIR_NOT_FOUND:
            message = "Flair not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(200).json({
        status: "OK",
        data: flair.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };

  getFlairs = async (req, res) => {
    let subredditName = req.params.subredditName;
    if (!subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }
    try {
      let flairs = await this.subredditServices.getFlairs(subredditName);

      if (!flairs.success) {
        let message, statusCode, status;
        switch (flairs.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }
      res.status(200).json({
        status: "OK",
        data: flairs.data,
      });
    } catch (err) {
      console.log("error in subredditController " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };

  getSubredditId = async (req, res, next) => {
    let subredditName = req.params.subredditName;
    try {
      let response = await this.subredditServices.checkSubreddit(subredditName);
      // console.log(response);
      if (response.success) {
        req.toFilter = response.doc._id;
        next();
      } else {
        res.status(404).json({
          status: "Not Found",
          message: "Subreddit not found",
        });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };

  subscribe = async (req, res) => {
    //setting sub default behavior
    const subredditName = req.params?.subredditName;
    const action = req.query?.action || "sub";
    if ((action !== "sub" && action !== "unsub") || !subredditName) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }
    //check if subreddit exists
    const subreddit = await this.subredditServices.subscriable(
      subredditName,
      req.user._id
    );
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

    await this.subredditServices.updateUserCount(subreddit._id, action);

    res.status(200).json({
      status: "success",
    });
  };
}
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

module.exports = subredditController;
