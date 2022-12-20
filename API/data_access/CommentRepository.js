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
    await this.model.findByIdAndUpdate(id, { isDeleted: true });
    //await this.model.findByIdAndDelete(id);
  }

  async commentTree(children, limit, depth, sort) {
    const comments = this.model
      .find({
        _id: { $in: children },
      })
      .sort({ [sort]: -1 });

    if (depth >= 0) {
      comments
        .populate({
          path: "replies",
          perDocumentLimit: limit,
          options: { depth, sort: { [sort]: -1 } },
          // transform: (doc) => {
          //   doc.author.profilePicture =
          //     `${process.env.BACKDOMAIN}/` + doc.author.profilePicture;
          //   doc.author.profileBackground =
          //     `${process.env.BACKDOMAIN}/` + doc.author.profileBackground;
          //   return doc;
          // },
        })
        .lean();
    }

    return await comments;
  }

  async getUserComments(userId, query, popOptions) {
    const features = new APIFeatures(
      this.model.find({
        author: userId,
        isDeleted: false,
      }),
      query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();

    let doc = await features.query.populate({
      path: popOptions,
      options: { userComments: true },
    });
    return { success: true, doc: doc };
  }
  async getCommentwithAuthor(commentId) {
    try {
      // const doc = await features.query.explain();
      // const features = new APIFeatures(this.model.find({ _id: postId }), "");
      // let doc = await features.query;
      let doc = await this.model.findOne({ _id: commentId }).populate({
        path: "author",
        options: { getAuthor: true },
      });
      // console.log(doc[0].owner);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false };
    }
  }


   async getComment(commentId) {
    try {
      // const doc = await features.query.explain();
      // const features = new APIFeatures(this.model.find({ _id: postId }), "");
      // let doc = await features.query;
      let doc = await this.model.findOne({ _id: commentId });
      // console.log(doc[0].owner);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false };
    }
  }
  async updateVotesCount(commentId, newVotes) {
    try {
      let doc = await this.model.findByIdAndUpdate(commentId, {
        votes: newVotes,
      });
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  /**
   * Changes the modState of a post according to action only by the moderators of the subreddit
   * @param {string} commentId The ID of the post
   * @param {string} action The action to be performed
   * @returns {bool} returns true if the action is performed successfully and false otherwise
   */
  async modAction(commentId, action) {
    //Just to be consistent with the language rules
    const state = action === "spam" ? "spammed" : action + "d";

    const doc = await this.model.findOneAndUpdate(
      { _id: commentId, modState: { $ne: state } },
      { modState: state },
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (doc) return true;
    return false;
  }
}
module.exports = CommentRepository;
