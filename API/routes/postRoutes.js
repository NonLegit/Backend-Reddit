const express = require("express");
const PostController = require("../controllers/postController");
const Repository = require("../data_access/repository");
const PostService = require("../service/postService");
const Post = require("../models/postMddel");

const postRepoObj = new Repository(Post);
const postServiceObj = new PostService(Post, postRepoObj);
const postControllerObj = new PostController(postServiceObj);

const router = express.Router();

router.route("/").post(postControllerObj.createPost);
router
    .route("/:postId")
    .patch(postControllerObj.updatePost)
    .delete(postControllerObj.deletePost);

module.exports = router;
