const ObjectId = require("mongodb").ObjectId;

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

  //validates parent and sets postId of the comment accordingly
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

  //Assumes commentId is valid
  async isAuthor(commentId, userId) {
    const author = (await this.commentRepo.getById(commentId, "author")).author;
    return author.equals(userId);
  }

  async isValidId(id) {
    if (!ObjectId.isValid(id)) return false;
    const doc = await this.commentRepo.getById(id, "_id");
    if (!doc) return false;
    return true;
  }

  async updateComment(id, data) {
    const comment = (await this.commentRepo.updateOne({ _id: id }, data)).doc;
    return comment;
  }

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
