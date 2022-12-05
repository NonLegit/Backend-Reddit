const express = require("express");
const multer = require("multer");
const hpp = require("hpp");
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const UserController = container.resolve("UserController");
const PostController = container.resolve("PostController");
const FileController = container.resolve("FileController");
//const upload = FileController.checkUploadedFile();
const router = express.Router();
// Non authorized Endpoints
//router.post("/create", userControllerObj.createUser);
//router.get("/images/:userName/:fileName", FileController.getUserProfileImage);
//router.get("/images/:fileName", FileController.getUserProfileImage);

router.post("/signup", AuthenticationController.signUp);
router.post("/login", AuthenticationController.logIn);
router.post("/logout", AuthenticationController.logOut);
router.post("/forgot_username", AuthenticationController.forgotUserName);
router.post("/forgot_password", AuthenticationController.forgotPassword);
router.post("/reset_password/:token", AuthenticationController.resetPassword);
router.get(
  "/check_reset_token/:token",
  AuthenticationController.checkResetTokentime
);

// facebook authentication
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    async function (accessToken, refreshToken, profile, done) {
      await AuthenticationController.facebookAuth(
        accessToken,
        refreshToken,
        profile,
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);

router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  AuthenticationController.facebookValidation
);
router.post("/google", AuthenticationController.googleAuth);
/*
router.post(
  "/goo000gle",
  passport.authenticate("google-plus-token", { session: false }),
  authenticationControllerObj.facebookValidation
);*/
// authorize endpoints

router.route("/username_available").get(UserController.usernameAvailable);
router.get(
  "/top",
  AuthenticationController.checkAuthorize,
  PostController.getTopPosts
);
router.get(
  "/hot",
  AuthenticationController.checkAuthorize,
  PostController.getHotPosts
);
router.get(
  "/new",
  AuthenticationController.checkAuthorize,
  PostController.getNewPosts
);
router.get(
  "/best",
  AuthenticationController.checkAuthorize,
  PostController.getBestPosts
);

router.use(AuthenticationController.authorize);

// authorized endpoints

router
  .route("/images")
  .get(FileController.getUserProfileImage)
  .post(FileController.checkUploadedFile, FileController.uploadUserImage);

router.post("/change_email", AuthenticationController.changeEmail);
router.get("/me", UserController.getMe);
router.get("/me/prefs", UserController.getPrefs);
router.patch(
  "/me/prefs",
  hpp({
    whitelist: [
      "contentvisibility",
      "canbeFollowed",
      "nsfw",
      "allowInboxMessage",
      "allowMentions",
      "allowCommentsOnPosts",
      "allowUpvotesOnComments",
      "allowUpvotesOnPosts",
      "displayName",
      "profilePicture",
    ],
  }),
  UserController.updatePrefs
);
router.get("/:userName/about", UserController.about);
router.get("/:userName/posts", PostController.userPosts);
router.get("/:userName/overview", PostController.userPosts);

router.get("/saved", PostController.getSavedPosts);
router.get("/hidden", PostController.getHiddenPosts);
router.get("/upvoted", PostController.userUpvotedPosts);
router.get("/downvoted", PostController.userDownvotedPosts);

module.exports = router;

//const GooglePlusTokenStrategy = require("passport-google-plus-token");

//const UserController = require("./../controllers/userController");
//const AuthenticationController = require("./../controllers/AuthenticationController");
// const userControllerObj = require("./../controllers/UserControllerObj");
// const authenticationControllerObj = require("./../controllers/AuthenticationControllerObj");
// const PostController = require("./../controllers/postController");
// const User = require("./../models/userModel");
// const Repository = require("./../data_access/repository");
// const UserService = require("./../service/userService");
// const Email = require("./../service/emailService");
// const PostService = require("../service/postService");
// const Post = require("../models/postModel");

// const postRepoObj = new Repository(Post);
// const postServiceObj = new PostService(Post, postRepoObj);

// const RepositoryObj = new Repository(User);
// const emailServiceObj = new Email();
// const userServiceObj = new UserService(User, RepositoryObj, emailServiceObj);

// // const authenticationControllerObj = new AuthenticationController(
// //   userServiceObj
// // );
// const postControllerObj = new PostController(postServiceObj, userServiceObj);
// //const userControllerObj = new UserController(userServiceObj,postServiceObj);

// google authentication
// passport.use(
//   new GooglePlusTokenStrategy(
//     {
//       clientID: process.env.GOOGLE_APP_ID,
//       clientSecret: process.env.GOOGLE_APP_SECRET,
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       await authenticationControllerObj.facebookAuth(
//         accessToken,
//         refreshToken,
//         profile,
//         function (err, user) {
//           return done(err, user);
//         }
//       );
//     }
//   )
// );
