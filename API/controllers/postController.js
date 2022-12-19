const { Dir } = require("fs");
const {
  postErrors,
  subredditErrors,
  postActions,
} = require("../error_handling/errors");

class PostController {
  constructor({ PostService, UserService, CommentService }) {
    this.postServices = PostService;
    this.userServices = UserService;
    this.CommentService = CommentService;
  }

  createPost = async (req, res) => {
    const data = req.body;
    data.author = req.user._id;

    const validReq =
      data.ownerType && (data.kind || data.sharedFrom) && data.title;
    if (!validReq) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    const post = await this.postServices.createPost(data);

    if (!post.success) {
      let msg, stat;
      switch (post.error) {
        case postErrors.INVALID_POST_KIND:
          msg = "Invalid post kind";
          stat = 400;
          break;
        case postErrors.INVALID_OWNER:
          msg = "Invalid owner type";
          stat = 400;
          break;
        case postErrors.SUBREDDIT_NOT_FOUND:
          msg = "Subreddit not found";
          stat = 404;
          break;
        case postErrors.FLAIR_NOT_FOUND:
          msg = "Flair not found";
          stat = 404;
          break;
        case postErrors.MONGO_ERR:
          msg = post.msg;
          stat = 400;
          break;
        case postErrors.INVALID_PARENT_POST:
          msg = "Invalid parent post";
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    res.status(201).json({
      status: "success",
      data: post.data,
    });
  };

  deletePost = async (req, res) => {
    //validate request params
    const id = req.params?.postId;
    if (!req.params || !id) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter postId",
      });
      return;
    }

    const post = await this.postServices.deletePost(id, req.user._id);

    if (!post.success) {
      let msg, stat;
      switch (post.error) {
        case postErrors.NOT_AUTHOR:
          msg = "User must be author";
          stat = 401;
          break;
        case postErrors.POST_NOT_FOUND:
          msg = "Post not found";
          stat = 404;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  };

  updatePost = async (req, res) => {
    const id = req.params?.postId;
    const data = req.body;
    if (!id || !data.text) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    const post = await this.postServices.updatePost(id, data, req.user._id);

    if (!post.success) {
      let msg, stat;
      switch (post.error) {
        case postErrors.NOT_EDITABLE:
          msg = "Post isn't editable";
          stat = 400;
          break;
        case postErrors.NOT_AUTHOR:
          msg = "User must be author";
          stat = 401;
          break;
        case postErrors.POST_NOT_FOUND:
          msg = "Post not found";
          stat = 404;
          break;
        case postErrors.MONGO_ERR:
          msg = post.msg;
          stat = 400;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: post.data,
    });
  };
  /**
   * @property {Function} userPosts  get created posts by user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  userPosts = async (req, res, next) => {
    // i have user id
    let me = req.user;
    if (!req.params.userName) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide userName ",
      });
    } else {
      let sortType = "New";
      if (req.query.sort) {
        sortType = req.query.sort;
      }
      const userName = req.params.userName;
      let user = await this.userServices.getUserByName(userName, "");
      // get id of user with its name
      if (user.success === true) {
        let userId = user.data._id;

        // check if this user block me or i blocked him in order to show posts , TODO
        let isUserBlockedMe = await this.userServices.checkBlockStatus(
          me,
          user.data
        );
        let isMeBlockedUser = await this.userServices.checkBlockStatus(
          user.data,
          me
        );
        // get post which he creates
        if (isUserBlockedMe === true || isMeBlockedUser === true) {
          res.status(200).json({
            status: "success",
            posts: [],
          });
        } else {
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
      } else {
        res.status(404).json({
          status: "fail",
          errorMessage: "User Not Found",
        });
      }
    }
  };
  /**
   *
   * @property {Function} getSavedPosts  get saved posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  getSavedPosts = async (req, res, next) => {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("saved.savedPost", "-__v");

    await me.populate({
      path: "savedComments.savedComment",
      select: "-__v",
      options: { userComments: true },
    });
    //await me.saved.populate("owner");
    // get vote of me if these post i vote on it
    let posts = this.postServices.setVoteStatus(me, me.saved);
    let comments = this.CommentService.setVoteStatus(me, me.savedComments);
    // let posts = this.postServices.setVotePostStatus(me, posts);
    // posts = this.postServices.setVotePostStatus(me, me.saved);
    // posts = this.postServices.removeHiddenPosts(me, posts);
    // posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      savedPosts: posts,
      savedComments: comments,
    });
  };
  /**
   * @property {Function} getHiddenPosts get hidden posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  getHiddenPosts = async (req, res, next) => {
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
  };
  /**
   * @property {Function} userUpvotedPosts  get upvoted posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  userUpvotedPosts = async (req, res, next) => {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO

    // get post which he creates
    await me.populate("votePost.posts", "-__v");
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, 1);
    posts = this.postServices.setSavedPostStatus(me, posts);
    posts = this.postServices.setHiddenPostStatus(me, posts);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  };
  /**
   *
   * @property {Function} userDownvotedPosts get downvoted posts of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  userDownvotedPosts = async (req, res, next) => {
    let me = req.user;

    // check if the owner of post block me or i blocked him in order to show posts , TODO
    await me.populate("votePost.posts", "-__v");
    // get vote of me if these post i vote on it
    //let posts = this.postServices.setVotePostStatus(me, me.votePost);
    let posts = this.postServices.selectPostsWithVotes(me.votePost, -1);
    posts = this.postServices.setSavedPostStatus(me, posts);
    posts = this.postServices.setHiddenPostStatus(me, posts);
    posts = this.postServices.setPostOwnerData(posts);
    res.status(200).json({
      status: "success",
      posts: posts,
    });
  };

  getHotPosts = async (req, res) => {
    try {
      //req.query.sort = "-createdAt,-votes,-commentCount";
      let sortType = "hot";
      let me = req.isAuthorized == true ? req.user : undefined;

      //console.log(req.user);
      //let posts;
      // if (req.user) {
      //   // let hiddenPostsIds = await req.user.populate("hidden");
      //   // console.log(hiddenPostsIds);
      //    posts = await this.postServices.getPosts(req.query, req.toFilter,req.user);
      // }
      // else {
       let people;
    if (me) {
      people = this.userServices.getPeopleUserKnows(me);
    }
      let posts = await this.postServices.getPosts(
        req.query,
        req.toFilter,
        me,
        sortType,
        people
      );

      // }
      if (!posts.success) {
        let message, statusCode, status;
        switch (posts.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(200).json({
        status: "OK",
        data: posts.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  getNewPosts = async (req, res) => {
    try {
      //req.query.sort = "-createdAt";
      //console.log(req.query);
       let sortType = "new";
      let me = req.isAuthorized == true ? req.user : undefined;
   let people;
    if (me) {
      people = this.userServices.getPeopleUserKnows(me);
    }
     
      let posts = await this.postServices.getPosts(
        req.query,
        req.toFilter,
        me,
        sortType,
        people
      );

      if (!posts.success) {
        let message, statusCode, status;
        switch (posts.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(200).json({
        status: "OK",
        data: posts.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  getTopPosts = async (req, res) => {
    try {
      //req.query.sort = "-votes";
      //console.log(req.query);

      let me = req.isAuthorized == true ? req.user : undefined;
   let people;
    if (me) {
      people = this.userServices.getPeopleUserKnows(me);
    }
      let sortType = "top";
      // let filter = (req.toFilter) ? req.toFilter : {};
      let posts = await this.postServices.getPosts(
        req.query,
        req.toFilter,
        me,
        sortType,
        people
      );

      if (!posts.success) {
        let message, statusCode, status;
        switch (posts.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }
      // if (req.user)
      // {
      //   let me = req.user;

      //   posts = this.postServices.setVotePostStatus(me, posts);
      //   console.log(posts);
      //   posts = this.postServices.setSavedPostStatus(me, posts);
      //   posts = this.postServices.setHiddenPostStatus(me, posts);
      //   posts = this.postServices.removeHiddenPosts(me, posts);
      //   posts = this.postServices.setPostOwnerData(posts);

      //   }

      res.status(200).json({
        status: "OK",
        data: posts.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  getBestPosts = async (req, res) => {
    try {
      //req.query.sort = "-createdAt,-votes,-commentCount,-shareCount";

      let sortType = "best";
      // check if the owner of post block me or i blocked him in order to show posts , TODO

      let me = req.isAuthorized == true ? req.user : undefined;

         let people;
    if (me) {
      people = this.userServices.getPeopleUserKnows(me);
    }
      // get post which he creates

      let posts = await this.postServices.getPosts(
        req.query,
        req.toFilter,
        me,
        sortType,
        people
      );

      if (!posts.success) {
        let message, statusCode, status;
        switch (posts.error) {
          case subredditErrors.SUBREDDIT_NOT_FOUND:
            message = "Subreddit not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case subredditErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(200).json({
        status: "OK",
        data: posts.data,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };
  getPost = async (req, res) => {
    let postId = req.params.postId;
    let me = req.isAuthorized == true ? req.user : undefined;
    if (!postId) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }
    try {
      let post = await this.postServices.getPost(postId, me);
      if (!post.success) {
        let message, statusCode, status;
        switch (post.error) {
          case postErrors.POST_NOT_FOUND:
            message = "Post not found";
            statusCode = 404;
            status = "Not Found";
            break;
          case postErrors.MONGO_ERR:
            message = "Internal server error";
            statusCode = 500;
            status = "Internal Server Error";
            break;
        }
        return res.status(statusCode).json({
          status: status,
          message: message,
        });
      }

      res.status(200).json({
        status: "OK",
        data: post.doc,
      });
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  };

  postActions = async (req, res) => {
    const postId = req.params.postId;
    const action = req.params.action;

    const validActions = [
      "lock_comments",
      "unlock_comments",
      "mark_nsfw",
      "unmark_nsfw",
      "spoiler",
      "unspoiler",
    ];
    if (!validActions.includes(action)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid post action",
      });
      return;
    }

    const success = await this.postServices.postAction(postId, action);
    if (success) res.status(204).json({});
    else
      res.status(409).json({
        status: "fail",
        message: "Action already performed",
      });
  };

  moderatePost = async (req, res) => {
    const postId = req.params.postId;
    const action = req.params?.action;

    const validActions = ["approve", "remove", "spam"];
    if (!validActions.includes(action)) {
      res.status(400).json({
        status: "fail",
        message: "Invalid post moderation action",
      });
      return;
    }

    const success = await this.postServices.modAction(postId, action);
    if (success) res.status(204).json({});
    else
      res.status(409).json({
        status: "fail",
        message: "Action is already performed",
      });
  };

  spam = async (req, res) => {
    const postId = req.params?.postId;
    const dir = req.body.dir || 1;

    if (!postId || !dir) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    const { success, error } = await this.postServices.spam(
      postId,
      req.user._id,
      dir
    );
    if (!success) {
      let msg, stat;
      switch (error) {
        case postErrors.POST_NOT_FOUND:
          msg = "Post not found";
          stat = 404;
          break;
        case postErrors.ACTION_ALREADY_DONE:
          msg = "Action already performed";
          stat = 409;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    res.status(204).json({});
  };

  mustBeMod = async (req, res, next) => {
    const postId = req.params?.postId;
    const userId = req.user._id;

    if (!postId) {
      res.status(400).send({ status: "fail", message: "Invalid request" });
      return;
    }

    const { success, error } = await this.postServices.isMod(postId, userId);

    if (!success) {
      switch (error) {
        case postErrors.POST_NOT_FOUND:
          res.status(404).send({ status: "fail", message: "Post not found" });
          break;
        case postErrors.NOT_MOD:
          res.status(401).send({
            status: "fail",
            message: "User must be moderator",
          });
          break;
        case postErrors.OWNER_NOT_SUBREDDIT:
          res.status(400).send({
            status: "fail",
            message: "The post must belong to a subreddit",
          });
          break;
      }
      return;
    }

    next();
  };

  mustBeAuthOrMod = async (req, res, next) => {
    const postId = req.params?.postId;

    if (!postId) {
      res.status(400).send({ status: "fail", message: "Invalid request" });
      return;
    }
    const userId = req.user._id;

    const { success, error } = await this.postServices.isAuthOrMod(
      postId,
      userId
    );

    if (!success) {
      switch (error) {
        case postErrors.POST_NOT_FOUND:
          res.status(404).send({ status: "fail", message: "Post not found" });
          break;
        case postErrors.NOT_AUTHOR_OR_MOD:
          res.status(401).send({
            status: "fail",
            message: "User must be author or moderator",
          });
          break;
      }
      return;
    }

    next();
  };
  overview = async (req, res, next) => {
    let userName = req.params.userName;
    let user = await this.userServices.getUserByName(userName, "");
    let me = req.user;
    if (user.success == true) {
      let userId = user.data._id;
      let limit = req.query.limit;
      let page = req.query.page;
      let sort = req.query.sort;
      if (sort !== "New" || sort !== "Hot" || sort !== "Top") {
        sort = "-createdAt";
      } else {
        if (sort === "New") {
          sort = "-createdAt";
        } else if (sort === "Hot") {
          sort = "-votes";
        } else {
          sort = "-sortOnHot";
        }
      }
      if (limit === undefined || limit > 100 || limit < 0) {
        limit = 100;
      }
      if (page === undefined || page < 0) {
        page = 1;
      }
      let query = {
        sort: sort,
        limit: limit,
        page: page,
      };
      let isUserBlockedMe = await this.userServices.checkBlockStatus(
        me,
        user.data
      );
      let isMeBlockedUser = await this.userServices.checkBlockStatus(
        user.data,
        me
      );
      // get post which he creates
      if (isUserBlockedMe === true || isMeBlockedUser === true) {
        res.status(200).json({
          status: "success",
          posts: [],
          comments: [],
        });
      } else {
        let comments = await this.CommentService.getUserComments(
          userId,
          user.data,
          query
        );
        let posts = await this.postServices.getUserPosts(userId, sort);
        posts = this.postServices.setVotePostStatus(me, posts);
        posts = this.postServices.setSavedPostStatus(me, posts);
        posts = this.postServices.setHiddenPostStatus(me, posts);
        posts = this.postServices.setPostOwnerData(posts);
        posts = this.postServices.filterPosts(posts, comments);
        res.status(200).json({
          status: "success",
          posts: posts,
          comments: comments,
        });
      }
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "User Not Found",
      });
    }
  };
  postVote = async (req, res, next) => {
    let me = req.user;
    let postId = req.params.postId;
    let dir = req.body.dir;
    if (dir !== 1 && dir !== 0 && dir !== -1) {
      console.log(dir);
      res.status(400).json({
        status: "fail",
        errorMessage: "Enter Valid Vote dir",
      });
    } else {
      // check post is found
      let post = await this.postServices.findPostById(postId);
      if (post.success === true) {
        // check that author of block is not blocking me or i blocked him
      //  console.log(post.data);
        let isUserBlockedMe = await this.userServices.checkBlockStatus(
          me,
          post.data.author
        );
        let isMeBlockedUser = await this.userServices.checkBlockStatus(
          post.data.author,
          me
        );
        // get post which he creates
        if (isUserBlockedMe === true || isMeBlockedUser === true) {
          res.status(405).json({
            status: "fail",
            errorMessage: "Method Not Allowed",
          });
        } else {
          // add vote status of user
          let isUpdated = await this.postServices.addVote(
            me,
            postId,
            dir,
            post.data.votes
          );
          if (isUpdated === true) {
            res.status(200).json({
              status: "success",
            });
          } else {
            res.status(304).json({
              status: "success",
            });
          }
        }
      } else {
        res.status(404).json({
          status: "fail",
          errorMessage: "Post Not Found",
        });
      }
    }
  };
  savePost = async (req, res, next) => {
    let me = req.user;
    let postId = req.params.postId;

    // check post is found
    let post = await this.postServices.findPostById(postId);
    if (post.success === true) {
      // check that author of block is not blocking me or i blocked him
     // console.log(post.data);
      let isUserBlockedMe = await this.userServices.checkBlockStatus(
        me,
        post.data.author
      );
      let isMeBlockedUser = await this.userServices.checkBlockStatus(
        post.data.author,
        me
      );
      if (isUserBlockedMe === true || isMeBlockedUser === true) {
        res.status(405).json({
          status: "fail",
          errorMessage: "Method Not Allowed",
        });
      } else {
        // add vote status of user
        let isUpdated = await this.postServices.savePost(me, postId);
        if (isUpdated === true) {
          res.status(200).json({
            status: "success",
          });
        } else {
          res.status(304).json({
            status: "success",
          });
        }
      }
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "Post Not Found",
      });
    }
  };
  unSavePost = async (req, res, next) => {
    let me = req.user;
    let postId = req.params.postId;

    // check post is found
    let post = await this.postServices.findPostById(postId);
    if (post.success === true) {
      // check that author of block is not blocking me or i blocked him
      //(post.data);
      let isUserBlockedMe = await this.userServices.checkBlockStatus(
        me,
        post.data.author
      );
      let isMeBlockedUser = await this.userServices.checkBlockStatus(
        post.data.author,
        me
      );
      if (isUserBlockedMe === true || isMeBlockedUser === true) {
        res.status(405).json({
          status: "fail",
          errorMessage: "Method Not Allowed",
        });
      } else {
        // add vote status of user
        let isUpdated = await this.postServices.unSavePost(me, postId);
        if (isUpdated === true) {
          res.status(200).json({
            status: "success",
          });
        } else {
          res.status(304).json({
            status: "success",
          });
        }
      }
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "Post Not Found",
      });
    }
  };
  hidePost = async (req, res, next) => {
    let me = req.user;
    let postId = req.params.postId;

    // check post is found
    let post = await this.postServices.findPostById(postId);
    if (post.success === true) {
      // check that author of block is not blocking me or i blocked him
     // console.log(post.data);
      let isUserBlockedMe = await this.userServices.checkBlockStatus(
        me,
        post.data.author
      );
      let isMeBlockedUser = await this.userServices.checkBlockStatus(
        post.data.author,
        me
      );
      if (isUserBlockedMe === true || isMeBlockedUser === true) {
        res.status(405).json({
          status: "fail",
          errorMessage: "Method Not Allowed",
        });
      } else {
        // add vote status of user
        let isUpdated = await this.postServices.hidePost(me, postId);
        if (isUpdated === true) {
          res.status(200).json({
            status: "success",
          });
        } else {
          res.status(304).json({
            status: "success",
          });
        }
      }
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "Post Not Found",
      });
    }
  };
  unHidePost = async (req, res, next) => {
    let me = req.user;
    let postId = req.params.postId;

    // check post is found
    let post = await this.postServices.findPostById(postId);
    if (post.success === true) {
      // check that author of block is not blocking me or i blocked him
      //console.log(post.data);
      let isUserBlockedMe = await this.userServices.checkBlockStatus(
        me,
        post.data.author
      );
      let isMeBlockedUser = await this.userServices.checkBlockStatus(
        post.data.author,
        me
      );
      if (isUserBlockedMe === true || isMeBlockedUser === true) {
        res.status(405).json({
          status: "fail",
          errorMessage: "Method Not Allowed",
        });
      } else {
        // add vote status of user
        let isUpdated = await this.postServices.unHidePost(me, postId);
        if (isUpdated === true) {
          res.status(200).json({
            status: "success",
          });
        } else {
          res.status(304).json({
            status: "success",
          });
        }
      }
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "Post Not Found",
      });
    }
  };
}

module.exports = PostController;
