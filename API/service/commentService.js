const { ConsoleReporter } = require("jasmine");
const { commentErrors } = require("../error_handling/errors");
const ObjectId = require("mongodb").ObjectId;

/**
 * Comment Service class for handling Comment model and services
 */
class CommentService {
  constructor({
    CommentRepository,
    PostRepository,
    NotificationRepository,
    UserRepository,
  }) {
    this.commentRepo = CommentRepository;
    this.postRepo = PostRepository;
    this.notificationRepo = NotificationRepository;
    this.userRepo = UserRepository;
  }

  /**
   * Checks if comment has a valid parent
   * Sets the post field of the comment according to its parent
   * @param {object} comment
   * @returns {boolean}
   */
  async hasValidParent(comment) {
    console.log("hellllllllllllllllllllllllllllll");
    if (comment.parentType === "Comment") {
      const validParent = await this.commentRepo.findById(
        comment.parent,
        "post locked",
        "post"
      );
      console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
     // console.log(validParent.doc);
      if (validParent.success) {
        comment.post = validParent.doc.post._id;
        return {
          success: true,
          post: validParent.doc.post,
          locked: validParent.doc.locked,
        };
      }
    } else if (comment.parentType === "Post") {
      const validParent = await this.postRepo.findById(
        comment.parent,
        "",
        "author owner"
      );
      console.log("oooooooooooooooooooooooooooo");
     // console.log(validParent);
      if (validParent.success) {
        comment.post = validParent.doc._id;
        return {
          success: true,
          post: validParent.doc,
          locked: validParent.doc.locked,
        };
      }
    }
    return { success: false };
  }


  //  async hasValidParent(comment) {
  //   if (comment.parentType === "Comment") {
  //     const validParent = await this.commentRepo.findById(
  //       comment.parent,
  //       "post",
  //       "post"
  //     );
  //     console.log("lllllllllllllllllllllllllllll");
  //     console.log(validParent);
  //      console.log("lllllllllllllllllllllllllllll");
  //     if (validParent.success) {
  //       comment.post = validParent.doc.post._id;
  //       return { success: true, post: validParent.doc.post };
  //     }
  //   } else if (comment.parentType === "Post") {
  //     const validParent = await this.postRepo.findById(comment.parent,"","author owner");
  //     console.log("lllllllllllllllllllllllllllll");
  //     console.log(validParent);
  //      console.log("lllllllllllllllllllllllllllll");
  //     if (validParent.success) {
  //       comment.post = validParent.doc._id;
  //       return { success: true, post: validParent.doc };
  //     }
  //   }
  //   return { success: false };
  // }

  /**
   * Creates a comment
   * After the comment creation it adds it to the replies of the parent and increments the replies count
   * @param {object} data - Comment data
   * @returns {object} - The created comment
   */
  async createComment(data) {
    const validParent = await this.hasValidParent(data);
    if (!validParent.success)
      return { success: false, error: commentErrors.INVALID_PARENT };

    if (validParent.locked)
      return { success: false, error: commentErrors.PARANT_LOCKED };

    const text = data.text.split(" ");
    const mentions = [];
    for (const word of text) {
      if (word.startsWith("u/")) {
        const userName = word.slice(2);
        const validUser = await this.userRepo.findByUserName(userName);

        if (validUser.success) mentions.push(userName);
      }
    }
    data.mentions = mentions;

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

    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
   // console.log(validParent.post);
     console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    let commentToNotify = {
      _id: comment.doc._id,
      text: comment.doc.text,
      type: comment.doc.parentType,
    };
    let postToNotify;
    console.log("heeeeeeeeeeeeeeeeeee");
    //console.log(validParent.post);
    if (validParent.post.ownerType == "Subreddit") {
      postToNotify = {
        _id: validParent.post._id,
        subreddit: {
          _id: validParent.post.owner._id,
          fixedName: validParent.post.owner.fixedName,
          name:validParent.post.owner.name
        },
        author: {
          _id: validParent.post.author._id,
        },
      };
    } else if (validParent.post.ownerType == "User") {
      console.log("in type post");
     // console.log(validParent);
      postToNotify = {
        _id: validParent.post._id,
        author: {
          _id: validParent.post.author._id,
          userName: validParent.post.author.userName,
        },
      };
    }
    return {
      success: true,
      data: comment.doc,
      postToNotify: postToNotify,
      commentToNotify: commentToNotify,
    };
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
    const comment = await this.commentRepo.exists(id);
    if (!comment.success)
      return { success: false, error: commentErrors.COMMENT_NOT_FOUND };

    const author = comment.doc.author;

    //validate the user
    if (!author.equals(userId))
      return { success: false, error: commentErrors.NOT_AUTHOR };

    //removes comment from its parent replies and decrement replies count
    // if (comment.doc.parentType === "Comment")
    //   await this.commentRepo.removeReply(comment.doc.parent, comment.doc._id);
    // else await this.postRepo.removeReply(comment.doc.parent, comment.doc._id);

    await this.commentRepo.deleteComment(id);

    return { success: true };
  }

  async commentTree(postId, limit, depth, sort, commentId) {
    const post = await this.postRepo.findById(postId, "_id replies");
    if (!post.success)
      return { success: false, error: commentErrors.POST_NOT_FOUND };

    if (!commentId) {
      const tree = await this.postRepo.commentTree(postId, limit, depth, sort);
      return { success: true, tree: tree.replies };
    } else {
      const comment = await this.commentRepo.commentTree(
        [commentId],
        limit,
        depth - 1
      );
      if (!comment)
        return { success: false, error: commentErrors.COMMENT_NOT_FOUND };

      if (!comment[0].post.equals(postId))
        return { success: false, error: commentErrors.COMMENT_NOT_CHILD };

      return { success: true, tree: comment };
    }
  }

  async moreChildren(children, limit, depth, sort) {
    //parse children and remove invalid ids
    children = children.split(",");
    children = children.filter((el) => ObjectId.isValid(el));

    return await this.commentRepo.commentTree(children, limit, depth - 1, sort);
  }

  setVoteCommentStatus(user, comments) {
    // create map of posts voted by user
    let newComments = Array.from(comments);
    let hash = {};
    for (var i = 0; i < user.voteComment.length; i++) {
      hash[user.voteComment[i].comments] =
        user.voteComment[i].commentVoteStatus;
    }
    // console.log(hash);
    // check if posts is in map then set in its object vote status with in user
    for (var i = 0; i < newComments.length; i++) {
      try {
        newComments[i] = newComments[i].toObject();
      } catch (err) {}
      if (!hash[comments[i]._id]) {
        newComments[i]["commentVoteStatus"] = 0;
        Object.assign(newComments[i], { commentVoteStatus: 0 });
      } else {
        newComments[i]["commentVoteStatus"] = hash[comments[i]._id];
        Object.assign(newComments[i], {
          commentVoteStatus: hash[comments[i]._id],
        });
      }
    }
    //console.log("new comments", newComments);
    return newComments;
  }
  setSavedCommentStatus(user, comments) {
    let newComments = Array.from(comments);

    let hash = {};
    for (var i = 0; i < user.savedComments.length; i++) {
      hash[user.savedComments[i].savedComment] =
        user.savedComments[i].savedComment;
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
  setVoteStatus(user, userComments) {
    let post = {};
    let commentTree = [];
    let createdAt = "";
    let hash = {};
    for (var i = 0; i < user.voteComment.length; i++) {
      hash[user.voteComment[i].comments] =
        user.voteComment[i].commentVoteStatus;
    }
    userComments.forEach((element) => {
      if (
        post._id === undefined ||
        post._id.toString() !== element.savedComment.post._id.toString()
      ) {
        if (
          post._id !== undefined &&
          post._id.toString() !== element.savedComment.post._id.toString()
        ) {
          commentTree.push({ savedComemnt: post, createdAt: createdAt });
        }
        post = {};
        createdAt = element.createdAt;
        //console.log(element.post);
        post["_id"] = element.savedComment.post._id;
        post["title"] = element.savedComment.post.title;
        // console.log("passed");
        post["author"] = {
          _id: element.savedComment.post.author._id,
          name: element.savedComment.post.author.userName,
        };
        post["ownerType"] = element.savedComment.post.ownerType;
        post["owner"] = {
          _id: element.savedComment.post.owner._id,
          name:
            element.savedComment.post.ownerType === "User"
              ? element.savedComment.post.owner.userName
              : element.savedComment.post.owner.fixedName,
          icon:
            element.savedComment.post.ownerType === "User"
              ? `${process.env.BACKDOMAIN}/` +
                element.savedComment.post.owner.profilePicture
              : element.savedComment.post.owner.icon,
        };
        post["text"] = element.savedComment.post.text;
        post["nsfw"] = element.savedComment.post.nsfw;
        post["flairId"] = element.savedComment.post.flairId;
        post["comments"] = [
          {
            _id: element.savedComment._id,
            mentions: element.savedComment.mentions,
            parent: element.savedComment.parent,
            parentType: element.savedComment.parentType,
            text: element.savedComment.text,
            createdAt: element.savedComment.createdAt,
            votes: element.savedComment.votes,
            repliesCount: element.savedComment.repliesCount,
            isDeleted: element.savedComment.isDeleted,
            author: {
              _id: element.savedComment.author._id,
              name: element.savedComment.author.userName,
              icon:
                `${process.env.BACKDOMAIN}/` +
                element.savedComment.author.profilePicture,
            },
            sortOnHot: element.savedComment.sortOnHot,
            commentVoteStatus: !hash[element.savedComment._id]
              ? 0
              : hash[comments[i]._id],
            isSaved: true,
          },
        ];
      } else {
        post["comments"].push({
          _id: element.savedComment._id,
          mentions: element.savedComment.mentions,
          parent: element.savedComment.parent,
          parentType: element.savedComment.parentType,
          text: element.savedComment.text,
          createdAt: element.savedComment.createdAt,
          votes: element.savedComment.votes,
          repliesCount: element.savedComment.repliesCount,
          isDeleted: element.savedComment.isDeleted,
          author: {
            _id: element.savedComment.author._id,
            name: element.savedComment.author.userName,
            icon:
              `${process.env.BACKDOMAIN}/` +
              element.savedComment.author.profilePicture,
          },
          sortOnHot: element.savedComment.sortOnHot,
          commentVoteStatus: !hash[element.savedComment._id]
            ? 0
            : hash[comments[i]._id],
          isSaved: true,
        });
      }
    });
    if (post._id !== undefined)
      commentTree.push({ savedComemnt: post, createdAt: createdAt });
    console.log("Treeeeeeeeeeeeeeee", commentTree);
    return commentTree.reverse();
  }

  async getUserComments(userId, user, query) {
    let data = await this.commentRepo.getUserComments(userId, query, "post");
    let post = {};
    let commentTree = [];
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
        post = element.post;
       // console.log(element.post);

        //console.log(element.post);
        // post["_id"] = element.post._id;
        // post["title"] = element.post.title;
        // console.log("passed");
        post["author"] = {
          _id: element.post.author._id,
          name: element.post.author.userName,
        };
        post["ownerType"] = element.post.ownerType;
        post["owner"] = {
          _id: element.post.owner._id,
          name:
            element.post.ownerType === "User"
              ? element.post.owner.userName
              : element.post.owner.fixedName,
          icon:
            element.post.ownerType === "User"
              ? `${process.env.BACKDOMAIN}/` + element.post.owner.profilePicture
              : element.post.owner.icon,
        };
        console.log("passed");
        // post["text"] = element.post.text;
        // post["nsfw"] = element.post.nsfw;
        // post["flairId"] = element.post.flairId;
        post["__v"] = undefined;
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
            author: {
              _id: element.author._id,
              name: element.author.userName,
            },
            sortOnHot: element.sortOnHot,
            commentVoteStatus: element.commentVoteStatus,
            isSaved: element.isSaved,
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
          author: {
            _id: element.author._id,
            name: element.author.userName,
          },
          sortOnHot: element.sortOnHot,
          commentVoteStatus: element.commentVoteStatus,
          isSaved: element.isSaved,
        });
      }
    });
    if (post._id !== undefined) commentTree.push(post);
    //console.log(commentTree);
    return commentTree;
  }
}

module.exports = CommentService;
