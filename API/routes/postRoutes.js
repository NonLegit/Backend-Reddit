const express = require("express");
const PostController = require("../controllers/postController");
const Repository = require("../data_access/repository");
const PostService = require("../service/postService");
const Post = require("../models/postModel");

const postRepoObj = new Repository(Post);
const postServiceObj = new PostService(Post, postRepoObj);
const postControllerObj = new PostController(postServiceObj);

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

router.route("/").post(postControllerObj.createPost);
router
  .route("/:postId")
  .patch(postControllerObj.updatePost)
  .delete(postControllerObj.deletePost);

module.exports = router;
