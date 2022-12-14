const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const subredditController = container.resolve("subredditController");
const PostController = container.resolve("PostController");
//const userControllerObj = require("./test");
//
const router = express.Router();

// test data models

router.get(
  "/:subredditName/top",
  AuthenticationController.checkAuthorize,
  subredditController.getSubredditId,
  PostController.getTopPosts
);
router.get(
  "/:subredditName/new",
  AuthenticationController.checkAuthorize,
  subredditController.getSubredditId,
  PostController.getNewPosts
);
router.get(
  "/:subredditName/hot",
  AuthenticationController.checkAuthorize,
  subredditController.getSubredditId,
  PostController.getHotPosts
);

router.route("/:subredditName/flair").get(subredditController.getFlairs);
router.use(AuthenticationController.authorize);

router.post("/", subredditController.createSubreddit);
router.patch("/:subredditName", subredditController.updateSubredditSettings);
router.get("/:subredditName", subredditController.getSubredditSettings);
router.delete("/:subredditName", subredditController.deleteSubreddit);

//router.get("/:subredditName/about/:location",subredditControllerObj.relevantPosts);

router.route("/:subredditName/flair").post(subredditController.createFlair);

router
  .route("/:subredditName/flair/:flairId")
  .get(subredditController.getFlair)
  .patch(subredditController.updateFlair)
  .delete(subredditController.deleteFlair);
router.get(
  "/:subredditName/about/:location",
  subredditController.relevantPosts
);
router.get("/mine/:where", subredditController.subredditsJoined);
router.get("/moderator/:username", subredditController.subredditsModerated);

router.post(
  "/:subredditName/moderators/:moderatorName",
  subredditController.inviteModerator
);
router.post(
  "/:subredditName/:action/invitation",
  subredditController.ModeratorInvitation
);
router.delete(
  "/:subredditName/moderator/:moderatorName",
  subredditController.deletemoderator
);
router.patch(
  "/:subredditName/moderator/:moderatorName",
  subredditController.updatePermissions
);
router.get("/:subredditName/moderators", subredditController.getModerators);
router.post(
  "/:subredditName/leave_moderator",
  subredditController.leaveModerator
);
router.post("/:subredditName/favourite", subredditController.Favourite);
router.get(
  "/favourites/get_subreddits",
  subredditController.favouriteSubreddits
);

router.post(
  "/:subredditName/ban_settings/:action/:userName",
  subredditController.banSettings
);
router.get("/:subredditName/banned", subredditController.bannedUsers);
router.get("/:subredditName/muted", subredditController.mutedUsers);

router.post(
  "/:subredditName/mute_settings/:action/:userName",
  subredditController.muteSettings
);

router.post("/:subredditName/rules/:title", subredditController.addRule);
router.patch("/:subredditName/rules/:title", subredditController.editRule);
router.delete("/:subredditName/rules/:title", subredditController.deleteRule);

router.get(
  "/:subredditName/about/posts/:location",
  subredditController.modPosts
);

router.get("/leaderboard/:category", subredditController.leaderboardCategory);
router.get("/random/leaderboard", subredditController.leaderboardRandom);

router
  .route("/:subredditName/flair")
  .post(subredditController.createFlair)
  .get(subredditController.getFlairs);
router
  .route("/:subredditName/flair/:flairId")
  .get(subredditController.getFlair)
  .patch(subredditController.updateFlair)
  .delete(subredditController.deleteFlair);

router.route("/:subredditName/subscribe").post(subredditController.subscribe);

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
