const express = require("express");
const hpp = require("hpp");
const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");

const UserController = require("./../controllers/userController");
const AuthenticationController = require("./../controllers/AuthenticationController");
const User = require("./../models/userModel");
const Repository = require("./../data_access/repository");
const UserService = require("./../service/userService");
const Email = require("./../service/emailService");

const RepositoryObj = new Repository(User);
const emailServiceObj = new Email();
const userServiceObj = new UserService(User, RepositoryObj, emailServiceObj);

const authenticationControllerObj = new AuthenticationController(
    userServiceObj
);
const userControllerObj = new UserController(userServiceObj);

const router = express.Router();

// Non authorized Endpoints
//router.post("/create", userControllerObj.createUser);
router.post("/signup", authenticationControllerObj.signUp);
router.post("/login", authenticationControllerObj.logIn);
router.post("/logout", authenticationControllerObj.logOut);
router.post("/forgot_username", authenticationControllerObj.forgotUserName);
router.post("/forgot_password", authenticationControllerObj.forgotPassword);
router.post(
    "/reset_password/:token",
    authenticationControllerObj.resetPassword
);
// facebook authentication
passport.use(
    new FacebookTokenStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
        },
        async function (accessToken, refreshToken, profile, done) {
        await authenticationControllerObj.facebookAuth(
            accessToken,
            refreshToken,
            profile,
            function (err, user) {
                return done(err, user);
            }
        );
    }
  
        // User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        //     return done(err, user);
        //   });
    )
);

router.post(
    "/facebook",
    passport.authenticate("facebook-token", { session: false }),
    authenticationControllerObj.facbookValidation
);
// authorize endpoints
router.use(authenticationControllerObj.authorize);

// authorized endpoints
//router.get("/me",userController.getMe);
router.get("/me/prefs", userControllerObj.getPrefs);
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
    userControllerObj.updatePrefs
);

module.exports = router;
