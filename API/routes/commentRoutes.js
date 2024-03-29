const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const CommentController = container.resolve("CommentController");
const NotificationController = container.resolve("NotificationController");
const MessageController = container.resolve("MessageController");
const router = express.Router();

router.use(AuthenticationController.authorize);

router
  .route("/")
  .post(
    CommentController.createComment,
    NotificationController.addReplyNotification,
    MessageController.createReplyMessage
  );
router
  .route("/:commentId")
  .patch(CommentController.updateComment)
  .delete(CommentController.deleteComment);

router.post("/:commentId/vote", CommentController.commentVote);
router.post("/:commentId/save", CommentController.saveComment);
router.post("/:commentId/unsave", CommentController.unSaveComment);
router.route("/comment_tree/:postId").get(CommentController.commentTree);
router.route("/more_children").get(CommentController.moreChildren);
router
  .route("/:commentId/moderate/:action")
  .patch(CommentController.mustBeMod, CommentController.moderateComment);

module.exports = router;

// const CommentController = require("../controllers/commentController");
// const Repository = require("../data_access/repository");
// const CommentService = require("../service/commentService");
// const Comment = require("../models/commentModel");
// const Post = require("../models/postModel");

// const commentRepoObj = new Repository(Comment);
// const postRepoObj = new Repository(Post);
// const commentServiceObj = new CommentService(Comment, commentRepoObj, postRepoObj);
// const commentControllerObj = new CommentController(commentServiceObj);

// //using authorization functionality
// const AuthenticationContoller = require("../controllers/authenticationController");
// const User = require("./../models/userModel");
// const UserService = require("./../service/userService");
// const Email = require("./../service/emailService");
// const userRepoObj = new Repository(User);
// const emailServiceObj = new Email();
// const userServiceObj = new UserService(User, userRepoObj, emailServiceObj);
// const authentControllerObj = new AuthenticationContoller(userServiceObj);
