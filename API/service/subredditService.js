//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
const mongoose = require("mongoose");

class subredditService {
  constructor(
    subreddit,
    subredditRepository,
    flair,
    flairRepository,
    user,
    userRepository
  ) {
    this.subreddit = subreddit; // can be mocked in unit testing
    this.subredditRepository = subredditRepository; // can be mocked in unit testing
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.updateSubreddit = this.updateSubreddit.bind(this);
    this.getCategoryPosts = this.getCategoryPosts.bind(this);
    this.inviteMod = this.inviteMod.bind(this);
    this.deleteMod = this.deleteMod.bind(this);
    // !=======================================
    this.checkFlair = this.checkFlair.bind(this);
    this.flair = flair; // can be mocked in unit testing
    this.flairRepository = flairRepository; // can be mocked in unit testing
    this.createFlair = this.createFlair.bind(this);
    this.deleteFlair = this.deleteFlair.bind(this);
    this.getFlair = this.getFlair.bind(this);
    this.updateFlair = this.updateFlair.bind(this);
    this.getFlairs = this.getFlairs.bind(this);
    // !========================================
    this.user = user;
    this.userRepository = userRepository;
  }
  async createSubreddit(data) {
    try {
      let subreddit = await this.subredditRepository.createOne(data);
      return subreddit;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  async deleteSubreddit(filter, options) {
    try {
      let response = await this.subredditRepository.deleteOneByQuery(
        filter,
        options
      );
      return response;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }

  async updateSubreddit(filter, data) {
    try {
      let response = await this.subredditRepository.updateOneByQuery(
        filter,
        data
      );
      return response;
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

  async getSubreddit(query) {
    try {
      let response = await this.subredditRepository.getOne(query, "", "");
      return response;
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

  async isModerator(subredditName, userID) {
    try {
      let ismoderator = await this.getSubreddit(
        {
          name: subredditName,
          "moderators.username": userID,
        },
        "",
        ""
      );
      return ismoderator;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 401,
        err,
      };
      return error;
    }
  }

  async inviteMod(subredditName, userId, modName, data) {
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
        let canInvite = await this.isModerator(subredditName, userId);
        if (canInvite.status === "fail") {
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
            if (UserIsMod.status === "fail") {
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

  async deleteMod(subredditName, userId, modName) {
    try {
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii 🚀");
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
                // ! remove him
                console.log("success");
                let removeHim =
                  await this.subredditRepository.deleteOneByQuery(
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

  async getCategoryPosts(query, select) {
    try {
      let response = await this.subredditRepository.getOne(query, select, "");
      return response;
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

  async subredditsIamIn(userId, location) {
    try {
      console.log("🚀🚀🚀🚀");
      if (location === "moderator") {
        //! get list of subreddits iam moderator in (easy)
        let subreddits = await this.subredditRepository.getlist(
          { "moderators.username": userId },
          "_id name backgroundImage usersCount description",
          ""
        );
        console.log(subreddits);
        if (subreddits.status === "fail") {
          const error = {
            status: "fail",
            statusCode: 404,
          };
          return error;
        } else {
          return subreddits;
        }
      } else if (location === "subscriber") {
        // ! get it from user
        let subreddits = await this.subredditRepository.getlist(
          { "subreddits.username": userId },
          "_id name backgroundImage usersCount description",
          "subreddits"
        );
        console.log(subreddits);
        if (subreddits.status === "fail") {
          const error = {
            status: "fail",
            statusCode: 404,
          };
          return error;
        } else {
          return subreddits;
        }
      } else {
        const error = {
          status: "fail",
          statusCode: 400,
          err: "invalid enum value",
        };
        return error;
      }
    } catch (error) {}
  }

  //! Doaa's part

  async createFlair(subredditName, data) {
    try {
      let flair = await this.flairRepository.createOne(data);

      //  console.log(flair);
      if (flair.status !== "success") {
        const error = {
          status: "fail",
          statusCode: 400,
          errorMessage: flair.err,
        };
        return error;
      }
      // eslint-disable-next-line max-len, quotes
      let addedTorefrencedFlairs =
        await this.subredditRepository.addToRefrenced(
          { name: subredditName },
          { $push: { flairs: flair.doc._id } }
        );
      if (addedTorefrencedFlairs.status !== "success") {
        const error = {
          status: "fail",
          statusCode: 400,
          errorMessage: addedTorefrencedFlairs.err,
        };
        return error;
      }

      return flair;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }
  async checkFlair(subredditName, flairId) {
    try {
      let subreddit = await this.subredditRepository.getOne(
        { name: subredditName },
        "flairs"
      );
      if (subreddit.status !== "success") {
        const error = {
          status: "Not Found",
          statusCode: 404,
          errorMessage: subreddit.err,
        };
        return error;
      }

      if (!subreddit.data.flairs.includes(flairId)) {
        const error = {
          status: "Not Found",
          statusCode: 404,
          errorMessage: "Flair not in subreddit",
        };
        return error;
      }
      return subreddit;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }
  async updateFlair(subredditName, flairId, data) {
    try {
      let checkFlair = await this.checkFlair(subredditName, flairId);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }
      let response = await this.flairRepository.updateOne(flairId, data);
      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      // console.log(err);
      return error;
    }
  }

  async deleteFlair(subredditName, flairId) {
    try {
      // eslint-disable-next-line max-len, quotes
      let checkFlair = await this.checkFlair(subredditName, flairId);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }
      let response = await this.subredditRepository.removeFromRefrenced(
        { name: subredditName },
        { $pull: { flairs: flairId } }
      );
      if (response.status !== "success") {
        const error = {
          status: "fail",
          statusCode: 400,
          errorMessage: response.err,
        };
        return error;
      }
      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }

  async getFlair(subredditName, flairId) {
    try {
      let checkFlair = await this.checkFlair(subredditName, flairId);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }

      let response = await this.flairRepository.getOneById(flairId);
      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }

  async getFlairs(subredditName) {
    try {
      // console.log('in service');
      // eslint-disable-next-line max-len, quotes
      let response = await this.subredditRepository.getRefrenced(
        { name: subredditName },
        "flairs"
      );

      //  console.log(response);

      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        errorMessage: err,
      };
      return error;
    }
  }
}

module.exports = subredditService;
