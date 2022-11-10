const express = require("express");
const Subreddit = require("./../models/subredditModel");
const User = require("./../models/userModel");
const Flair = require("./../models/flairModel");
const Repository = require("./../data_access/repository");
const subredditService = require("../service/subredditService");
const UserService = require("./../service/userService");
const subredditController = require("./../controllers/subredditController");
const AuthenticationController = require("./../controllers/AuthenticationController");

const SubredditRepositoryObj = new Repository(Subreddit);
const FlairRepositoryObj = new Repository(Flair);
const subredditServiceObj = new subredditService(
  Subreddit,
  SubredditRepositoryObj,
  Flair,
  FlairRepositoryObj,
);

const userRepo = new Repository(User);
const userServiceObj = new UserService(User, userRepo, null);
const authenticationControllerObj = new AuthenticationController(
  userServiceObj
);

const subredditControllerObj = new subredditController(subredditServiceObj, userServiceObj);

const router = express.Router();

// test data models
router.use(authenticationControllerObj.authorize);
router.post("/", subredditControllerObj.createSubreddit);
router.patch("/:subredditName", subredditControllerObj.updateSubredditSettings);
router.get("/:subredditName", subredditControllerObj.getSubredditSettings);
router.delete("/:subredditName", subredditControllerObj.deleteSubreddit);
router.get(
  "/:subredditName/about/:location",
  subredditControllerObj.relevantPosts
);
// router.get("/mine/:where",subredditControllerObj)

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
