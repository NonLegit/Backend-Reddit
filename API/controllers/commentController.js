const { commentErrors } = require("../error_handling/errors");

class CommentController {
  constructor({ CommentService, UserService }) {
    this.commentServices = CommentService;
    this.UserService = UserService;
  }

  createComment = async (req, res) => {
    const data = req.body;
    data.author = req.user._id;

    //validate request
    if (!data.parent || !data.parentType || !data.text) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
      });
      return;
    }

    const comment = await this.commentServices.createComment(data);

    if (!comment.success) {
      let msg, stat;
      switch (comment.error) {
        case commentErrors.INVALID_PARENT:
          msg = "Invalid parent, couldn't create comment";
          stat = 404;
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
      return;
    }

    res.status(201).json({
      status: "success",
      data: comment.data,
    });

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
          sort = "-createdAt";
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
      let posts = await this.commentServices.getUserComments(userId,me, query);

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
