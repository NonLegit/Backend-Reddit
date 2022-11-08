class PostController {
  constructor(postServices, userServices) {
    this.postServices = postServices;
    this.userServices = userServices;
    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.userPosts = this.userPosts.bind(this);
    this.getSavedPosts = this.getSavedPosts.bind(this);
    this.getHiddenPosts = this.getHiddenPosts.bind(this);
    this.userUpvotedPosts = this.userUpvotedPosts.bind(this);
    this.userDownvotedPosts = this.userDownvotedPosts.bind(this);
  }

  async createPost(req, res) {
    try {
      //Add current user as author
      const user = req.user;
      req.body.author = user._id;

      const post = await this.postServices.createPost(req.body);
      if (post.status === "success") {
        res.status(post.statusCode).json({
          status: "success",
          data: post.doc,
        });
      } else {
        res.status(post.statusCode).json({
          status: "fail",
          message: post.err,
        });
      }
    } catch (err) {
      console.log("error in Post controller" + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  async deletePost(req, res) {
    const user = req.user;
    const deleted = await this.postServices.deletePost(
      req.params.postId,
      user._id
    );
    if (deleted.status === "success") {
      res.status(deleted.statusCode).json({
        status: "success",
        data: deleted.doc,
      });
    } else {
      res.status(deleted.statusCode).json({
        status: "fail",
        message: deleted.err,
      });
    }
  }

  async updatePost(req, res) {
    const user = req.user;
    const updated = await this.postServices.updatePost(
      req.params.postId,
      req.body,
      user._id
    );
    if (updated.status === "success") {
      res.status(updated.statusCode).json({
        status: "success",
        data: updated.doc,
      });
    } else {
      res.status(updated.statusCode).json({
        status: "fail",
        message: updated.err,
      });
    }
  }
  async userPosts(req, res, next) {
    // i have user id
    let me = req.user;
    if (!req.params.userName) {
      res.status(400).json({
        status: "fail",
        message: "Provide userName ",
      });
    } else {
      const userName = req.params.userName;
      let user = await this.userServices.getUserByName(userName, "");
      // get id of user with its name
      let userId = user.doc._id;

      // check if this user block me or i blocked him in order to show posts , TODO

      // get post which he creates
      let posts = await this.postServices.getUserPosts(userId);

      // get vote of me if these post i vote on it
      posts = this.postServices.setVotePostStatus(me, posts);
      console.log(posts[0]);
      res.status(200).json({
        status: "success",
        posts: posts,
      });
    }
  }
  async getSavedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("saved", "-__v");
    console.log(me);
    // get vote of me if these post i vote on it
    //posts = this.postServices.setVotePostStatus(me, posts);
    let posts = this.postServices.setVotePostStatus(me, me.saved);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  async getHiddenPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("saved", "-__v");
    console.log(me);
    // get vote of me if these post i vote on it
    //posts = this.postServices.setVotePostStatus(me, posts);
    let posts = this.postServices.setVotePostStatus(me, me.saved);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  async userUpvotedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("votePost.posts", "-__v");
    console.log(me);
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, "1");
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  async userDownvotedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO
    await me.populate("votePost.posts", "-__v");
    console.log(me);
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, "0");
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
}

module.exports = PostController;
