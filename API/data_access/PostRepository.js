const Repository = require("./repository");

class PostRepository extends Repository {
  constructor({ Post }) {
    super(Post);
  }
}
module.exports = PostRepository;
