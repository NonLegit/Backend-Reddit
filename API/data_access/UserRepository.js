const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class UserRepository extends Repository {
  constructor({ User }) {
    super(User);
  }

  //can be further extended to allow select and populate
  async findById(id,select,pop) {
    try {
      // console.log("beforeeeeeeeeeeeeeeeeeeeeeeeee");
      // console.log(select);
      //  console.log(pop);
      let query = this.model.findById(id, { isDeleted: false });
      if (select) query = query.select(select);
      if (pop) query = query.populate(pop);
      const doc = await query;
      console.log("doc",doc);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      // console.log(doc);
      return { success: true, doc: doc };

      //most probably you won't need error handling in this function but just to be on the safe side
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async findByUserName(userName, select, pop) {
    let query = this.model.findOne({ userName: userName, isDeleted: false });
    if (select) query = query.select(select);
    if (pop) query = query.populate(pop);
    const user = await query;
    console.log(user);
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByName(userName) {
    let query = this.model.findOne({ userName: userName });
    const user = await query;
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    console.log(user);
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByEmail(email) {
    let query = this.model.findOne({ email: email, isDeleted: false });
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByEmailAndUserName(userName, email) {
    let query = this.model.findOne({
      email: email,
      userName: userName,
      isDeleted: false,
    });
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByResetPassword(passwordResetToken) {
    let query = this.model.findOne({
      passwordResetToken: passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }

  async findByVerificationToken(verificationToken) {
    let query = this.model.findOne({
      verificationToken: verificationToken,
      verificationTokenExpires: { $gt: Date.now() },
    });
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }

  async isSubscribed(user, subreddit) {
    const query = await this.model.findOne({ _id: user }, "subscribed");
    let subscribed = false;
    for (const subredditID of query.subscribed) {
      if (subredditID.equals(subreddit)) {
        subscribed = true;
        break;
      }
    }
    return subscribed;
  }

  async getSubreddits(userId) {
    try {
      let tempDoc = this.model
        .find({ _id: userId })
        .select("subscribed")
        .populate("subscribed", "_id fixedName icon membersCount description");
      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async getFavouriteSubreddits(userId) {
    try {
      let tempDoc = this.model
        .find({ _id: userId })
        .select("favourites")
        .populate("favourites", "_id fixedName icon membersCount description");
      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc[0].favourites };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async updateEmailById(id, email) {
    try {
      const user = await this.model.findByIdAndUpdate(
        id,
        { email: email },
        {
          new: true,
          runValidators: true,
        }
      );
      return { success: true, doc: user };
    } catch (error) {
      return { success: false, ...decorateError(err) };
    }
  }
  async updateOne(id, data) {
    try {
      const user = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return { success: false, error: mongoErrors.NOT_FOUND };
      }
      return { success: true, doc: user };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async updateByName(userName, subredditId, permissions) {
    try {
      const user = await this.model.findOneAndUpdate(
        { userName: userName },
        {
          $push: {
            pendingInvitations: {
              subredditId: subredditId,
              permissions: {
                all: permissions.all,
                access: permissions.access,
                config: permissions.config,
                flair: permissions.flair,
                posts: permissions.posts,
              },
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
  async updateSocialLinks(id, data) {
    const user = await this.model.findByIdAndUpdate(
      id,
      { $push: { socialLinks: data } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      // console.log(user);
      return { success: false, error: mongoErrors.INVALID_ID };
    }
    return { success: true, doc: user };
  }
  async addTokenToUser(userId, token) {
    const user = await this.model.findByIdAndUpdate(userId, { firebaseToken: token });
    if (!user) {
      return { success: false, error: mongoErrors.INVALID_ID };
    }
    return { success: true };
  }
  async getFirebaseToken(userId) {
    try {
      const user = await this.model.findById(userId, "firebaseToken");
       console.log("555555555555555555555555555555555");
      console.log(user);
      if (!user || !user.firebaseToken) {
        console.log("555555555555555555555555555555555");
        return { success: false, error: mongoErrors.INVALID_ID };
      }
      return { success: true, doc: user };
    } catch (err) {
      return { success: false, error: mongoErrors.UNKOWN };
    }
  }
  async checkInvetation(userId, subredditId) {
    try {
      let tempDoc = this.model.findOne({
        _id: userId,
        "pendingInvitations.subredditId": subredditId,
      });
      // .select({ "pendingInvitations.$": 1 });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async checkFavourite(userId, subredditId) {
    try {
      let tempDoc = this.model.findOne({
        _id: userId,
        favourites: subredditId,
      });

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async addFavourite(userId, subredditId) {
    try {
      const user = await this.model.findByIdAndUpdate(
        userId,
        { $push: { favourites: subredditId } },
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
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async removefavourite(userId, subredditId) {
    try {
      const user = await this.model.findByIdAndUpdate(
        userId,
        { $pull: { favourites: subredditId } },
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
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async updateInvitations(userId, invitations) {
    try {
      const user = await this.model.findOneAndUpdate(
        { _id: userId },
        { pendingInvitations: invitations },
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
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }
  async returnInvitations(userId) {
    try {
      let tempDoc = this.model
        .findOne({
          _id: userId,
        })
        .select("pendingInvitations");

      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async followUser(user) {
    await user.populate("userMeRelationship.userId");
    return user.userMeRelationship;
  }
  async unfollowUser(user) {
    await user.populate("userMeRelationship.userId");
    return user.userMeRelationship;
  }
  async getFollowers(user) {
    await user.populate("userMeRelationship.userId");
    return user.userMeRelationship;
  }
  async getBlocked(user) {
    await user.populate("meUserRelationship.userId");
    return user.meUserRelationship;
  }

  async subscribe(subredditId, userId) {
    await this.model.findByIdAndUpdate(
      userId,
      { $push: { subscribed: subredditId } },
      {
        new: true,
        runValidators: true,
      }
    );
    return true;
  }

  async unSubscribe(subredditId, userId) {
    await this.model.findByIdAndUpdate(
      userId,
      { $pull: { subscribed: subredditId } },
      {
        new: true,
        runValidators: true,
      }
    );
    return true;
  }

  async search(q, page, limit) {
    const skip = (page - 1) * limit;

    const query = this.model
      .find({ $text: { $search: q } })
      .select(
        "_id userName displayName icon postKarma commentKarma description profilePicture"
      )
      .skip(skip)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } })
      .lean();

    const result = await query;
    return result;
  }
}
module.exports = UserRepository;
