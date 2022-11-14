const Repository = require("./repository");

class CommentRepository extends Repository {
  constructor({ Comment }) {
    super(Comment);
  }
}
module.exports = CommentRepository;
