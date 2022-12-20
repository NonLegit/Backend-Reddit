const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const subredditController = container.resolve("subredditController");
const PostController = container.resolve("PostController");
const FileController = container.resolve("FileController");
const MessageController = container.resolve("MessageController");
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

router.get("/mine/:where", subredditController.subredditsJoined);
router.get("/moderator/:username", subredditController.subredditsModerated);

router.post(
  "/:subredditName/moderators/:moderatorName",
  subredditController.inviteModerator,
  MessageController.modMessage
);
router.post(
  "/:subredditName/:action/invitation",
  subredditController.ModeratorInvitation
);
router.delete(
  "/:subredditName/moderator/:moderatorName",
  subredditController.deletemoderator,
  MessageController.modMessage
);
router.patch(
  "/:subredditName/moderators/:moderatorName",
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
  subredditController.banSettings,
  MessageController.modMessage
);
router.get("/:subredditName/banned", subredditController.bannedUsers);
router.get("/:subredditName/muted", subredditController.mutedUsers);

router.post(
  "/:subredditName/mute_settings/:action/:userName",
  subredditController.muteSettings,
  MessageController.modMessage
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

router.post(
  "/:subredditName/:userName/:action/approve_user",
  subredditController.approveUser,
  MessageController.modMessage
);
router.get("/:subredditName/approved_users", subredditController.approvedUsers);

// TODO: to be continued
router.get("/:topics/posts/like_reels", subredditController.reels);

router.get("/traffic/:subredditName", subredditController.traffic);

router.get(
  "pending_invitations/:subredditName",
  subredditController.pendingInvetations
);

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
router
  .route("/:subredditName/images")
  .post(FileController.checkUploadedFile, FileController.uploadSubredditImage);

module.exports = router;
