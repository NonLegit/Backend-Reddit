const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class UserRepository extends Repository {
  constructor({ User }) {
    super(User);
  }

  //can be further extended to allow select and populate
  async findByUserName(userName) {
    const user = await this.model.findOne({ userName: userName });
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
}
module.exports = UserRepository;
