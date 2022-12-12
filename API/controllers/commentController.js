const { commentErrors } = require("../error_handling/errors");

class CommentController {
  constructor({ CommentService }) {
    this.commentServices = CommentService;
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
    return next();
    //mentions
  };

  updateComment = async (req, res) => {
    //validate request params
    const id = req.params.commentId;
    const data = req.body;
    if (!id || !data.text) {
      res.status(400).json({
        status: "fail",
        message: "Missing required parameter",
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
    const id = req.params.commentId;
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
}

module.exports = CommentController;
