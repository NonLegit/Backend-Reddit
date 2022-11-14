const Repository = require("./repository");

class SubredditRepository extends Repository {
  constructor({ subreddit }) {
    super(subreddit);
  }
}
module.exports = SubredditRepository;
