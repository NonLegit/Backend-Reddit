const { commentErrors } = require("../error_handling/errors");

/**
 * Comment Service class for handling Comment model and services
 */
class CommentService {
  constructor({ CommentRepository, PostRepository }) {
    this.commentRepo = CommentRepository;
    this.postRepo = PostRepository;
  }

  /**
   * Checks if comment has a valid parent
   * Sets the post field of the comment according to its parent
   * @param {object} comment
   * @returns {boolean}
   */
  async hasValidParent(comment) {
    if (comment.parentType === "Comment") {
      const validParent = await this.commentRepo.findById(
        comment.parent,
        "post"
      );
      if (validParent.success) {
        comment.post = validParent.doc.post;
        return true;
      }
    } else if (comment.parentType === "Post") {
      const validParent = await this.postRepo.findById(comment.parent, "_id");
      if (validParent.success) {
        comment.post = validParent.doc._id;
        return true;
      }
    }
    return false;
  }

  /**
   * Creates a comment
   * After the comment creation it adds it to the replies of the parent and increments the replies count
   * @param {object} data - Comment data
   * @returns {object} - The created comment
   */
  async createComment(data) {
    const validParent = await this.hasValidParent(data);
    if (!validParent)
      return { success: false, error: commentErrors.INVALID_PARENT };

    //create the comment
    const comment = await this.commentRepo.createOne(data);
    if (!comment.success)
      return {
        success: false,
        error: commentErrors.MONGO_ERR,
        msg: comment.msg,
      };

    //Add the comment in the replies of the parent
    if (comment.doc.parentType === "Comment")
      await this.commentRepo.addReply(comment.doc.parent, comment.doc._id);
    else await this.postRepo.addReply(comment.doc.parent, comment.doc._id);
    return { success: true, data: comment.doc };
  }

  /**
   * Updates the text of the comment with the given id
   * @param {string} id - Post ID
   * @param {object} data - The data data that shoud be updated namely, text
   * @returns {object} - Comment object after update
   */
  async updateComment(id, data, userId) {
    //validate comment ID
    const comment = await this.commentRepo.findById(id, "author");
    if (!comment.success)
      return { success: false, error: commentErrors.COMMENT_NOT_FOUND };

    const author = comment.doc.author;

    //validate the user
    if (!author.equals(userId))
      return { success: false, error: commentErrors.NOT_AUTHOR };

    const updatedComment = await this.commentRepo.updateText(id, data.text);
    return { success: true, data: updatedComment.doc };
  }

  /**
   * Deletes a Comment with the given id
   * Soft-delete is used to ensure data integrity
   * The delete effect is cascaded to all the child comments using mongoose middlewares
   * The comment is removed from the replies of its parent and replies count is decremented
   * @param {string} id - Post ID
   */
  async deleteComment(id, userId) {
    //validate comment ID
    const comment = await this.commentRepo.findById(
      id,
      "author parent parentType"
    );
    if (!comment.success)
      return { success: false, error: commentErrors.COMMENT_NOT_FOUND };

    const author = comment.doc.author;

    //validate the user
    if (!author.equals(userId))
      return { success: false, error: commentErrors.NOT_AUTHOR };

    //removes comment from its parent replies and decrement replies count
    if (comment.doc.parentType === "Comment")
      await this.commentRepo.removeReply(comment.doc.parent, comment.doc._id);
    else await this.postRepo.removeReply(comment.doc.parent, comment.doc._id);

    await this.commentRepo.deleteComment(id);

    return { success: true };
  }

  async commentTree(postId, limit, depth, commentId) {
    const post = await this.postRepo.findById(postId, "_id replies");
    if (!post.success)
      return { success: false, error: commentErrors.POST_NOT_FOUND };

    if (!commentId) {
      const tree = await this.postRepo.commentTree(postId, limit, depth);
      return { success: true, tree: tree.replies };
    } else {
      const comment = await this.commentRepo.commentTree(
        commentId,
        limit,
        depth
      );
      if (!comment)
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };

      const replies = post.doc.replies;
      if (!replies.includes(commentId))
        return { success: false, error: commentErrors.COMMENT_NOT_CHILD };

      return { success: true, tree: comment };
    }
  }
}

module.exports = CommentService;
