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
  setVoteCommentStatus(user, comments) {
    // create map of posts voted by user
    let newComments = Array.from(comments);
    let hash = {};
    for (var i = 0; i < user.voteComment.length; i++) {
      hash[user.voteComment[i].posts] = user.voteComment[i].commentVoteStatus;
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newComments.length; i++) {
      try {
        newComments[i] = newComments[i].toObject();
      } catch (err) {}
      if (!hash[comments[i]._id]) {
        newComments[i]["commentVoteStatus"] = "0";
        Object.assign(newComments[i], { commentVoteStatus: "0" });
      } else {
        newComments[i]["commentVoteStatus"] = hash[comments[i]._id];
        Object.assign(newComments[i], {
          commentVoteStatus: hash[comments[i]._id],
        });
      }
    }
    console.log("new comments", newComments);
    return newComments;
  }
  setSavedCommentStatus(user, comments) {
    let newComments = Array.from(comments);

    let hash = {};
    for (var i = 0; i < user.savedComment.length; i++) {
      hash[user.savedComment[i]] = user.savedComment[i];
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newComments.length; i++) {
      try {
        newComments[i] = newComments[i].toObject();
      } catch (err) {}
      if (hash[comments[i]._id]) {
        newComments[i]["isSaved"] = true;
        //Object.assign(newPosts[i], {postVoteStatus: "0"});
      } else {
        newComments[i]["isSaved"] = false;
        //Object.assign(newPosts[i], {postVoteStatus: hash[posts[i]._id]});
      }
    }
    return newComments;
  }
  async getUserComments(userId, user, query) {
    let data = await this.commentRepo.getUserComments(userId, query, "post");
    let post = {};
    let commentTree = [];
    //console.log(comments);
    let comments = this.setVoteCommentStatus(user, data.doc);
    comments - this.setSavedCommentStatus(user, comments);
    comments.forEach((element) => {
      if (
        post._id === undefined ||
        post._id.toString() !== element.post._id.toString()
      ) {
        if (
          post._id !== undefined &&
          post._id.toString() !== element.post._id.toString()
        ) {
          commentTree.push(post);
        }
        post = {};
        //console.log(element.post);
        post["_id"] = element.post._id;
        post["title"] = element.post.title;
        // console.log("passed");
        post["author"] = {
          _id: element.post.author._id,
          name: element.post.author.userName,
        };
        console.log("passed");
        post["text"] = element.post.text;
        post["nsfw"] = element.post.nsfw;
        post["comments"] = [
          {
            _id: element._id,
            mentions: element.mentions,
            parent: element.parent,
            parentType: element.parentType,
            text: element.text,
            createdAt: element.createdAt,
            votes: element.votes,
            repliesCount: element.repliesCount,
            isDeleted: element.isDeleted,
            author: element.author,
            commentVoteStatus: element.commentVoteStatus,
            isSaved:element.isSaved,
          },
        ];
      } else {
        post["comments"].push({
          _id: element._id,
          mentions: element.mentions,
          parent: element.parent,
          parentType: element.parentType,
          text: element.text,
          createdAt: element.createdAt,
          votes: element.votes,
          repliesCount: element.repliesCount,
          isDeleted: element.isDeleted,
          author: element.author,
          commentVoteStatus: element.commentVoteStatus,
          isSaved:element.isSaved,
        });
      }
    });
    if (post._id !== undefined) commentTree.push(post);
    //console.log(commentTree);
    return commentTree;
  }
}

module.exports = CommentService;
