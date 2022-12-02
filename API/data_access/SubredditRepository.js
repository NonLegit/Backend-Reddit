const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class SubredditRepository extends Repository {
  constructor({ subreddit }) {
    super(subreddit);
  }
  async create(data, userName, profilePicture) {
    try {
      const doc = await this.model.create(data);
      const tempdoc = await this.model.findOneAndUpdate(
        { fixedName: data.fixedName },
        {
          $push: {
            moderators: {
              id: doc.owner,
              userName: userName,
              joiningDate: Date.now(),
              profilePicture: profilePicture,
              moderatorPermissions: {
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

      return { success: true, doc: tempdoc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async getsubreddit(name, select, popOptions) {
    try {
      let tempDoc = this.model
        .findOne({ fixedName: name })
        .select(select + "-__v -punished");
      if (popOptions) tempDoc = tempDoc.populate(popOptions);
      const doc = await tempDoc;

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  /**
   * this function checks if user is moderator or not by passing @subredditName and @iD
   * @param {string} subredditName - name of subreddit i want to check from
   * @param {string} userID - iD if the user i want to check
   * @returns {boolean} - a boolean true or false,
   */
  async isModerator(subredditName, userID) {
    //..
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
          "moderators.id": userID,
        })
        .select({ "moderators.$": 1 });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  /**
   * this function checks if user is owner or not by passing @subredditName and @iD
   * @param {string} subredditName - name of subreddit i want to check from
   * @param {string} userID - iD if the user i want to check
   * @returns {boolean} - a boolean true or false,
   */
  async isOwner(subredditName, userID) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
          owner: userID,
        })
        .select("");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async update(subredditName, data) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        data,
        {
          new: true,
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async delete(subredditName) {
    try {
      const doc = await this.model.findOneAndDelete(
        { fixedName: subredditName },
        ""
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { sucess: false, ...decorateError(err) };
    }
  }

  async getSubreddits(userId, type) {
    try {
      let tempDoc =
        type === "id"
          ? this.model
              .find({ "moderators.id": userId })
              .select("_id name icon usersCount description")
          : this.model
              .find({ "moderators.userName": userId })
              .select("_id name icon usersCount description");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async getSubredditFlairs(subredditName) {
    try {
      console.log("inside subreddit flairs");
      const doc = await this.model
        .findOne({ name: subredditName })
        .populate("flairIds")
        .select({ populated: 1, _id: 0, createdAt: 1 });

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async addFlairToSubreddit(subredditName, flairId) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { name: subredditName },
        { $push: { flairIds: flairId } }
      );
      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async removeFlairFromSubreddit(subredditName, flairId) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { name: subredditName },
        { $pull: { flairIds: flairId } }
      );
      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async addUser(id) {
    await this.model.findByIdAndUpdate(id, {
      $inc: { usersCount: 1 },
    });
  }

  async removeUser(id) {
    await this.model.findByIdAndUpdate(id, {
      $inc: { usersCount: -1 },
    });
  }
}

module.exports = SubredditRepository;
