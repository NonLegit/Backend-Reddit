const Repository = require("./repository");
const ObjectId = require("mongodb").ObjectId;
const APIFeatures = require("./apiFeatures");

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
  // async createComment(data) {
    
  //     const doc = await this.model.create(data).populate("author");
  //     console.log(doc);
  //     return { success: true, doc: doc };
    
  // }

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
  
  async getUserComments(userId, query, popOptions) {
    const features = new APIFeatures(this.model.find({ author: userId }), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    let doc = await features.query.populate(popOptions);
    return { success: true, doc: doc };
  }
}
module.exports = CommentRepository;
