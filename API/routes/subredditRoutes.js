const express = require("express");
//const userControllerObj = require("./test");
const subredditController = require("./../controllers/subredditController");
const postController = require("./../controllers/postController");

const Subreddit = require("./../models/subredditModel");
const Repository = require("./../data_access/repository");
const subredditService = require("../service/subredditService");
// !=================================
const postService = require("../service/postService");
const Post = require('./../models/postModel');//model
const PostRepositoryObj = new Repository(Post);//dataaccedss send model
const postServiceObj = new postService(Post, PostRepositoryObj);


// !================================
const SubredditRepositoryObj = new Repository(Subreddit);
const subredditController = require("./../controllers/subredditController");
// !=================================
const AuthenticationController = require("./../controllers/AuthenticationController");
const User = require("./../models/userModel");
const UserService = require("./../service/userService");
const UserRepositoryObj = new Repository(User);
// !=================================
const Flair = require("./../models/flairModel"); //model
const FlairRepositoryObj = new Repository(Flair); //dataaccedss send model
const subredditServiceObj = new subredditService(
  Subreddit,
  SubredditRepositoryObj,
  Flair,
  FlairRepositoryObj,
  User,
  UserRepositoryObj
);



/////////////////////////////////////////////

const userServiceObj = new UserService(User, UserRepositoryObj, null);

const postControllerObj = new postController(postServiceObj,userServiceObj);
const authenticationControllerObj = new AuthenticationController(
  userServiceObj
);

const subredditControllerObj = new subredditController(
  subredditServiceObj,
  userServiceObj
);

const router = express.Router();

// test data models
router.use(authenticationControllerObj.authorize);
router.post("/", subredditControllerObj.createSubreddit);
router.patch("/:subredditName", subredditControllerObj.updateSubredditSettings);
router.get("/:subredditName", subredditControllerObj.getSubredditSettings);
router.delete("/:subredditName", subredditControllerObj.deleteSubreddit);

//router.get("/:subredditName/about/:location",subredditControllerObj.relevantPosts);
// router.get("/mine/:where",subredditControllerObj)


//router.get('/:subredditName/trending', postControllerObj.getTrendingPosts);
router.get('/:subredditName/top', subredditControllerObj.getSubredditId,postControllerObj.getTopPosts);
router.get('/:subredditName/new',subredditControllerObj.getSubredditId, postControllerObj.getNewPosts);
router.get('/:subredditName/hot',subredditControllerObj.getSubredditId, postControllerObj.getHotPosts);


router.route('/:subredditName/flair')
    .post(subredditControllerObj.createFlair)
   .get(subredditControllerObj.getFlairs);
router.route('/:subredditName/flair/:flairId')
    .get(subredditControllerObj.getFlair)
    .patch(subredditControllerObj.updateFlair)
    .delete(subredditControllerObj.deleteFlair);
router.get(
  "/:subredditName/about/:location",
  subredditControllerObj.relevantPosts
);
router.get("/mine/:where", subredditControllerObj.subredditsJoined);
router.post(
  "/:subredditName/moderator/:moderatorName",
  subredditControllerObj.inviteModerator
);
router.delete(
  "/:subredditName/moderator/:moderatorName",
  subredditControllerObj.deletemoderator
);
router.patch(
  "/:subredditName/moderator/:moderatorName",
  subredditControllerObj.updatePermissions
);
// router.patch("/:subredditName/setPrimaryTopic",subredditController.setPrimaryTopic);

router
  .route("/:subredditName/flair")
  .post(subredditControllerObj.createFlair)
  .get(subredditControllerObj.getFlairs);
router
  .route("/:subredditName/flair/:flairId")
  .get(subredditControllerObj.getFlair)
  .patch(subredditControllerObj.updateFlair)
  .delete(subredditControllerObj.deleteFlair);

router
  .route("/:subredditName/subscribe")
  .post(subredditControllerObj.subscribe);

module.exports = router;
