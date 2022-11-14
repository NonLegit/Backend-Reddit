const Repository = require("./repository");

class MessageRepository extends Repository {
  constructor({ Message }) {
    super(Message);
  }
}
module.exports = MessageRepository;
