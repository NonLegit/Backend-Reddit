const { subredditErrors, mongoErrors } = require("../error_handling/errors");

/**
 * this class is used for implementing Subreddit Service functions
 * @param {Repository} subredditRepository - subreddit repository object to access repository functions using subreddit model
 * @param {Repository} flairRepository - flair repository object to access repository functions using flair model
 * @param {Repository} userRepository - user repository object to access repository functions using user model
 */
class subredditService {
  constructor({ SubredditRepository, FlairRepository, UserRepository }) {
    this.flairRepository = FlairRepository; // can be mocked in unit testing
    this.userRepository = UserRepository;
    this.subredditRepository = SubredditRepository; // can be mocked in unit testing
  }
  /**
   * create subreddit service function
   * @param {object} data - the data coming from request body
   * @param {object} userName - username of currently logged user
   * @param {object} profilePicture - profile picture of currently logged user
   * @returns {Object} - a response containing the created subreddit.
   *
   */
  async createSubreddit(data, userName, profilePicture) {
    // ..
    let subredditExisted = await this.retrieveSubreddit(
      data.owner,
      data.fixedName
    );
    if (!subredditExisted.success) {
      let subreddit = await this.subredditRepository.create(
        data,
        userName,
        profilePicture
      );
      if (subreddit.success) return { success: true, data: subreddit.doc };
      else
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
    let subreddit = await this.retrieveSubreddit(userId, subredditName);
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let owner = await this.subredditRepository.isOwner(subredditName, userId);
    if (!owner.success)
      return { success: false, error: subredditErrors.NOT_MODERATOR };

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
    let subreddit = await this.retrieveSubreddit(userId, subredditName);
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };

    let moderator = await this.subredditRepository.isModerator(
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
   * @param {object} name - a query to select a certain subreddit from database
   * @returns {Object} - a response containing the retrieved subreddit
   */
  async retrieveSubreddit(userId, name) {
    let subreddit = await this.subredditRepository.getsubreddit(name, "", "");
    if (subreddit.success) {
      let joined = this.userRepository.isSubscribed(userId, subreddit.doc._id);
      subreddit.doc.isJoined = await joined;
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
    try {
      // ! check subreddit existed or not
      let subredditExisted = await this.getSubreddit({ name: subredditName });
      if (subredditExisted.status === "fail") {
        const response = {
          status: "fail",
          statusCode: 404,
          message: "subreddit doesn't exist",
        };
        return response;
      } else {
        //! 2]check user is moderator
        let canInvite = await this.isModerator(subredditName, userId);
        if (!canInvite) {
          const response = {
            status: "fail",
            statusCode: 401,
            message: "you are not moderator to this subreddit",
          };
          return response;
        } else {
          //! he is moderator and subreddit is existed => 3]check username existed
          let userExisted = await this.userRepository.getOne(
            {
              userName: modName,
            },
            "",
            ""
          );
          if (userExisted.status === "fail") {
            const response = {
              status: "fail",
              statusCode: 404,
              message: "this username doesn't exist",
            };
            return response;
          } else {
            // ! 4] check if he is not mod to this subreddit
            let UserIsMod = await this.isModerator(
              subredditName,
              userExisted.doc._id
            );
            if (!UserIsMod) {
              // ! make him mod then
              let updateModerators = await this.updateSubreddit(
                { name: subredditName },
                {
                  $push: {
                    moderators: {
                      username: userExisted.doc._id,
                      mod_time: Date.now(),
                      permissions: {
                        all: data.permissions.all,
                        access: data.permissions.access,
                        config: data.permissions.config,
                        flair: data.permissions.flair,
                        posts: data.permissions.posts,
                      },
                    },
                  },
                }
              );
              if (updateModerators.status === "fail") {
                const response = {
                  status: "fail",
                  statusCode: 400,
                  message: "failed to update",
                };
                return response;
              } else {
                // * hurraaay
                const response = {
                  status: "success",
                  statusCode: 204,
                  message: "Added to moderators",
                };
                return response;
              }
            } else {
              const response = {
                status: "fail",
                statusCode: 400,
                message: "That user is already moderator",
              };
              return response;
            }
          }
        }
      }
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  /**
   * this function removes user from being moderator in a certain subreddit
   * @param {string} subredditName - name of subreddit i want to remove moderator from
   * @param {string} userId - iD of the user making the request
   * @param {string} modName - moderator name i want to remove from moderation
   * @returns a response.
   */
  async deleteMod(subredditName, userId, modName) {
    // ..
    try {
      // TODO: fix update error
      //! check subreddit existed or not
      let subredditExisted = await this.getSubreddit({ name: subredditName });
      if (subredditExisted.status === "fail") {
        const response = {
          status: "fail",
          statusCode: 404,
          message: "subreddit doesn't exist",
        };
        return response;
      } else {
        //! 2]check user is moderator
        let canDelete = await this.subredditRepository.getOne(
          { name: subredditName, "moderators.username": userId },
          { "moderators.mod_time.$": 1 },
          ""
        );
        if (canDelete.status === "fail") {
          const response = {
            status: "fail",
            statusCode: 401,
            message: "you are not moderator to this subreddit",
          };
          return response;
        } else {
          //! he is moderator and subreddit is existed => 3]check username existed
          let userExisted = await this.userRepository.getOne(
            {
              userName: modName,
            },
            "",
            ""
          );
          console.log(userExisted.doc);
          if (userExisted.status === "fail") {
            const response = {
              status: "fail",
              statusCode: 404,
              message: "this username doesn't exist",
            };
            return response;
          } else {
            // ! 4] check if he is mod to this subreddit
            let UserIsMod = await this.subredditRepository.getOne(
              {
                name: subredditName,
                "moderators.username": userExisted.doc._id,
              },
              { "moderators.mod_time.$": 1 },
              ""
            );
            if (UserIsMod.status === "fail") {
              const response = {
                status: "fail",
                statusCode: 404,
                message: "this username is not moderator",
              };
              return response;
            } else {
              // ! check if iam mod before him or not
              if (
                parseInt(canDelete.doc.moderators[0]["mod_time"]) <=
                parseInt(UserIsMod.doc.moderators[0]["mod_time"])
              ) {
                // ! remove him
                console.log(userExisted.doc._id);
                let removeHim = await this.subredditRepository.updateOneByQuery(
                  {
                    name: subredditName,
                    "moderators.username": userExisted.doc._id,
                  },
                  { $pull: { "moderators.username": userExisted.doc._id } }
                );
                console.log(removeHim);
                if (removeHim.status === "fail") {
                  const response = {
                    status: "fail",
                    statusCode: 404,
                    message: "something went wrong",
                  };
                  return response;
                } else {
                  const response = {
                    status: "success",
                    statusCode: 204,
                    message: "",
                  };
                  return response;
                }
              } else {
                const response = {
                  status: "fail",
                  statusCode: 401,
                  message: "cannot remove moderator elder than you",
                };
                return response;
              }
            }
          }
        }
      }
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }

  /**
   * This function returns posts in subreddit by their category to be viewed in mod tools
   * @param {string} subredditName - name od subreddit
   * @param {string} userId - iD of user making the request
   * @param {string} category - category i want to retrieve
   * @returns {Object} - a response contains categorized posts.
   */
  async getCategoryPosts(subredditName, userId, category) {
    try {
      // ! check if user is mod first
      let canGet = await this.isModerator(subredditName, userId);
      if (!canGet) {
        canGet.statusCode = 401;
        res.status(canGet.statusCode).json({
          status: canGet.statusCode,
          message: "you are not moderator to this subreddit",
        });
      } else {
        // ! get posts relevant to this category
        let response = await this.subredditRepository.getOne(
          {
            name: subredditName,
            "posts.category": category,
          },
          "posts",
          ""
        );
        return response;
      }
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
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
      let subreddits = await this.subredditRepository.getSubreddits(userId,"id");
      if (!subreddits.success) return subreddits;
      else return { success: true, data: subreddits.doc };
    } else if (location === "subscriber") {
      // ! get it from user (easy too)
      let subreddits = await this.userRepository.getSubreddits(userId);
      if (!subreddits.success) return subreddits;
      else return { success: true, data: subreddits.doc[0].subscribed };
    } else return { success: false, error: subredditErrors.INVALID_ENUM };
  }
  async subredditsModeratedBy(userName){
    let subreddits = await this.subredditRepository.getSubreddits(userName,"name");
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
    try {
      //! check subreddit existed or not
      let subredditExisted = await this.getSubreddit({ name: subredditName });
      if (subredditExisted.status === "fail") {
        const response = {
          status: "fail",
          statusCode: 404,
          message: "subreddit doesn't exist",
        };
        return response;
      } else {
        //! 2]check user is moderator
        let canDelete = await this.subredditRepository.getOne(
          { name: subredditName, "moderators.username": userId },
          { "moderators.mod_time.$": 1 },
          ""
        );
        if (canDelete.status === "fail") {
          const response = {
            status: "fail",
            statusCode: 401,
            message: "you are not moderator to this subreddit",
          };
          return response;
        } else {
          //! he is moderator and subreddit is existed => 3]check username existed
          let userExisted = await this.userRepository.getOne(
            {
              userName: modName,
            },
            "",
            ""
          );
          if (userExisted.status === "fail") {
            const response = {
              status: "fail",
              statusCode: 404,
              message: "this username doesn't exist",
            };
            return response;
          } else {
            // ! 4] check if he is mod to this subreddit
            let UserIsMod = await this.subredditRepository.getOne(
              {
                name: subredditName,
                "moderators.username": userExisted.doc._id,
              },
              { "moderators.mod_time.$": 1 },
              ""
            );
            if (UserIsMod.status === "fail") {
              const response = {
                status: "fail",
                statusCode: 404,
                message: "this username is not moderator",
              };
              return response;
            } else {
              // ! check if iam mod before him or not
              if (
                parseInt(canDelete.doc.moderators[0]["mod_time"]) <=
                parseInt(UserIsMod.doc.moderators[0]["mod_time"])
              ) {
                // ! update him
                console.log("success");
                let updateHim = await this.subredditRepository.updateOneByQuery(
                  {
                    name: subredditName,
                    "moderators.username": userExisted.doc._id,
                  },
                  {
                    $set: {
                      "moderators.$.permissions": {
                        all: data.permissions.all,
                        access: data.permissions.access,
                        config: data.permissions.config,
                        flair: data.permissions.flair,
                        posts: data.permissions.posts,
                      },
                    },
                  }
                );
                console.log(updateHim);
                if (updateHim.status === "fail") {
                  const response = {
                    status: "fail",
                    statusCode: 404,
                    message: "something went wrong",
                  };
                  return response;
                } else {
                  let updatedMod = await this.subredditRepository.getOne(
                    {
                      name: subredditName,
                      "moderators.username": userExisted.doc._id,
                    },
                    { "moderators.$": 1 },
                    ""
                  );
                  return updatedMod;
                }
              } else {
                const response = {
                  status: "fail",
                  statusCode: 401,
                  message: "cannot update moderator elder than you",
                };
                return response;
              }
            }
          }
        }
      }
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }

  //! Doaa's part














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
    console.log("oooooooooooooooooooooooooooooooo");
    console.log(subreddit);
      if (!subreddit.success) {
        return {success:false , error: subredditErrors.SUBREDDIT_NOT_FOUND};
    }
     console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmm");
     //check if user is moderator of subreddit to create flair in
      let isModerator = this.checkModerator(subreddit, userId);
      
      if (!isModerator.success) {
        return {success:false , error: subredditErrors.NOT_MODERATOR};
      }

    //create the flair
      let flair = await this.flairRepository.createOne(data);

      if (!flair.success) {
        return {success:false , error: subredditErrors.MONGO_ERR};
      }

    console.log("hellllllllllllllllllllll");
    console.log(flair);
    //add flair to list of refrences flairs in the subreddit
      let addedTorefrencedFlairs =
        await this.subredditRepository.addFlairToSubreddit(
          subredditName,
          flair.doc._id
        );

      if (!addedTorefrencedFlairs.success) {
        return {success:false , error: subredditErrors.MONGO_ERR};
      }

    console.log(flair);
      return {success:true , data: flair};
    
    
  }

  /**
   *
   * @param {String} subredditName the name of the subreddit to check if it exists
   * @returns {Object} returns the found subreddit object id found and an error object if not
   */
  async checkSubreddit(subredditName) {
    console.log("in chek subreddit");
   
      let subreddit = await this.subredditRepository.findByName(
        subredditName,
      );
     
     
      if (!subreddit.success) {
       
        return {sucess:false, error:subredditErrors.SUBREDDIT_NOT_FOUND};
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

      return {success:false, error:subredditErrors.FLAIR_NOT_FOUND  };
    }
    return {success:true, data:subreddit};
  }

  /**
   *
   * @param {Object} subreddit subreddit object
   * @param {string} userID id of the moderaror to check whether it exists in the subreddit
   * @returns {Object} subreddit object if the moderator exists within it and an error obj if not
   */
  checkModerator(subreddit, userID) {
   

    if (!subreddit.doc.owner.equals(userID)) {
      return {success:false, error:subredditErrors.NOT_MODERATOR};
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
        return {success:false, error: subredditErrors.SUBREDDIT_NOT_FOUND};
      }
      let isModerator = this.checkModerator(subreddit, userId);
      if (!isModerator.success) {
        return {success:false, error: subredditErrors.NOT_MODERATOR};
      }

      let checkFlair = this.checkFlair(subreddit, flairId);

      if (!checkFlair.success) {
        return {success:false, error: subredditErrors.FLAIR_NOT_FOUND};
      }
      let flair = await this.flairRepository.updateFlair(
         flairId ,
        data
      );
      if (!flair.success) {
        return {success:false, error: subredditErrors.MONGO_ERR};
      }
     return {success:true, data:flair};
   
    
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
         return {success:false, error: subredditErrors.SUBREDDIT_NOT_FOUND};
      }
      
      let isModerator = this.checkModerator(subreddit, userId);
      if (!isModerator.success) {
         return {success:false, error: subredditErrors.NOT_MODERATOR};
      }

      let checkFlair = this.checkFlair(subreddit, flairId);
      
      if (!checkFlair.success) {
         return {success:false, error: subredditErrors.FLAIR_NOT_FOUND};
      }
     
      let editedSubreddit = await this.subredditRepository.removeFlairFromSubreddit(
        subredditName,
        flairId
      );
      if (!editedSubreddit.success) {
       
        return {success:false, error: subredditErrors.MONGO_ERR};
      }
      return {success:true, data:editedSubreddit};
    
  }

  /**
   *
   * @param {String} subredditName the name of the subreddit to get the flair from
   * @param {string} flairId id of the flair to get
   * @returns {Object} flair object if found and an error object if not
   */
  async getFlair(subredditName, flairId) {
    
      let subreddit = await this.checkSubreddit(subredditName);
      if (!subreddit.success) {
        return {success:false, error: subredditErrors.SUBREDDIT_NOT_FOUND};
      }
      let checkFlair = this.checkFlair(subreddit, flairId);
      if (!checkFlair.success) {
        return {success:false, error: subredditErrors.FLAIR_NOT_FOUND};
      }

      let response = await this.flairRepository.findById(flairId);
       if (!response.success) {
       
        return {success:false, error: subredditErrors.MONGO_ERR};
      }
      return {success:true, data:response};
   
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
      return {success:false, data:subredditErrors.SUBREDDIT_NOT_FOUND};
    }
      return {success:true, data:flairs};
    
  }

  /**
   * Checks if a user is banned from a given a subreddit
   * @param {string} subredditId
   * @param {string} userId
   * @returns {boolean}
   */
  async subscriable(subredditName, userId) {
    console.log("kiroo service");
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

  async updateUserCount(id, action){
    if(action == "sub")
      await this.subredditRepository.addUser(id);
    else
      await this.subredditRepository.removeUser(id);
  }
}

module.exports = subredditService;
