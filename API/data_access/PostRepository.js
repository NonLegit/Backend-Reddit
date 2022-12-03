//const Post = require("../models/postModel");
const Repository = require("./repository");
const { mongoErrors ,decorateError} = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");

class PostRepository extends Repository {
  constructor({ Post }) {
    super(Post);
  }

  async updatetext(id, text) {
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
  async getPosts(filter, query,sortType) {
    try {
      // if (user) {
      //   //console.log("oooooooooooooooooooo");
      //   let hiddenPostsIds= await user.populate("hidden",{_id:1,owner:0});
      //   console.log(user.hidden);
      // }
      // //console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      // console.log(user);
      // let getSubredditPosts = filter ? { owner: filter, _id:{"$nin":user.hidden._id} } : { _id:{"$nin":user.hidden}};

      let getSubredditPosts = filter ? { owner: filter} : {};

      if (sortType == "hot") {
        query.sort= "-sortOnHot";
      }else if (sortType == "new") {
        query.sort = "-createdAt";
      }else if (sortType == "top") {
        query.sort = "-votes";
      }else  {//best
        query.sort = "-sortOnBest";
      }
      
      console.log(query.sort);
      const features = new APIFeatures(this.model.find(getSubredditPosts), query)
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
}
module.exports = PostRepository;
