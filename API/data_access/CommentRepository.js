const Repository = require("./repository");
const ObjectId = require("mongodb").ObjectId;

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

  async updateText(id, text) {
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

  async commentTree(commentId, limit, depth) {
    if (!ObjectId.isValid(commentId)) return false;

    const comment = await this.model
      .findById(commentId)
      .populate({
        path: "replies",
        perDocumentLimit: limit,
        options: { depth: depth },
      })
      .lean();

    return comment;
  }
}
module.exports = CommentRepository;
