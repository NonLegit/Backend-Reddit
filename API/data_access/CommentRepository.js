const Repository = require("./repository");

class CommentRepository extends Repository {
  constructor({ Comment }) {
    super(Comment);
  }

  async addReply(parent, child) {
    await this.model.findByIdAndUpdate(parent, {
      $push: { replies: child },
      $inc: { repliesCount: 1 },
    });
  }

  async removeReply(parent, child) {
    await this.model.findByIdAndUpdate(parent, {
      $pull: { replies: child },
      $inc: { repliesCount: -1 },
    });
  }

  async updatetext(id, text) {
    const comment = await this.model.findByIdAndUpdate(
      id,
      { text: text },
      {
        new: true,
        runValidators: true,
      }
    );

    return { success: true, doc: comment };
  }

  async deleteComment(id) {
    //await Post.findByIdAndUpdate(id, {isDeleted: true})
    await this.model.findByIdAndDelete(id);
  }
}
module.exports = CommentRepository;
