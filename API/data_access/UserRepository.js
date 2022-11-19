const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class UserRepository extends Repository {
  constructor({ User }) {
    super(User);
  }

  //can be further extended to allow select and populate
  async findByUserName(userName, select,pop) {
    let query = this.model.findOne({ userName: userName });
    if (select) query = query.select(select);
    if (pop) query = query.populate(pop);
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByEmail(email) {
    let query = this.model.findOne({ email: email });
    const user = await query;
    if (!user) return { success: false, error: mongoErrors.NOT_FOUND };
    return { success: true, doc: user };
  }
  async findByEmailAndUserName(userName, email) {
    let query = this.model.findOne({ email: email, userName: userName });
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

  async isSubscribed(user, subreddit) {
    const subscribed = await this.model.findOne(
      { _id: user, subscribed: subreddit },
      "_id"
    );

    if (subscribed) return true;
    return false;
  }

  async getSubreddits(userId) {
    try {
      let tempDoc = this.model
        .find({ _id: userId })
        .select("subscribed")
        .populate("subscribed", "_id name icon usersCount description");
      const doc = await tempDoc;
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
}
module.exports = UserRepository;
