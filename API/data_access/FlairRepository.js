const Repository = require("./repository");

class FlairRepository extends Repository {
  constructor({ Flair }) {
    super(Flair);
  }
}
module.exports = FlairRepository;
