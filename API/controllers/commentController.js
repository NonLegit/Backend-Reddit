class CommentController {
  constructor(commentServices) {
    this.commentServices = commentServices;

    this.createComment = this.createComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async createComment(req, res) {
    try {
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

      //check if comment has a valid parent and sets postId of comment
      const validParent = await this.commentServices.hasValidParent(data);
      if (!validParent) {
        res.status(404).json({
          status: "fail",
          message: "Parent not found or invalid",
        });
        return;
      }

      const comment = await this.commentServices.createComment(data);

      res.status(201).json({
        status: "success",
        comment,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "Internal server error" + err,
      });
    }

    //mentions
  }

  async updateComment(req, res) {
    try {
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
      const validId = await this.commentServices.isValidId(id);
      if (!validId) {
        res.status(404).json({
          status: "fail",
          err: "Comment not found",
        });
        return;
      }

      //validate the user
      if (!(await this.commentServices.isAuthor(id, req.user._id))) {
        res.status(401).json({
          status: "fail",
          err: "User must be author",
        });
        return;
      }

      const comment = await this.commentServices.updateComment(id, data);
      res.status(200).json({
        status: "success",
        data: comment,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "fail",
        message: "Internal server error" + err,
      });
    }
  }

  async deleteComment(req, res) {
    try {
      //validate request params
      const id = req.params.commentId;
      if (!id) {
        res.status(400).json({
          status: "fail",
          message: "Missing required parameter commentId",
        });
        return;
      }
      const validId = await this.commentServices.isValidId(id);
      if (!validId) {
        res.status(404).json({
          status: "fail",
          err: "Comment not found",
        });
        return;
      }

      //validate the user
      if (!(await this.commentServices.isAuthor(id, req.user._id))) {
        res.status(401).json({
          status: "fail",
          err: "User must be author",
        });
        return;
      }

      await this.commentServices.deleteComment(id);
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
}

module.exports = CommentController;
