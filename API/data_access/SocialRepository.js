const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");

class SocialRepository extends Repository {
  constructor({ Social }) {
    super(Social);
  }
  async getAll() {

    let docs = await this.model.find({});
    //console.log(docs);

    return docs;
  }
  async findOne(id) {
    let docs = await this.model.findById(id);
    if (docs) {
      return { success: true };
    }
    return { success: false };
  }
}
module.exports = SocialRepository;
