const express = require("express");
const CommentController = require("../controllers/commentController");
const Repository = require("../data_access/repository");
const CommentService = require("../service/commentService");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const commentRepoObj = new Repository(Comment);
const postRepoObj = new Repository(Post);
const commentServiceObj = new CommentService(Comment, commentRepoObj, postRepoObj);
const commentControllerObj = new CommentController(commentServiceObj);

//using authorization functionality
const AuthenticationContoller = require("../controllers/authenticationController");
const User = require("./../models/userModel");
const UserService = require("./../service/userService");
const Email = require("./../service/emailService");
const userRepoObj = new Repository(User);
const emailServiceObj = new Email();
const userServiceObj = new UserService(User, userRepoObj, emailServiceObj);
const authentControllerObj = new AuthenticationContoller(userServiceObj);

const router = express.Router();

router.use(authentControllerObj.authorize);

router.route("/").post(commentControllerObj.createComment);
router
  .route("/:commentId")
  .patch(commentControllerObj.updateComment)
  .delete(commentControllerObj.deleteComment);

module.exports = router;
