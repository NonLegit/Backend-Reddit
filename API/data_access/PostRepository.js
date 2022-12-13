//const Post = require("../models/postModel");
const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");

class PostRepository extends Repository {
  constructor({ Post }) {
    super(Post);
  }

  async updateText(id, text) {
    const post = await this.model.findByIdAndUpdate(
      id,
      { text: text },
      {
        new: true,
        runValidators: true,
      }
    );

    return { success: true, doc: post };
  }

  async deletePost(id) {
    //await Post.findByIdAndUpdate(id, {isDeleted: true})
    await this.model.findByIdAndDelete(id);
  }

  async addReply(parent, child) {
    await this.model.findByIdAndUpdate(parent, {
      $push: { replies: child },
      $inc: { commentCount: 1 },
    });
  }

  async removeReply(parent, child) {
    await this.model.findByIdAndUpdate(parent, {
      $pull: { replies: child },
      $inc: { commentCount: -1 },
    });
  }
  async getUserPosts(author, query, popOptions) {
    const features = new APIFeatures(this.model.find({ author: author }), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    let doc = await features.query.populate(popOptions);
    return { success: true, doc: doc };
  }
  async getPosts(filter, query, sortType) {
    try {
      // if (user) {
      //   //console.log("oooooooooooooooooooo");
      //   let hiddenPostsIds= await user.populate("hidden",{_id:1,owner:0});
      //   console.log(user.hidden);
      // }
      // //console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      // console.log(user);
      // let getSubredditPosts = filter ? { owner: filter, _id:{"$nin":user.hidden._id} } : { _id:{"$nin":user.hidden}};

      let getSubredditPosts = filter ? { owner: filter } : {};

      if (sortType == "hot") {
        query.sort = "-sortOnHot";
      } else if (sortType == "new") {
        query.sort = "-createdAt";
      } else if (sortType == "top") {
        query.sort = "-votes";
      } else {
        //best
        query.sort = "-sortOnBest";
      }

      console.log(query.sort);
      const features = new APIFeatures(
        this.model.find(getSubredditPosts),
        query
      )
        .filter()
        .limitFields()
        .paginate()
        .sort();
      //console.log(doc);
      let doc = await features.query;
      //console.log(doc);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async getPost(postId) {
    try {
     
      // const doc = await features.query.explain();
      // const features = new APIFeatures(this.model.find({ _id: postId }), "");
      // let doc = await features.query;
      let doc = await this.model.find({ _id: postId });
      // console.log(doc[0].owner);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
      
  

      
      
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  /**
   * Performs an action on post
   * @param {string} postId The ID of the post
   * @param {string} action The action to be performed
   * @param {bool} dir True for the action, False for its opposite
   * @returns {bool} returns true if the action is performed successfully and false otherwise
   */
  async postAction(postId, action, dir) {
    const doc = await this.model.findOneAndUpdate(
      { _id: postId, [action]: !dir },
      { [action]: dir },
      {
        new: true,
        runValidators: true,
      }
    );

    if (doc) return true;
    return false;
  }

  /**
   * Changes the modState of a post according to action only by the moderators of the subreddit
   * @param {string} postId The ID of the post
   * @param {string} action The action to be performed
   * @returns {bool} returns true if the action is performed successfully and false otherwise
   */
  async modAction(postId, action) {
    //Just to be consistent with the language rules
    const state = action === "spam" ? "spammed" : action + "d";

    const doc = await this.model.findOneAndUpdate(
      { _id: postId, modState: { $ne: state } },
      { modState: state },
      {
        new: true,
        runValidators: true,
      }
    );

    if (doc) return true;
    return false;
  }

  /**
   * Mark post as spammed/unspammed by a certain user according to dir
   * @param {String} postId
   * @param {String} userId
   * @param {Number} dir
   */
  async spam(postId, userId, dir) {
    if (dir === 1)
      await this.model.findByIdAndUpdate(postId, {
        $push: { spammedBy: userId },
        $inc: { spamCount: 1 },
      });
    else
      await this.model.findByIdAndUpdate(postId, {
        $pull: { spammedBy: userId },
        $inc: { spamCount: -1 },
      });
  }

  async commentTree(postId, limit, depth) {
    const tree = await this.model.findById(postId, "replies").populate({
      path: "replies",
      perDocumentLimit: limit,
      options: { depth: depth },
    }).lean();

    return tree;
  }

}

module.exports = PostRepository;
