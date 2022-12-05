const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const subredditController = container.resolve("subredditController");
const PostController = container.resolve("PostController");
//const userControllerObj = require("./test");
// 
const router = express.Router();

// test data models




router.get('/:subredditName/top', AuthenticationController.checkAuthorize,subredditController.getSubredditId,PostController.getTopPosts);
router.get('/:subredditName/new',AuthenticationController.checkAuthorize,subredditController.getSubredditId, PostController.getNewPosts);
router.get('/:subredditName/hot',AuthenticationController.checkAuthorize,subredditController.getSubredditId, PostController.getHotPosts);


router.route('/:subredditName/flair').get(subredditController.getFlairs);
router.use(AuthenticationController.authorize);

router.post("/", subredditController.createSubreddit);
router.patch("/:subredditName", subredditController.updateSubredditSettings);
router.get("/:subredditName", subredditController.getSubredditSettings);
router.delete("/:subredditName", subredditController.deleteSubreddit);

//router.get("/:subredditName/about/:location",subredditControllerObj.relevantPosts);
// router.get("/mine/:where",subredditControllerObj)


//router.get('/:subredditName/trending', postControllerObj.getTrendingPosts);


router.route('/:subredditName/flair')
  .post(subredditController.createFlair);
   
router.route('/:subredditName/flair/:flairId')
    .get(subredditController.getFlair)
    .patch(subredditController.updateFlair)
    .delete(subredditController.deleteFlair);
router.get(
  "/:subredditName/about/:location",
  subredditController.relevantPosts
);
router.get("/mine/:where", subredditController.subredditsJoined);
router.get("/moderator/:username", subredditController.sibredditsModerated);
// router.post(
//   "/:subredditName/moderator/:moderatorName",
//   subredditController.inviteModerator
// );
// router.delete(
//   "/:subredditName/moderator/:moderatorName",
//   subredditController.deletemoderator
// );
// router.patch(
//   "/:subredditName/moderator/:moderatorName",
//   subredditController.updatePermissions
// );
// router.patch("/:subredditName/setPrimaryTopic",subredditController.setPrimaryTopic);

router
  .route("/:subredditName/flair")
  .post(subredditController.createFlair)
  .get(subredditController.getFlairs);
router
  .route("/:subredditName/flair/:flairId")
  .get(subredditController.getFlair)
  .patch(subredditController.updateFlair)
  .delete(subredditController.deleteFlair);

router
  .route("/:subredditName/subscribe")
  .post(subredditController.subscribe);

module.exports = router;

//const subredditController = require("./../controllers/subredditController");
// const postController = require("./../controllers/postController");

// const Subreddit = require("./../models/subredditModel");
// const Repository = require("./../data_access/repository");
// const subredditService = require("../service/subredditService");
// // !=================================
// const postService = require("../service/postService");
// const Post = require('./../models/postModel');//model
// const PostRepositoryObj = new Repository(Post);//dataaccedss send model
// const postServiceObj = new postService(Post, PostRepositoryObj);


// // !================================
// const SubredditRepositoryObj = new Repository(Subreddit);
// //const subredditController = require("./../controllers/subredditController");
// // !=================================
// const AuthenticationController = require("./../controllers/AuthenticationController");
// const User = require("./../models/userModel");
// const UserService = require("./../service/userService");
// const UserRepositoryObj = new Repository(User);
// // !=================================
// const Flair = require("./../models/flairModel"); //model
// const FlairRepositoryObj = new Repository(Flair); //dataaccedss send model
// const subredditServiceObj = new subredditService(
//   Subreddit,
//   SubredditRepositoryObj,
//   Flair,
//   FlairRepositoryObj,
//   User,
//   UserRepositoryObj
// );



// /////////////////////////////////////////////

// const userServiceObj = new UserService(User, UserRepositoryObj, null);

// const postControllerObj = new postController(postServiceObj,userServiceObj);
// const authenticationControllerObj = new AuthenticationController(
//   userServiceObj
// );

// const subredditControllerObj = new subredditController(
//   subredditServiceObj,
//   userServiceObj
// );
