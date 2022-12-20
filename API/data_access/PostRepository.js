//const Post = require("../models/postModel");
const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");
const ObjectId = require("mongodb").ObjectId;

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
    await this.model.findByIdAndUpdate(id, { isDeleted: true });
    //await this.model.findByIdAndDelete(id);
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
    const features = new APIFeatures(
      this.model.find({
        $or: [
          {
            author: author,
          },
        ],
        $and: [
          {
            isDeleted: false,
          },
        ],
      }),
      query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    let options = {
      path: "sharedFrom",
      options: { getAuthor: true },
    };

    let doc = await features.query.populate(options);
    return { success: true, doc: doc };
  }
  async getPosts(filter, query, sortType,user,people) {
    try {
      // if (user) {
      //   //console.log("oooooooooooooooooooo");
      //   let hiddenPostsIds= await user.populate("hidden",{_id:1,owner:0});
      //   console.log(user.hidden);
      // }
      // //console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      // console.log(user);
      // let getSubredditPosts = filter ? { owner: filter, _id:{"$nin":user.hidden._id} } : { _id:{"$nin":user.hidden}};

      //let getSubredditPosts = filter ? { owner: filter } : {};

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

      // console.log(people.people);
      // console.log(people.blocked);
      // console.log(query);
      let selector;
    // this.model.find({ $or: [{ "from": userId, "isDeletedInSource": false, type: { $nin:["postReply","userMention"] } },{ "to": userId, "isDeletedInDestination": false, type: { $nin:["postReply","userMention"] } }] }),
        
      if (!filter&&user) {
        // selector = { owner: { $in: user.subscribed } };
        //post is in subreddit that i subscribe
        //OR post is from a user that i follow or is my friend
        //And we didn't block each other
        selector = { $or: [{ author: { $in: people.people } },{ owner: { $in: user.subscribed } }],  author: { $nin: people.blocked  }};
      } else if (filter && user) {
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii");
        console.log(filter);
        selector = { owner: filter , author: { $nin: people.blocked  }};
      }

      if (!user&&filter) {
        selector = { owner: filter };
      }
      //  console.log(query.sort);
      const features = new APIFeatures(
        this.model.find(selector),
        query
      )
        .filter()
        .limitFields()
        .paginate()
        .sort();
      console.log(selector);
      let doc = await features.query;
      console.log(doc);
      if (doc.length == 0&&!filter) {
        console.log("======================");
        let selectorTwo = user ? { author: { $nin: people.blocked } } : {};
        let featuresGen =
          new APIFeatures(
        this.model.find(selectorTwo),
        query
      )
        .filter()
        .limitFields()
        .paginate()
        .sort();
        doc = await featuresGen.query;
      }
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
  async getPostwithAuthor(postId) {
    try {
      // const doc = await features.query.explain();
      // const features = new APIFeatures(this.model.find({ _id: postId }), "");
      // let doc = await features.query;
      let doc = await this.model.findOne({ _id: postId }).populate({
        path: "author",
        options: { getAuthor: true },
      });
      // console.log(doc[0].owner);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }
  async updateVotesCount(postId, newVotes) {
    try {
      let doc = await this.model.findByIdAndUpdate(postId, { votes: newVotes });
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

  async getPostsByModStats(subredditId, query, location) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    try {
      let doc = await this.model
        .find({
          owner: subredditId,
          modState: location,
        })
        .skip(skip)
        .limit(limit)
        .sort("-createdAt");

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      console.log(err);
      return { success: false, ...decorateError(err) };
    }
  }

  async getPostsBySubredditTopic(topic, query) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    try {
      let doc = await this.model
        .find({
          $or: [{ kind: "video" }, { kind: "image" }],
          ownerType: "Subreddit",
        })
        .populate({
          path: "owner",
          options: { getAuthor: true },
          $group: { primaryTopic: topic },
        })
        .skip(skip)
        .limit(limit)
        .sort("sortOnHot");

      console.log(doc);

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async commentTree(postId, limit, depth, sort) {
    const tree = await this.model
      .findById(postId, "replies")
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
      .lean()
      .sort({ [sort]: -1 });

    return tree;
  }

  async addImage(postId, image) {
    return await this.model.findByIdAndUpdate(
      postId,
      {
        $push: { images: image },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async addVideo(postId, video) {
    return await this.model.findByIdAndUpdate(
      postId,
      {
        video: video,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async search(q, page, limit, sort, time) {
    const skip = (page - 1) * limit;

    const query = this.model
      .find({ $text: { $search: q } })
      .skip(skip)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } })
      .lean();

    const result = await query;
    return result;
  }
}

module.exports = PostRepository;
