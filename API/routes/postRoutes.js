const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const PostController = container.resolve("PostController");
const FileController = container.resolve("FileController");

const router = express.Router();

router.get("/:postId", AuthenticationController.checkAuthorize, PostController.getPost);
router.get("/images/:fileName", FileController.getPostImage);
router.use(AuthenticationController.authorize);

router.route("/").post(PostController.createPost);
router
  .route("/:postId")
  .patch(PostController.updatePost)
  .delete(PostController.deletePost);

module.exports = router;

// const PostController = require("../controllers/postController");
// const Repository = require("../data_access/repository");
// const PostService = require("../service/postService");
// const Post = require("../models/postModel");
// const Subreddit = require("../models/subredditModel");
// const Flair = require("../models/flairModel");

// const postRepoObj = new Repository(Post);
// const subredditRepoObj = new Repository(Subreddit);
// const flairRepoObj = new Repository(Flair);
// const postServiceObj = new PostService(
//   Post,
//   postRepoObj,
//   subredditRepoObj,
//   flairRepoObj
// );
// //using authorization functionality
// const AuthenticationContoller = require("../controllers/authenticationController");
// const User = require("./../models/userModel");
// const UserService = require("./../service/userService");
// const Email = require("./../service/emailService");
// const userRepoObj = new Repository(User);
// const emailServiceObj = new Email();
// const userServiceObj = new UserService(User, userRepoObj, emailServiceObj);
// const authentControllerObj = new AuthenticationContoller(userServiceObj);

// const postControllerObj = new PostController(postServiceObj, userServiceObj);
