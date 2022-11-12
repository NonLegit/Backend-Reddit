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

    this.getBestPosts = this.getBestPosts.bind(this);
    this.getTopPosts = this.getTopPosts.bind(this);
    this.getHotPosts = this.getHotPosts.bind(this);
    this.getNewPosts = this.getNewPosts.bind(this);
  }

  async createPost(req, res) {
    try {
      const data = req.body;
      data.author = req.user._id;

      const validPost = await this.postServices.isValidPost(data);
      if (!validPost) {
        res.status(400).json({
          status: "fail",
          message: "Invalid post request",
        });
        return;
      }

      const post = await this.postServices.createPost(data);

      res.status(201).json({
        status: "success",
        data: post,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "fail",
      });
    }
  }

  async deletePost(req, res) {
    try {
      //validate request params
      const id = req.params.postId;
      if (!id) {
        res.status(400).json({
          status: "fail",
          message: "Missing required parameter postId",
        });
        return;
      }
      const validId = await this.postServices.isValidId(id);
      if (!validId) {
        res.status(404).json({
          status: "fail",
          err: "Post not found",
        });
        return;
      }

      //validate the user
      if (!(await this.postServices.isAuthor(id, req.user._id))) {
        res.status(401).json({
          status: "fail",
          err: "User must be author",
        });
        return;
      }

      await this.postServices.deletePost(id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "Internal server error" + err,
      });
    }
  }

  async updatePost(req, res) {
    try {
      const id = req.params.postId;
      const data = req.body;
      if (!id || !data.text) {
        res.status(400).json({
          status: "fail",
          message: "Missing required parameter",
        });
        return;
      }
      const validId = await this.postServices.isValidId(id);
      if (!validId) {
        res.status(404).json({
          status: "fail",
          err: "Post not found",
        });
        return;
      }

      //validate the user
      if (!(await this.postServices.isAuthor(id, req.user._id))) {
        res.status(401).json({
          status: "fail",
          err: "User must be author",
        });
        return;
      }

      if (!(await this.postServices.isEditable(id))) {
        res.status(401).json({
          status: "fail",
          err: "Post isn't editable",
        });
        return;
      }

      const post = await this.postServices.updatePost(id, data);
      res.status(200).json({
        status: "success",
        data: post,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "fail",
        message: err,
      });
    }
  }
  /**
   * @property {Function} userPosts  get created posts by user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  async userPosts(req, res, next) {
    // i have user id
    let me = req.user;
    if (!req.params.userName) {
      res.status(400).json({
        status: "fail",
        message: "Provide userName ",
      });
    } else {
      let sortType = "New";
      if (req.query.sort) {
        sortType = req.query.sort;
      }
      const userName = req.params.userName;
      let user = await this.userServices.getUserByName(userName, "");
      // get id of user with its name
      let userId = user.doc._id;

      // check if this user block me or i blocked him in order to show posts , TODO

      // get post which he creates
      let posts = await this.postServices.getUserPosts(userId, sortType);

      // get vote of me if these post i vote on it
      posts = this.postServices.setVotePostStatus(me, posts);
      posts = this.postServices.setSavedPostStatus(me, posts);
      posts = this.postServices.setHiddenPostStatus(me, posts);
      posts = this.postServices.setPostOwnerData(posts);
      //console.log(posts[0]);
      
      res.status(200).json({
        status: "success",
        posts: posts,
      });
    }
  }
  /**
   *
   * @property {Function} getSavedPosts  get saved posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  async getSavedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("saved", "-__v");
    //await me.saved.populate("owner");
    // get vote of me if these post i vote on it
    //posts = this.postServices.setVotePostStatus(me, posts);
    let posts = this.postServices.setVotePostStatus(me, me.saved);
    posts = this.postServices.removeHiddenPosts(me, posts);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  /**
   * @property {Function} getHiddenPosts get hidden posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  async getHiddenPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("hidden", "-__v");
    // get vote of me if these post i vote on it
    //posts = this.postServices.setVotePostStatus(me, posts);
    let posts = this.postServices.setVotePostStatus(me, me.hidden);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  /**
   * @property {Function} userUpvotedPosts  get upvoted posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  async userUpvotedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("votePost.posts", "-__v");
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, "1");
    posts = this.postServices.setSavedPostStatus(me, posts);
    posts = this.postServices.setHiddenPostStatus(me, posts);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }
  /**
   *
   * @property {Function} userDownvotedPosts get downvoted posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  async userDownvotedPosts(req, res, next) {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO
    await me.populate("votePost.posts", "-__v");
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, "-1");
    posts = this.postServices.setSavedPostStatus(me, posts);
    posts = this.postServices.setHiddenPostStatus(me, posts);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  }

   async getHotPosts(req, res) {
      try { 
          req.query.sort = '-createdAt,-votes,-commentCount';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query,req.toFilter);
          // console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.status,
              errorMessage: response.err,
              });
          }
          } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
              status: "fail",
          });
      }
  }
  async getNewPosts(req, res) {
    try{
          req.query.sort = '-createdAt';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query, req.toFilter);
          // console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.status,
              errorMessage: response.err,
              });
          }
      } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
          status: "fail",
      });
      }
    }
    async getTopPosts(req, res) {
      try {
          req.query.sort = '-votes';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query, req.toFilter);
           console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.status,
              errorMessage: response.err,
              });
          }
      } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
              status: "fail",
      });
      }
    }
  async getBestPosts(req, res) {
    try {
      req.query.sort = '-createdAt,-votes,-commentCount,-shareCount';
      console.log(req.query);
      let response = await this.postServices.getPosts(req.query, {});
      // console.log( response);
      if (response.status === "success") {
          res.status(response.statusCode).json({
          status: response.status,
          data: response.doc,
          });
      } else {
          res.status(response.statusCode).json({
          status: response.status,
          errorMessage: response.err,
          });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
          status: "fail",
      });
  }
}
}

module.exports = PostController;
