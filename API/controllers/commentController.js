const { commentErrors } = require("../error_handling/errors");

class CommentController {
  constructor({ CommentService, UserService }) {
    this.commentServices = CommentService;
    this.UserService = UserService;
  }
  bls =(req, res) => {
    console.log(req);
    return;
}
  createComment = async (req, res,next) => {
    const data = req.body;
    data.author = req.user._id;

    //validate request
    if (!data.parent || !data.parentType || !data.text) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return ;
    }

    const comment = await this.commentServices.createComment(data);

    if (!comment.success) {
      let msg, stat;
      switch (comment.error) {
        case commentErrors.INVALID_PARENT:
          msg = "Invalid parent, couldn't create comment";
          stat = 404;
          break;
        case commentErrors.PARANT_LOCKED:
          msg = "Parent is locked, comments are not allowed";
          stat = 409;
          break;
        case commentErrors.MONGO_ERR:
          msg = comment.msg;
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
     
      return ;
    }
    req.comment = comment.commentToNotify;
    req.post = comment.postToNotify;
    //console.log(req);
    res.status(201).json({
      status: "success",
      data: comment.data,
    });
    //console.log(req.comment.type);
    if (req.comment.type == "Post")
      return next();
    else
      return;
    //mentions
  };

  updateComment = async (req, res) => {
    //validate request params
    const id = req.params?.commentId;
    const data = req.body;
    if (!id || !data.text) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    const comment = await this.commentServices.updateComment(
      id,
      data,
      req.user._id
    );

    if (!comment.success) {
      let msg, stat;
      switch (comment.error) {
        case commentErrors.NOT_AUTHOR:
          msg = "User must be author";
          stat = 401;
          break;
        case commentErrors.COMMENT_NOT_FOUND:
          msg = "Comment not found";
          stat = 404;
          break;
        case commentErrors.MONGO_ERR:
          msg = comment.msg;
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
      data: comment.data,
    });
  };
//   bla =(req,res)=> {
//     console.log("nnnnnnnnnnnnnnnnnn");
//     console.log(response);
//     return;
// }
  deleteComment = async (req, res) => {
    //validate request params
    const id = req.params?.commentId;
    if (!id) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter commentId",
      });
      return;
    }

    const comment = await this.commentServices.deleteComment(id, req.user._id);

    if (!comment.success) {
      let msg, stat;
      switch (comment.error) {
        case commentErrors.NOT_AUTHOR:
          msg = "User must be author";
          stat = 401;
          break;
        case commentErrors.COMMENT_NOT_FOUND:
          msg = "Comment not found";
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

  commentTree = async (req, res) => {
    const LIMIT = 2;
    const DEPTH = 3;
    const CONTEXT = 2;
    const SORT = "createdAt";
    const sortTypes = new Map([
      ["new", "createdAt"],
      ["top", "votes"],
      ["hot", "sortOnHot"],
    ]);

    const postId = req.params?.postId;
    if (!postId) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    let { limit, depth, context, sort, commentId } = req.query;
    if (!limit || limit <= 0) limit = LIMIT;
    if (!depth || depth < 0) depth = DEPTH;
    sort = sortTypes.get(sort) || SORT;

    const commentTree = await this.commentServices.commentTree(
      postId,
      limit,
      depth,
      sort,
      commentId
    );

    if (!commentTree.success) {
      let msg,
        stat = 404;
      switch (commentTree.error) {
        case commentErrors.COMMENT_NOT_FOUND:
          msg = "Comment not found";
          break;
        case commentErrors.POST_NOT_FOUND:
          msg = "Post not found";
          break;
        case commentErrors.COMMENT_NOT_CHILD:
          msg = "Comment is not a child of post";
          stat = 400;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      comments: commentTree.tree,
    });
  };

  moreChildren = async (req, res) => {
    const LIMIT = 2;
    const DEPTH = 3;
    const SORT = "createdAt";
    const sortTypes = new Map([
      ["new", "createdAt"],
      ["top", "votes"],
      ["hot", "sortOnHot"],
    ]);

    let { children, limit, depth, sort } = req.query;
    if (!limit || limit <= 0) limit = LIMIT;
    if (!depth || depth < 0) depth = DEPTH;
    sort = sortTypes.get(sort) || SORT;

    if (!children || children.length === 0) {
      res.status(400).json({
        status: "fail",
        message: "Children query parameter is required",
      });
      return true;
    }

    const comments = await this.commentServices.moreChildren(
      children,
      limit,
      depth,
      sort
    );

    if (comments.length === 0) {
      res.status(404).json({
        status: "fail",
        message: "Comments not found",
      });
    }
    res.status(200).json({
      status: "success",
      comments: comments,
    });
  };

  getUserComments = async (req, res, next) => {
    const me = req.user;
    let userName = req.params.userName;
    let valid = true;
    let userId = me._id;
    if (userName !== me.userName) {
      // find user if not found return not found
      let user = await this.UserService.getUserByName(userName, "");
      if (user.success === true) {
        valid = true;
        userId = user.data._id;
      } else {
        valid = false;
      }
    }
    if (valid) {
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
      let posts = await this.commentServices.getUserComments(userId, me, query);

      res.status(200).json({
        status: "success",
        posts: posts,
      });
    } else {
      res.status(404).json({
        status: "fail",
        errorMessage: "User Not Found",
      });
    }
  };
}

module.exports = CommentController;
