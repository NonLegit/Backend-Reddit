const Repository = require("./repository");

class UserRepository extends Repository {
  constructor({ User }) {
    super(User);
  }
}
module.exports = UserRepository;
