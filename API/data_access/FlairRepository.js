const Repository = require("./repository");

class FlairRepository extends Repository {
  constructor({ Flair }) {
    super(Flair);
  }

  async updateFlair(flairId,data) {
    try {
      const doc = await this.model.findByIdAndUpdate(flairId, data, {
        new: true,
        runValidators: true,
      });
      
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
      
    } catch (err) {
        return { success: false, ...decorateError(err) };
    }
  }

   
}
module.exports = FlairRepository;
