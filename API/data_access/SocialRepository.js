const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class SocialRepository extends Repository {
  constructor({ Social }) {
    super(Social);
  }
  async getAll() {
    docs = await this.model.find();
    return docs;
  }
  async findOne(id) {
    docs = await this.model.findById(id);
    if (docs) {
      return { sucess: true };
    }
    return { sucess: false };
  }
}
module.exports = SocialRepository;
