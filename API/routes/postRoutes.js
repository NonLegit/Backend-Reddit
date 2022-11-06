const express = require("express");
const postController = require("../controllers/postController");

const postControllerObj = new postController();

const router = express.Router();

router.route("/").post(postControllerObj.createPost());
router
  .route("/:postID")
  .patch(postControllerObj.updatePost())
  .delete(postControllerObj.deletePost());

module.exports = router;
