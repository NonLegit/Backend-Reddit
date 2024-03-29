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
              user: doc.owner,
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
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  //     async getSubredditWithFlairs(name, select) {
  //     try {

  //       const doc = await this.getSubreddit(name,select,"flairIds");
  //       console.log("hhhhhhhhhhhhhhh");
  //       console.log(doc);
  // console.log("hhhhhhhhhhhhhhh");
  //       if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

  //       return { success: true, doc: doc.doc };
  //     } catch (err) {
  //       return { success: false, ...decorateError(err) };
  //     }
  //   }
  async getsubreddit(name, select, popOptions) {
    try {
      let tempDoc = this.model
        .findOne({ fixedName: name })
        .select(select + "-__v -punished -approved")
        .populate("moderators.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async getSubreddit(name) {
    try {
      let doc = await this.model.findOne({ fixedName: name });

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  /**
   * this function checks if user is moderator or not by passing @subredditName and @iD
   * @param {string} subredditName - name of subreddit i want to check from
   * @param {string} userID - iD if the user i want to check
   * @returns {boolean} - a boolean true or false,
   */
  async isModerator_1(subredditName, userID) {
    //..
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
          "moderators.user": userID,
        })
        .select({ "moderators.$": 1 })
        .populate("moderators.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  //! [Note]
  // this function is twin to the above function i did that because i use the
  // it two times with different result so it can only be mocked in
  // unit testing by doing this
  async isModerator_2(subredditName, userID) {
    //..
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
          "moderators.user": userID,
        })
        .select({ "moderators.$": 1 })
        .populate("moderators.user", "_id userName joinDate profilePicture");

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
              .find({ "moderators.user": userId })
              .select(
                "_id fixedName icon membersCount description users isJoined"
              )
              .sort("-membersCount")
          : this.model
              .find({ "moderators.userName": userId })
              .select(
                "_id fixedName icon membersCount description users isJoined"
              )
              .sort("-membersCount");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async addModerator(userId, userName, PP, subredditName, permissions) {
    try {
      let doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            moderators: {
              user: userId,
              moderatorPermissions: {
                all: permissions.all,
                access: permissions.access,
                config: permissions.config,
                flair: permissions.flair,
                posts: permissions.posts,
              },
            },
          },
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async addRule(subredditName, title, data) {
    try {
      let doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            rules: {
              createdAt: new Date(Date.now()),
              defaultName: data.defaultName,
              description: data.description,
              appliesTo: data.appliesTo,
              title: title,
            },
          },
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async banUser(user, subredditName, data) {
    try {
      let doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            punished: {
              user: user._id,
              type: "banned",
              banInfo: {
                punishReason: data.punishReason,
                punish_type: data.punish_type,
                Note: data.Note,
                duration: data.duration,
              },
            },
          },
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async muteUser(user, subredditName, data) {
    try {
      let doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            punished: {
              user: user._id,
              type: "muted",
              muteInfo: {
                muteMessage: data.muteMessage,
              },
            },
          },
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async approveUser(userId, subredditName) {
    try {
      let doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            approved: {
              user: userId,
              approvedDate: new Date(Date.now()),
            },
          },
        }
      );

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async getSubredditFlairs(subredditName) {
    try {
      console.log("inside subreddit flairs");
      const doc = await this.model
        .findOne({ fixedName: subredditName })
        .populate("flairIds")
        .select({ populated: 1, _id: 0, createdAt: 1 });

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc.flairIds };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async updateModerators(subredditName, moderators) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { moderators: moderators },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async updatePunished(subredditName, punished) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { punished: punished },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async updateApproved(subredditName, approved) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { approved: approved },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async updateRules(subredditName, rules) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { rules: rules },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async getModerators(subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
        })
        .select("moderators")
        .populate("moderators.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;
      console.log(doc);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async punishedUsers(subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
        })
        .select("punished")
        .populate("punished.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async approvedUsers(subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
        })
        .select("approved")
        .populate("approved.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async categorySubreddits(query, category) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    try {
      let doc = await this.model
        .find({
          primaryTopic: category,
        })
        .skip(skip)
        .limit(limit)
        .sort("-createdAt");

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async randomSubreddits(query, userId) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    try {
      let doc = await this.model
        .find({ khaled: userId })
        .select("_id icon fixedName isJoined users membersCount description")
        .skip(skip)
        .limit(limit);

      // .sort("-membersCount");

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async getPunished(subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
        })
        .select("punished");
      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async checkPunished(userId, subredditName, action) {
    try {
      let tempDoc = this.model.findOne({
        fixedName: subredditName,
        "punished.user": userId,
        "punished.type": action,
      });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async checkApproval(userId, subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          $and: [{ fixedName: subredditName }, { "aprroved.user": userId }],
        })
        .select("approved");

      const doc = await tempDoc;
      console.log(doc);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async subscribe(subredditId, userId) {
    await this.model.findByIdAndUpdate(
      subredditId,
      { $push: { users: { _id: userId } } },
      {
        new: true,
        runValidators: true,
      }
    );
    return true;
  }

  async unSubscribe(subredditId, userId) {
    await this.model.findByIdAndUpdate(
      subredditId,
      { $pull: { users: { _id: userId } } },
      {
        new: true,
        runValidators: true,
      }
    );
    return true;
  }

  async checkRule(title, subredditName) {
    try {
      let tempDoc = this.model.findOne({
        fixedName: subredditName,
        "rules.title": title,
      });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async addFlairToSubreddit(subredditName, flairId) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
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
        { fixedName: subredditName },
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
      $inc: { membersCount: 1 },
    });
  }

  async removeUser(id) {
    await this.model.findByIdAndUpdate(id, {
      $inc: { membersCount: -1 },
    });
  }

  /**
   * this function checks if user is moderator or not by passing @subredditId
   * @param {string} subredditId - The  subreddit ID
   * @param {string} userId - The user ID in question
   * @returns {boolean}
   */
  async moderator(subredditId, userId) {
    //..
    try {
      let tempDoc = this.model
        .findOne({
          _id: subredditId,
          "moderators.user": userId,
        })
        .select({ "moderators.$": 1 });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async updateSubredditImage(subredditName, type, filename) {
    let doc;
    if (type === "icon") {
      doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { icon: "subreddits/" + filename },
        { new: true }
      );
    } else if (type === "backgroundImage") {
      doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { backgroundImage: "subreddits/" + filename },
        { new: true }
      );
    } else {
      doc = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        { theme: "subreddits/" + filename },
        { new: true }
      );
    }
    // console.log(doc);
    return { success: true, doc: doc };
  }
  async invite(userId, subredditName) {
    try {
      const user = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $push: {
            invitations: {
              user: userId,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: user };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async disInvite(userId, subredditName) {
    try {
      const user = await this.model.findOneAndUpdate(
        { fixedName: subredditName },
        {
          $pull: {
            invitations: {
              user: userId,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: user };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async invitations(subredditName) {
    try {
      let tempDoc = this.model
        .findOne({
          fixedName: subredditName,
        })
        .select("invitations")
        .populate("invitations.user", "_id userName joinDate profilePicture");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async traffic(subredditName, type) {
    try {
      if (type === "hour") {
        const doc = await this.model.aggregate([
          {
            $unwind: "$users",
          },
          {
            $match: { fixedName: subredditName },
          },
          {
            $group: {
              _id: { $hour: "$users.subDate" },
              numOfUsers: { $sum: 1 },
            },
          },
          {
            $sort: { numOfUsers: -1 },
          },
        ]);
        if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
        return { success: true, doc: doc };
      } else if (type === "day") {
        const doc = await this.model.aggregate([
          {
            $unwind: "$users",
          },
          {
            $match: { fixedName: subredditName },
          },
          {
            $group: {
              _id: { $dayOfWeek: "$users.subDate" },
              numOfUsers: { $sum: 1 },
            },
          },
          {
            $sort: { numOfUsers: -1 },
          },
        ]);
        if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
        return { success: true, doc: doc };
      } else if (type === "week") {
        const doc = await this.model.aggregate([
          {
            $unwind: "$users",
          },
          {
            $match: { fixedName: subredditName },
          },
          {
            $group: {
              _id: { $week: "$users.subDate" },
              numOfUsers: { $sum: 1 },
            },
          },
          {
            $sort: { numOfUsers: -1 },
          },
        ]);
        if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
        return { success: true, doc: doc };
      } else if (type === "year") {
        const doc = await this.model.aggregate([
          {
            $unwind: "$users",
          },
          {
            $match: { fixedName: subredditName },
          },
          {
            $group: {
              _id: { $year: "$users.subDate" },
              numOfUsers: { $sum: 1 },
            },
          },
          {
            $sort: { numOfUsers: -1 },
          },
        ]);
        if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
        return { success: true, doc: doc };
      } else if (type === "month") {
        const doc = await this.model.aggregate([
          {
            $unwind: "$users",
          },
          {
            $match: { fixedName: subredditName },
          },
          {
            $group: {
              _id: { $month: "$users.subDate" },
              numOfUsers: { $sum: 1 },
            },
          },
          {
            $sort: { numOfUsers: -1 },
          },
        ]);
        if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
        return { success: true, doc: doc };
      }
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async search(q, page, limit) {
    const skip = (page - 1) * limit;

    const query = this.model
      .find({ $text: { $search: q } })
      .select("_id fixedName name icon membersCount description nsfw")
      .skip(skip)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } })
      .lean();

    const result = await query;
    return result;
  }
}

module.exports = SubredditRepository;
