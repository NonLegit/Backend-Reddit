const ObjectId = require("mongodb").ObjectId;

/**
 * Comment Service class for handling Comment model and services
 */
class CommentService {
  constructor(Comment, commentRepo, postRepo) {
    this.Comment = Comment;
    this.commentRepo = commentRepo;
    this.postRepo = postRepo;

    this.hasValidParent = this.hasValidParent.bind(this);
    this.isValidId = this.isValidId.bind(this);
    this.isAuthor = this.isAuthor.bind(this);
    this.createComment = this.createComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  /**
   * Checks if comment has a valid parent
   * Sets the post field of the comment according to its parent
   * @param {object} comment
   * @returns {boolean}
   */
  async hasValidParent(comment) {
    if (comment.parentType === "Comment") {
      const validParent = await this.commentRepo.getById(
        comment.parent,
        "post"
      );
      if (validParent) {
        comment.post = validParent.post;
        return true;
      }
    } else if (comment.parentType === "Post") {
      const validParent = await this.postRepo.getById(comment.parent, "_id");
      if (validParent) {
        comment.post = validParent._id;
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
    //create the comment
    const comment = (await this.commentRepo.createOne(data)).doc;

    //Add the comment in the replies of the parent
    if (comment.parentType === "Comment") {
      await this.commentRepo.updateOne(
        { _id: comment.parent },
        { $push: { replies: comment._id }, $inc: { repliesCount: 1 } }
      );
    } else {
      await this.postRepo.updateOne(
        { _id: comment.parent },
        { $push: { replies: comment._id }, $inc: { commentCount: 1 } }
      );
    }
    return comment;
  }

  /**
   * Checks if the user is the post author
   * assumes postId is valid
   * @param {string} postId
   * @param {string} userId 
   * @returns {boolean}
   */
  async isAuthor(commentId, userId) {
    const author = (await this.commentRepo.getById(commentId, "author")).author;
    return author.equals(userId);
  }

  /**
   * Validates post id
   * @param {string} id - Post id
   * @returns {boolean}
   */
  async isValidId(id) {
    if (!ObjectId.isValid(id)) return false;
    const doc = await this.commentRepo.getById(id, "_id");
    if (!doc) return false;
    return true;
  }

    /**
   * Updates the text of the comment with the given id
   * @param {string} id - Post ID
   * @param {object} data - The data data that shoud be updated namely, text
   * @returns {object} - Comment object after update
   */
  async updateComment(id, data) {
    const comment = (await this.commentRepo.updateOne({ _id: id }, data)).doc;
    return comment;
  }

    /**
   * Deletes a Comment with the given id
   * Soft-delete is used to ensure data integrity
   * The delete effect is cascaded to all the child comments using mongoose middlewares
   * The comment is removed from the replies of its parent and replies count is decremented
   * @param {string} id - Post ID
   */
  async deleteComment(id) {
    const comment = await this.commentRepo.getById(id, "parent parentType");

    //await this.commentRepo.deleteOne(id);
    await this.commentRepo.updateOne({ _id: id }, { isDeleted: true });

    if (comment.parentType === "Comment") {
      await this.commentRepo.updateOne(
        { _id: comment.parent },
        {
          $pull: { replies: id },
          $inc: { repliesCount: -1 },
        }
      );
    } else {
      await this.postRepo.updateOne(
        { _id: comment.parent },
        {
          $pull: { replies: id },
          $inc: { commentCount: -1 },
        }
      );
    }
  }
}

module.exports = CommentService;
