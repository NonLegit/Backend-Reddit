const { query } = require("express");
const {
  subredditErrors,
  mongoErrors,
  userErrors,
} = require("../error_handling/errors");
const subreddit = require("../models/subredditModel");

/**
 * this class is used for implementing Subreddit Service functions
 * @param {Repository} subredditRepository - subreddit repository object to access repository functions using subreddit model
 * @param {Repository} flairRepository - flair repository object to access repository functions using flair model
 * @param {Repository} userRepository - user repository object to access repository functions using user model
 */
class subredditService {
  constructor({
    SubredditRepository,
    FlairRepository,
    UserRepository,
    PostRepository,
  }) {
    this.flairRepository = FlairRepository; // can be mocked in unit testing
    this.userRepository = UserRepository;
    this.subredditRepository = SubredditRepository; // can be mocked in unit testing
    this.postRepository = PostRepository;
  }
  /**
   * create subreddit service function
   * @param {object} data - the data coming from request body
   * @param {string} userName - username of currently logged user
   * @param {String} profilePicture - profile picture of currently logged user
   * @returns {Object} - a response containing the created subreddit.
   *
   */
  async createSubreddit(data, userName, profilePicture) {
    // ..
    let subredditExisted = await this.retrieveSubreddit(
      data.owner,
      data.fixedName,
      true
    );
    if (!subredditExisted.success) {
      let subreddit = await this.subredditRepository.create(
        data,
        userName,
        profilePicture
      );
      if (subreddit.success) {
        let sub = this.userRepository.subscribe(
          subreddit.doc._id,
          subreddit.doc.owner
        );
        let subSubreddit = this.subredditRepository.subscribe(
          subreddit.doc._id,
          subreddit.doc.owner
        );

        return { success: true, data: subreddit.doc };
      } else
        return {
          success: false,
          error: subredditErrors.MONGO_ERR,
          msg: subreddit.msg,
        };
    } else return { success: false, error: subredditErrors.ALREADY_EXISTS };
  }

  /**
   *This function deletes the subreddit
   * @param {String} subredditName - query filters to select a spacefic document in database
   * @param {String} userId - query options
   * @returns {Object} - a response
   */
  async deleteSubreddit(subredditName, userId) {
    // ..
    let subreddit = await this.retrieveSubreddit(userId, subredditName, true);
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let owner = await this.subredditRepository.isOwner(subredditName, userId);
    if (!owner.success)
      return { success: false, error: subredditErrors.NOT_OWNER };

    let response = await this.subredditRepository.delete(subredditName);
    if (!response.success) return response;
    else return { success: true };
  }
  /**
   * this function Updates the subreddit
   * @param {String} subredditName -
   * @param {String} userId -
   * @param {object} data - the new data passed from request body
   * @returns {Object} - a response containing the updated subreddit.
   */
  async updateSubreddit(subredditName, userId, data) {
    // ..
    let subreddit = await this.retrieveSubreddit(userId, subredditName, true);
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let moderator = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!moderator.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let updated = await this.subredditRepository.update(subredditName, data);
    if (!updated.success) return updated;

    return { success: true, data: updated.doc };
  }
  /**
   * retrieve a subreddit from database service function
   * @param {userId} userId - user id
   * @param {object} name - a query to select a certain subreddit from database
   * @param {boolean} checkOnly - a boolean to indecate wheather i want to check if user is joined or check only if subreddit exists
   * @returns {Object} - a response containing the retrieved subreddit
   */
  async retrieveSubreddit(userId, name, checkOnly) {
    let subreddit = await this.subredditRepository.getsubreddit(name, "", "");
    if (subreddit.success) {
      if (!checkOnly) {
        let joined = this.userRepository.isSubscribed(
          userId,
          subreddit.doc._id
        );
        subreddit.doc.isJoined = await joined;
      }
      return { success: true, data: subreddit.doc };
    } else
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
  }

  /**
   * this function invites a user to be a moderator
   * @param {string} subredditName - name of subreddit i want to add moderator in it
   * @param {string} userId - iD of the user calling this function
   * @param {string} modName - name of user i want to make him moderator
   * @param {object} data - moderator permissions bassed from request body
   * @returns {Object} a response.
   */
  async inviteMod(subredditName, userId, modName, data) {
    // ..
    //  check subreddit existed or not
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );
    // console.log(subredditExisted.data._id);
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    else {
      // 2]check user is moderator
      let canInvite = await this.subredditRepository.isModerator_1(
        subredditName,
        userId
      );
      if (!canInvite.success)
        return { success: false, error: subredditErrors.NOT_MODERATOR };
      else {
        // he is moderator and subreddit is existed => 3]check username existed
        let userExisted = await this.userRepository.findByUserName(
          modName,
          "",
          ""
        );
        if (!userExisted.success)
          return { success: false, error: userErrors.USER_NOT_FOUND };
        else {
          //  4] check if he is not mod to this subreddit

          let UserIsMod = await this.subredditRepository.isModerator_2(
            subredditName,
            userExisted.doc._id
          );

          if (!UserIsMod.success) {
            //  check before send that he is not invited

            let invited = await this.userRepository.checkInvetation(
              userExisted.doc._id,
              subredditExisted.data._id
            );
            //console.log(invited);
            
            if (invited.success)
              return {
                success: false,
                error: userErrors.USER_IS_ALREADY_INVITED,
              };

            let updateModerators = await this.userRepository.updateByName(
              modName,
              subredditExisted.data._id,
              data.permissions
            );
            console.log("oriwpotuertiouweiotruewtr[w[t");
            let updateInvetation = await this.subredditRepository.invite(
              userId,
              subredditName
            );
            console.log(updateInvetation);
            console.log("============================================");

            if (!updateModerators.success) return updateModerators;
            let messageObj = {
              from: userId,
              to: updateModerators.doc._id,
              subreddit: subredditExisted.data._id,
              type: "subredditModeratorInvite",
            };
            //console.log(messageObj);
            return { success: true, messageObj: messageObj }; //  finally sent
          } else return { success: false, error: userErrors.ALREADY_MODERATOR };
        }
      }
    }
  }

 /**
  * This function handles invitations sent to user to join as moderator.
  * @param {String} userId 
  * @param {String} userName 
  * @param {String} profilePicture 
  * @param {String} subredditName 
  * @param {String} action 
  * @returns {Object} - a response
  */
  async handleInvitation(
    userId,
    userName,
    profilePicture,
    subredditName,
    action
  ) {
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );
    // console.log(subredditExisted);
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let invited = await this.userRepository.checkInvetation(
      userId,
      subredditExisted.data._id
    );
    //console.log(invited);
    if (!invited.success)
      return {
        success: false,
        error: subredditErrors.NO_INVITATION,
      };
    if (action === "accept") {
      let accepted = await this.subredditRepository.addModerator(
        userId,
        userName,
        profilePicture,
        subredditName,
        invited.doc.pendingInvitations[0].permissions
      );

      if (!accepted.success)
        return { success: false, error: subredditErrors.MONGO_ERR };
    }
    //delete pending invitation

    let allInvitations = await this.userRepository.returnInvitations(userId);
    let invitations = allInvitations.doc.pendingInvitations;
    let afterDelete = this.removeSubredditId(
      invitations,
      subredditExisted.data._id
    );
    let updateInvitations = await this.userRepository.updateInvitations(
      userId,
      afterDelete
    );

    await this.subredditRepository.disInvite(userId, subredditName);

    return { success: true };
  }


/**
 * utility function
 * @param {Array} list 
 * @param {Object} value 
 * @returns {Array} - modified array
 */
  removeSubredditId(list, value) {
    return list.filter(function (ele) {
      return !value.equals(ele.subredditId);
    });
  }

  /**
   * utility function
   * @param {Array} list 
   * @param {Object} value 
   * @param {String} type 
   * @returns {Array} a modified array
   */
  removeId(list, value, type) {
    return list.filter(function (ele) {
      return !(value.equals(ele.user._id) && ele.type === type);
    });
  }

  /**
   * this function removes user from being moderator in a certain subreddit
   * @param {string} subredditName - name of subreddit i want to remove moderator from
   * @param {string} userId - iD of the user making the request
   * @param {string} modName - moderator name i want to remove from moderation
   * @returns {Object} a response.
   */
  async deleteMod(subredditName, userId, modName) {
    // ..
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    else {
      let canDelete = await this.subredditRepository.isModerator_1(
        subredditName,
        userId
      );
      // console.log(canDelete);
      if (!canDelete.success)
        return { success: false, error: subredditErrors.NOT_MODERATOR };
      else {
        // he is moderator and subreddit is existed => 3]check username existed
        let userExisted = await this.userRepository.findByUserName(
          modName,
          "",
          ""
        );
        if (!userExisted.success)
          return { success: false, error: userErrors.USER_NOT_FOUND };
        else {
          //  4] check if he is mod to this subreddit
          let UserIsMod = await this.subredditRepository.isModerator_2(
            subredditName,
            userExisted.doc._id
          );

          if (!UserIsMod.success)
            return { success: false, error: userErrors.Not_MODERATOR };

          if (
            canDelete.doc.moderators[0]["modDate"] <=
            UserIsMod.doc.moderators[0]["modDate"]
          ) {
            let allModerators = await this.subredditRepository.getModerators(
              subredditName
            );

            let mods = allModerators.doc.moderators;

            let afterDelete = this.removeId(mods, userExisted.doc._id);

            let updateMods = await this.subredditRepository.updateModerators(
              subredditName,
              afterDelete
            );

            if (!updateMods.success)
              return { success: false, error: subredditErrors.MONGO_ERR };
            let messageObj = {
              from: userId,
              to: userExisted.doc._id,
              subreddit: subredditExisted.data._id,
              type: "subredditModeratorRemove",
            };
            return { success: true, messageObj: messageObj };
            // return { success: true ,};
          }
          return { success: false, error: subredditErrors.CANNOT_DELETE };

        }
      }
    }
  }
  
  /**
   * this function returns subreddits that iam in as a subscriber or as a moderator
   * @param {string} userId - Id if user making the request
   * @param {string} location - an enum value either [subscriber, moderator]
   * @returns {Object} - a response containing an array of subreddits
   */
  async subredditsIamIn(userId, location) {
    if (location === "moderator") {
      //! get list of subreddits iam moderator in (easy)
      let sub = await this.subredditRepository.getSubreddits(userId, "id");
      if (!sub.success) return sub;
      else {
        let subreddits = [];
        for (const subreddit of sub.doc) {
          if (subreddit.users.find((el) => el._id.equals(userId))) {
            subreddit.isJoined = true;
          }

          subreddits.push({
            _id: subreddit._id,
            fixedName: subreddit.fixedName,
            isJoined: subreddit.isJoined,
            icon: subreddit.icon,
            backgroundImage: subreddit.backgroundImage,
            membersCount: subreddit.membersCount,
            description: subreddit.description,
          });
        }
        return { success: true, data: subreddits };

        // return { success: true, data: subreddits.doc };
      }
    } else if (location === "subscriber") {
      // ! get it from user (easy too)
      let subreddits = await this.userRepository.getSubreddits(userId);
      // console.log(subreddits);
      if (!subreddits.success) return subreddits;
      else return { success: true, data: subreddits.doc[0].subscribed };
    } else return { success: false, error: subredditErrors.INVALID_ENUM };
  }
  
  async subredditsModeratedBy(userName) {
    let subreddits = await this.subredditRepository.getSubreddits(
      userName,
      "name"
    );
    if (!subreddits.success) return subreddits;
    else return { success: true, data: subreddits.doc };
  }

  async getFavourites(userId) {
    let subreddits = await this.userRepository.getFavouriteSubreddits(userId);
    if (!subreddits.success) return subreddits;
    else return { success: true, data: subreddits.doc };
  }
  /**
   * This function update the permissions of the moderator by another older moderator
   * @param {string} subredditName - name of subreddit
   * @param {string} userId - Id of user making the request
   * @param {string} modName - moderator name i want to change permissions
   * @param {Object} data - new permissions passed in request body
   * @returns {Object} a moderator information after updating his permissions
   */
  async updateModeratorSettings(subredditName, userId, modName, data) {
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    else {
      let canDelete = await this.subredditRepository.isModerator_1(
        subredditName,
        userId
      );
      // console.log(canDelete);
      if (!canDelete.success)
        return { success: false, error: subredditErrors.NOT_MODERATOR };
      else {
        // he is moderator and subreddit is existed => 3]check username existed
        let userExisted = await this.userRepository.findByUserName(
          modName,
          "",
          ""
        );
        if (!userExisted.success)
          return { success: false, error: userErrors.USER_NOT_FOUND };
        else {
          //  4] check if he is mod to this subreddit
          let UserIsMod = await this.subredditRepository.isModerator_2(
            subredditName,
            userExisted.doc._id
          );

          if (!UserIsMod.success)
            return { success: false, error: userErrors.Not_MODERATOR };
          // var t1 = new Date(canDelete.doc.moderators[0]["joiningDate"]);
          // console.log(t);
          if (
            parseInt(canDelete.doc.moderators[0]["modDate"]) <=
            parseInt(UserIsMod.doc.moderators[0]["modDate"])
          ) {
            // update  permissions
            let allModerators = await this.subredditRepository.getModerators(
              subredditName
            );
            let mods = allModerators.doc.moderators;
            let id = userExisted.doc._id;

            for (const moderator of mods) {
              if (id.equals(moderator.id)) {
                moderator.moderatorPermissions = data.permissions;
                break;
              }
            }

            let updateMods = await this.subredditRepository.updateModerators(
              subredditName,
              mods
            );
            if (!updateMods.success)
              return { success: false, error: subredditErrors.MONGO_ERR };

            return { success: true };
          }
          return { success: false, error: subredditErrors.CANNOT_UPDATE };
        }
      }
    }
  }

  /**
   * this function is used to handle mod actions ban or unban user in the subreddit
   * @param {String} userId 
   * @param {String} subredditName 
   * @param {String} banedUser 
   * @param {String} action 
   * @param {Object} data 
   * @returns {Object} a response
   */
  async banUnban(userId, subredditName, banedUser, action, data) {
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    else {
      let canDelete = await this.subredditRepository.isModerator_1(
        subredditName,
        userId
      );
      // console.log(canDelete);
      if (!canDelete.success)
        return { success: false, error: subredditErrors.NOT_MODERATOR };
      else {
        // he is moderator and subreddit is existed => 3]check username existed
        let userExisted = await this.userRepository.findByUserName(
          banedUser,
          "",
          ""
        );
        if (!userExisted.success)
          return { success: false, error: userErrors.USER_NOT_FOUND };
        else {
          //  4] check if he is mod to this subreddit
          let UserIsMod = await this.subredditRepository.isModerator_2(
            subredditName,
            userExisted.doc._id
          );
          //  console.log(UserIsMod);
          if (UserIsMod.success)
            return { success: false, error: userErrors.MODERATOR };

          if (action === "ban") {
            // ban user
            let check = await this.subredditRepository.checkPunished(
              userExisted.doc._id,
              subredditName,
              "banned"
            );
            if (check.success)
              return { success: false, error: userErrors.ALREADY_BANED };

            let baned = await this.subredditRepository.banUser(
              userExisted.doc,
              subredditName,
              data
            );
            if (!baned.success)
              return { success: false, error: subredditErrors.mongoErrors };

            let messageObj = {
              from: userId,
              to: userExisted.doc._id,
              subreddit: subredditExisted.data._id,
              type: "subredditBan",
            };
            return { success: true, messageObj: messageObj };
          } else {
            //unban
            let check = await this.subredditRepository.checkPunished(
              userExisted.doc._id,
              subredditName,
              "banned"
            );
            if (!check.success)
              return { success: false, error: userErrors.Not_BANED };

            let allPunishedUsers = await this.subredditRepository.getPunished(
              subredditName
            );
            let punishedUsers = allPunishedUsers.doc.punished;
            let afterDelete = this.removeId(
              punishedUsers,
              userExisted.doc._id,
              "banned"
            );
            console.log(afterDelete);
            let updateList = await this.subredditRepository.updatePunished(
              subredditName,
              afterDelete
            );
            if (!updateList.success)
              return { success: false, error: subredditErrors.MONGO_ERR };

            return { success: true };
          }
        }
      }
    }
  }

  /**
   * this function handles mod actions Mute and unmute of user in subreddit
   * @param {String} userId 
   * @param {String} subredditName 
   * @param {String} banedUser 
   * @param {String} action 
   * @param {Object} data 
   * @returns {Object} a response 
   */
  async muteUnmute(userId, subredditName, banedUser, action, data) {
    let subredditExisted = await this.retrieveSubreddit(
      userId,
      subredditName,
      true
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    else {
      let canDelete = await this.subredditRepository.isModerator_1(
        subredditName,
        userId
      );
      // console.log(canDelete);
      if (!canDelete.success)
        return { success: false, error: subredditErrors.NOT_MODERATOR };
      else {
        // he is moderator and subreddit is existed => 3]check username existed
        let userExisted = await this.userRepository.findByUserName(
          banedUser,
          "",
          ""
        );
        if (!userExisted.success)
          return { success: false, error: userErrors.USER_NOT_FOUND };
        else {
          //  4] check if he is mod to this subreddit
          let UserIsMod = await this.subredditRepository.isModerator_2(
            subredditName,
            userExisted.doc._id
          );
          //  console.log(UserIsMod);
          if (UserIsMod.success)
            return { success: false, error: userErrors.MODERATOR };

          if (action === "mute") {
            // mute user
            let check = await this.subredditRepository.checkPunished(
              userExisted.doc._id,
              subredditName,
              "muted"
            );
            if (check.success)
              return { success: false, error: userErrors.ALREADY_MUTED };

            let muted = await this.subredditRepository.muteUser(
              userExisted.doc,
              subredditName,
              data
            );
            if (!muted.success)
              return { success: false, error: subredditErrors.mongoErrors };
            let messageObj = {
              from: userId,
              to: userExisted.doc._id,
              subreddit: subredditExisted.data._id,
              type: "subredditMute",
            };
            return { success: true, messageObj: messageObj };
            //return { success: true ,mutedId: userExisted.doc._id, subredditId:subredditExisted.data._id};
          } else {
            //unmute
            let check = await this.subredditRepository.checkPunished(
              userExisted.doc._id,
              subredditName,
              "muted"
            );
            if (!check.success)
              return { success: false, error: userErrors.Not_MUTED };

            let allPunishedUsers = await this.subredditRepository.getPunished(
              subredditName
            );
            let punishedUsers = allPunishedUsers.doc.punished;
            let afterDelete = this.removeId(
              punishedUsers,
              userExisted.doc._id,
              "muted"
            );
            let updateList = await this.subredditRepository.updatePunished(
              subredditName,
              afterDelete
            );
            if (!updateList.success)
              return { success: false, error: subredditErrors.MONGO_ERR };
            // console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
            // console.log(userExisted);

            return { success: true };
          }
        }
      }
    }
  }

  /**
   * Utility function
   * @param {Array} list 
   * @param {Object} value 
   * @returns  {Array} modified array
   */
  filter(list, value) {
    return list.filter(function (ele) {
      return value === ele.type;
    });
  }

 
  /**
   * This function returns the banned users
   * @param {String} subredditName 
   * @param {String} userId 
   * @returns {Object} list of banned users
   */
  async banned(subredditName, userId) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let canDelete = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    // console.log(canDelete);
    if (!canDelete.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let banned = await this.subredditRepository.punishedUsers(subredditName);

    let banedUsers = this.filter(banned.doc.punished, "banned");

    for (const user of banedUsers) {
      user.user.profilePicture =
        `${process.env.BACKDOMAIN}/` + user.user.profilePicture;
    }

    return { success: true, data: banedUsers };
  }

 /**
  * this function returns the muted users in this subreddit
  * @param {String} subredditName 
  * @param {String} userId 
  * @returns {Object} muted users
  */
  async muted(subredditName, userId) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let canDelete = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    // console.log(canDelete);
    if (!canDelete.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let muted = await this.subredditRepository.punishedUsers(subredditName);

    let mutedUsers = this.filter(muted.doc.punished, "muted");

    for (const user of mutedUsers) {
      user.user.profilePicture =
        `${process.env.BACKDOMAIN}/` + user.user.profilePicture;
    }

    return { success: true, data: mutedUsers };
  }

  /**
   * this function returns an object containing all moderators in this subreddit 
   * @param {String} subredditName 
   * @returns {Object} a response containing all moderators
   */
  async mods(subredditName) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let mods = await this.subredditRepository.getModerators(subredditName);

    let moderators = mods.doc.moderators;

    for (const user of moderators) {
      user.user.profilePicture =
        `${process.env.BACKDOMAIN}/` + user.user.profilePicture;
    }
    return { success: true, data: moderators };
  }

  /**
   * leave moderation action
   * @param {String} userId 
   * @param {String} subredditName 
   * @returns {Object} a response
   */
  async leaveMod(userId, subredditName) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );

    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let allModerators = await this.subredditRepository.getModerators(
      subredditName
    );
    let mods = allModerators.doc.moderators;
    let afterDelete = this.removeId(mods, userId);
    let updateMods = await this.subredditRepository.updateModerators(
      subredditName,
      afterDelete
    );
    if (!updateMods.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    return { success: true };
  }

  /**
   * mark or unmark a subreddit as fivourite or un fivourite
   * @param {String} userId 
   * @param {String} subredditName 
   * @returns {Object} a response
   */
  async handleFavourite(userId, subredditName) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );

    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    // check favourite
    let check = await this.userRepository.checkFavourite(
      userId,
      subredditExisted.doc._id
    );
    if (!check.success) {
      // Mark favourite
      let added = await this.userRepository.addFavourite(
        userId,
        subredditExisted.doc._id
      );
      if (!added.success)
        return { success: false, error: subredditErrors.MONGO_ERR };
      else return { success: true };
    } else {
      // un-Mark favourite
      let removed = await this.userRepository.removefavourite(
        userId,
        subredditExisted.doc._id
      );
      if (!removed.success)
        return { success: false, error: subredditErrors.MONGO_ERR };
      else return { success: true };
    }
  }

  /**
   * this function is used to add rule to this subreddit
   * @param {String} subredditName 
   * @param {String} userId 
   * @param {String} title 
   * @param {Object} data 
   * @returns {Object} a response
   */
  async addRule(subredditName, userId, title, data) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let check = await this.subredditRepository.checkRule(title, subredditName);
    if (check.success)
      return { success: false, error: subredditErrors.RULE_TAKEN };

    let rule = await this.subredditRepository.addRule(
      subredditName,
      title,
      data
    );
    if (!rule.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    return { success: true };
  }

   /**
   * this function is used to esit rule to this subreddit
   * @param {String} subredditName 
   * @param {String} userId 
   * @param {String} title 
   * @param {Object} data 
   * @returns {Object} a response
   */
  async editRule(subredditName, userId, title, data) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let check = await this.subredditRepository.checkRule(title, subredditName);
    if (!check.success)
      return { success: false, error: subredditErrors.RULE_NOT_FOUND };

    // update rule here
    let rules = subredditExisted.doc.rules;

    for (const rule of rules) {
      if (title === rule.title) {
        rule.title = !data.title ? rule.title : data.title;
        rule.description = !data.description
          ? rule.description
          : data.description;
        rule.appliesTo = !data.appliesTo ? rule.appliesTo : data.appliesTo;
        rule.defaultName = !data.defaultName
          ? rule.defaultName
          : data.defaultName;
        break;
      }
    }

    let update = await this.subredditRepository.updateRules(
      subredditName,
      rules
    );
    if (!update.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    return { success: true };
  }
    /**
   * this function is used to delete rule to this subreddit
   * @param {String} subredditName 
   * @param {String} userId 
   * @param {String} title  
   * @returns {Object} a response
   */
  async deleteRule(subredditName, userId, title) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let check = await this.subredditRepository.checkRule(title, subredditName);
    if (!check.success)
      return { success: false, error: subredditErrors.RULE_NOT_FOUND };

    let rules = subredditExisted.doc.rules;

    /**
     * Utility function used to remove rule
     * @param {Array} list 
     * @param {Object} value 
     * @returns {Array} a modified array
     */
    function removeRule(list, value) {
      return list.filter(function (ele) {
        return !(value === ele.title);
      });
    }

    let afterDelete = removeRule(rules, title);

    let update = await this.subredditRepository.updateRules(
      subredditName,
      afterDelete
    );
    if (!update.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    return { success: true };
  }

  /**
   * this function returns posts based on their tybe in mod tools
   * @param {Object} query 
   * @param {String} subredditName 
   * @param {String} userId 
   * @param {String} location 
   * @returns {Object}
   */
  async categorizedPosts(query, subredditName, userId, location) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let posts = await this.postRepository.getPostsByModStats(
      subredditExisted.doc._id,
      query,
      location
    );
    if (!posts.success) {
      if (posts.error === mongoErrors.NOT_FOUND) return posts;
      else return { success: false, error: subredditErrors.MONGO_ERR };
    }

    return { success: true, data: posts.doc };
  }

  /**
   * this function returns subreddits based on their topic
   * @param {String} category 
   * @param {Object} query 
   * @param {String} userId 
   * @returns {Object}
   */
  async categorizedSubreddits(category, query, userId) {
    if (category !== "All") {
      let subs = await this.subredditRepository.categorySubreddits(
        query,
        category
      );
      if (!subs.success) {
        if (subs.error === mongoErrors.NOT_FOUND) return subs;
        else return { success: false, error: subredditErrors.MONGO_ERR };
      }

      let subreddits = [];
      for (const subreddit of subs.doc) {
        if (subreddit.users.find((el) => el._id.equals(userId))) {
          subreddit.isJoined = true;
        }

        subreddits.push({
          _id: subreddit._id,
          fixedName: subreddit.fixedName,
          isJoined: subreddit.isJoined,
          icon: subreddit.icon,
          backgroundImage: subreddit.backgroundImage,
          membersCount: subreddit.membersCount,
          description: subreddit.description,
        });
      }
      return { success: true, data: subreddits };
    } else {
      let data = await this.randomSubreddits(query, userId);
      return data;
    }
  }

  /**
   * this function return random subreddits from database
   * @param {Object} query 
   * @param {String} userId 
   * @returns {Object}
   */
  async randomSubreddits(query, userId) {
    let subs = await this.subredditRepository.randomSubreddits(query, userId);
    if (!subs.success) {
      if (subs.error === mongoErrors.NOT_FOUND) return subs;
      else return { success: false, error: subredditErrors.MONGO_ERR };
    }
    console.log(subs);
    let subreddits = [];
    for (const subreddit of subs.doc) {
      if (subreddit.users.find((el) => el._id.equals(userId))) {
        subreddit.isJoined = true;
      }

      subreddits.push({
        _id: subreddit._id,
        fixedName: subreddit.fixedName,
        isJoined: subreddit.isJoined,
        icon: subreddit.icon,
        backgroundImage: subreddit.backgroundImage,
        membersCount: subreddit.membersCount,
        description: subreddit.description,
      });
    }
    return { success: true, data: subreddits };
  }


  /**
   * this function mark user as approved or not
   * @param {String} userId 
   * @param {String} subredditName 
   * @param {String} approvedUser 
   * @param {String} action 
   * @returns {Object} 
   */
  async approveUser(userId, subredditName, approvedUser, action) {
    let canDelete = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!canDelete.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    // he is moderator and subreddit is existed => 3]check username existed
    let userExisted = await this.userRepository.findByUserName(
      approvedUser,
      "",
      ""
    );
    if (!userExisted.success)
      return { success: false, error: userErrors.USER_NOT_FOUND };
    //  4] check if he is mod to this subreddit
    let UserIsMod = await this.subredditRepository.isModerator_2(
      subredditName,
      userExisted.doc._id
    );

    if (UserIsMod.success)
      return { success: false, error: userErrors.MODERATOR };

    if (action === "approve") {
      //msh m7tag a check 34an already ana bgeb alnas mn al list of approved3
      // check of he is approved before
      let checkApproved = await this.subredditRepository.checkApproval(
        userExisted.doc._id,
        subredditName
      );
      let approvedusers = checkApproved.doc.approved;

      let approved = false;
      for (const user of approvedusers) {
        if (user.user.equals(userExisted.doc._id)) {
          approved = true;
          break;
        }
      }

      if (approved)
        return { success: false, error: userErrors.ALREADY_APPROVED };

      let approve = await this.subredditRepository.approveUser(
        userExisted.doc._id,
        subredditName
      );
      if (!approve.success)
        return { success: false, error: subredditErrors.MONGO_ERR };
      let messageObj = {
        from: userId,
        to: userExisted.doc._id,
        subreddit: canDelete.doc._id,
        type: "subredditApprove",
      };
      return { success: true, messageObj: messageObj };
      // return { success: true , approvedId: userExisted.doc._id, subredditId : canDelete.doc._id };
    } else {
      // action === disapprove

      let checkApproved = await this.subredditRepository.checkApproval(
        userExisted.doc._id,
        subredditName
      );
      let approvedusers = checkApproved.doc.approved;

      let exists = false;
      for (const user of approvedusers) {
        if (user.user.equals(userExisted.doc._id)) {
          exists = true;
          break;
        }
      }
      if (!exists) return { success: false, error: userErrors.NOT_APPROVED };

      let approved = await this.subredditRepository.approvedUsers(
        subredditName
      );
      if (!approved.success) console.log("this shouldn't be printed");

      let users = approved.doc.approved;

      function removeUser(list, value) {
        return list.filter(function (ele) {
          return !value.equals(ele.user._id);
        });
      }

      let afterDelete = removeUser(users, userExisted.doc._id);
      let removed = await this.subredditRepository.updateApproved(
        subredditName,
        afterDelete
      );
      if (!removed.success)
        return { success: false, error: subredditErrors.MONGO_ERR };

      return { success: true };
    }
  }


  /**
   *  return approved users
   * @param {String} subredditName 
   * @param {String} userId 
   * @returns {Object}
   */
  async approved(subredditName, userId) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let approved = await this.subredditRepository.approvedUsers(subredditName);
    if (!approved.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    let approvedUsers = approved.doc.approved;

    for (const user of approvedUsers) {
      user.user.profilePicture =
        `${process.env.BACKDOMAIN}/` + user.user.profilePicture;
    }

    return { success: true, data: approvedUsers };
  }

  /**
   * this function returns posts contains videos and images to be visualized as reels in mobile app
   * @param {String} topic 
   * @param {Object} query 
   * @returns {Object}
   */
  async reels(topic, query) {
    let posts = await this.postRepository.getPostsBySubredditTopic(
      topic,
      query
    );

    let beforeFilter = posts.doc;

    function filter(list, value) {
      return list.filter(function (ele) {
        return value === ele.owner.primaryTopic;
      });
    }
    let afterfilter = filter(beforeFilter, topic);

    if (!posts.success) {
      if (posts.error === mongoErrors.NOT_FOUND) return posts;
      else return { success: false, error: subredditErrors.MONGO_ERR };
    }

    if (topic === "All") return { success: true, data: beforeFilter };
    else return { success: true, data: afterfilter };
  }

  /**
   *  this function returns stats of the subreddit
   * @param {String} subredditName 
   * @param {String} userId 
   * @param {String} type 
   * @returns {Object}
   */
  async traffic(subredditName, userId,type) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    // get stats
    let stats = await this.subredditRepository.traffic(subredditName,type);
    if (!stats.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    console.log(stats);

    return { success: true, data: stats.doc }; //
  }


  /**
   *  this function returns users invited to be moderators in this subreddit
   * @param {String} subredditName 
   * @param {String} userId 
   * @returns {Object}
   */
  async invitations(subredditName, userId) {
    let subredditExisted = await this.subredditRepository.getsubreddit(
      subredditName,
      "",
      ""
    );
    if (!subredditExisted.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let iamMod = await this.subredditRepository.isModerator_1(
      subredditName,
      userId
    );
    if (!iamMod.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

    let approved = await this.subredditRepository.invitations(subredditName);
    if (!approved.success)
      return { success: false, error: subredditErrors.MONGO_ERR };

    let approvedUsers = approved.doc.invitations;

    for (const user of approvedUsers) {
      user.user.profilePicture =
        `${process.env.BACKDOMAIN}/` + user.user.profilePicture;
    }

    return { success: true, data: approvedUsers };
  }

  //! ===============================================================================================

  /**
   *
   * @param {String} subredditName the name of the subreddit to create flair into
   * @param {Object} data  the data of the flair to be created
   * @param {string} userId
   * @returns {Object} returns created flair or an error object
   */
  async createFlair(subredditName, data, userId) {
    //check if existing subreddit to create flair in

    let subreddit = await this.checkSubreddit(subredditName);
    //console.log("oooooooooooooooooooooooooooooooo");
    // console.log(subreddit);
    if (!subreddit.success) {
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }
    // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmm");
    //check if user is moderator of subreddit to create flair in
    let isModerator = this.checkModerator(subreddit, userId);

    if (!isModerator.success) {
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    }

    //check if user is moderator of subreddit to create flair in

    //create the flair
    let flair = await this.flairRepository.createOne(data);

    if (!flair.success) {
      //  console.log(flair);
      return { success: false, error: subredditErrors.MONGO_ERR };
    }

    // console.log(flair);
    //add flair to list of refrences flairs in the subreddit
    let addedTorefrencedFlairs =
      await this.subredditRepository.addFlairToSubreddit(
        subredditName,
        flair.doc._id
      );

    if (!addedTorefrencedFlairs.success) {
      return { success: false, error: subredditErrors.MONGO_ERR };
    }

    // console.log(flair);
    return { success: true, data: flair.doc };
  }

  /**
   *
   * @param {String} subredditName the name of the subreddit to check if it exists
   * @returns {Object} returns the found subreddit object id found and an error object if not
   */
  async checkSubreddit(subredditName) {
    console.log("in chek subreddit");

    //let subreddit = await this.subredditRepository.findByName(subredditName);

    let subreddit = await this.subredditRepository.getSubreddit(subredditName);
    //console.log(subreddit);
    if (!subreddit.success) {
      console.log("nnnnnnjnjnkjnkjnkjnkjddddddddddddddddddddd");
      return { sucess: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }

    return subreddit;
  }

  /**
   *
   * @param {Object} subreddit the subreddit object to check the flait within
   * @param {string} flairId the flair id to check if it exists
   * @returns {Object} the subreddit object if the flair exists and an error obj if not
   */
  checkFlair(subreddit, flairId) {
    if (!subreddit.doc.flairIds.includes(flairId)) {
      return { success: false, error: subredditErrors.FLAIR_NOT_FOUND };
    }
    return { success: true, data: subreddit.doc };
  }

  // /**
  //  *
  //  * @param {Object} subreddit subreddit object
  //  * @param {string} userID id of the moderaror to check whether it exists in the subreddit
  //  * @returns {Object} subreddit object if the moderator exists within it and an error obj if not
  //  */
  checkModerator(subreddit, userID) {
    if (!subreddit.doc.moderators.find((el) => el.user.equals(userID))) {
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    }

    return subreddit;
  }

  /**
   *
   * @param {String} subredditName name of the subreddit to update the flair in it
   * @param {string} flairId id of the flait to update
   * @param {Object} data the new updated data of the flait to apply
   * @param {string} userId id of the user who request the update
   * @returns {Object} returns the updated flair if success and an error object if not
   */
  async updateFlair(subredditName, flairId, data, userId) {
    let subreddit = await this.checkSubreddit(subredditName);
    if (!subreddit.success) {
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }
    let isModerator = this.checkModerator(subreddit, userId);
    if (!isModerator.success) {
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    }

    let checkFlair = this.checkFlair(subreddit, flairId);

    if (!checkFlair.success) {
      return { success: false, error: subredditErrors.FLAIR_NOT_FOUND };
    }
    let flair = await this.flairRepository.updateFlair(flairId, data);
    if (!flair.success) {
      return { success: false, error: subredditErrors.MONGO_ERR };
    }
    return { success: true, data: flair.doc };
  }

  /**
   *
   * @param {String} subredditName name of the subreddit to delete the flair whithin
   * @param {string} flairId id of the flair to be deleted
   * @param {string} userId id of the user who request the delete
   * @returns {Object} subreddit object where the flair is deleted if success and error object if failure
   */
  async deleteFlair(subredditName, flairId, userId) {
    let subreddit = await this.checkSubreddit(subredditName);
    if (!subreddit.success) {
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }

    let isModerator = this.checkModerator(subreddit, userId);
    if (!isModerator.success) {
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    }

    let checkFlair = this.checkFlair(subreddit, flairId);

    if (!checkFlair.success) {
      return { success: false, error: subredditErrors.FLAIR_NOT_FOUND };
    }

    let editedSubreddit =
      await this.subredditRepository.removeFlairFromSubreddit(
        subredditName,
        flairId
      );
    if (!editedSubreddit.success) {
      return { success: false, error: subredditErrors.MONGO_ERR };
    }
    return { success: true, data: editedSubreddit };
  }

  /**
   *
   * @param {String} subredditName the name of the subreddit to get the flair from
   * @param {string} flairId id of the flair to get
   * @returns {Object} flair object if found and an error object if not
   */
  async getFlair(subredditName, flairId) {
    let subreddit = await this.subredditRepository.getSubredditFlairs(
      subredditName
    );
    if (!subreddit.success) {
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }

    let flairIndex = subreddit.doc.find((el) => el._id.equals(flairId));
    if (!flairIndex) {
      return { success: false, error: subredditErrors.FLAIR_NOT_FOUND };
    }

    return { success: true, data: flairIndex };
  }

  /**
   *
   * @param {String} subredditName name of the subreddit to get its flairs
   * @returns {Object} object containing all flairs if subreddit exists and an error object if not
   */
  async getFlairs(subredditName) {
    let flairs = await this.subredditRepository.getSubredditFlairs(
      subredditName
    );

    if (!flairs.success) {
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    }
    console.log("ffffffffffffffffff");
    // console.log(flairs);
    //console.log(flairs);
    return { success: true, data: flairs.doc };
  }

  /**
   * Checks if a user is banned from a given a subreddit
   * @param {string} subredditId
   * @param {string} userId
   * @returns {boolean}
   */
  async subscriable(subredditName, userId) {
    const subreddit = await this.subredditRepository.findByName(
      subredditName,
      "punished _id"
    );
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    const punished = subreddit.doc.punished;

    let isBanned = false;
    for (const { userId: bannedUser, type } of punished) {
      if (type === "banned" && userId.equals(bannedUser)) {
        isBanned = true;
        break;
      }
    }
    if (isBanned) return { success: false, error: subredditErrors.BANNED };

    return { success: true, _id: subreddit.doc._id };
  }

  /**
   * update membersCount of this subreddit
   * @param {String} id 
   * @param {String} action 
   */
  async updateUserCount(id, action) {
    if (action == "sub") await this.subredditRepository.addUser(id);
    else await this.subredditRepository.removeUser(id);
  }
  /**
   * udates the image of the subreddit [icon,BG,theme]
   * @param {String} subredditName 
   * @param {String} type 
   * @param {String} filename 
   * @returns {Object}
   */
  async addUserImageURL(subredditName, type, filename) {
    let subreddit = await this.subredditRepository.updateSubredditImage(
      subredditName,
      type,
      filename
    );
    return {
      icon: subreddit.doc.icon,
      backgroundImage: subreddit.doc.backgroundImage,
      theme: subreddit.doc.theme,
    };
  }
}

module.exports = subredditService;
