const express = require("express");
//const userControllerObj = require("./test");
const userController = require("./../controllers/userController");
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
const userControllerObj = new userController(userServiceObj);

const router = express.Router();

// test data models
router.post("/create", userControllerObj.createUser);
router.post("/signup", authenticationControllerObj.signUp);
router.post("/login", authenticationControllerObj.logIn);
router.post("/forgot_username", authenticationControllerObj.forgotUserName);
router.post("/forgot_password", authenticationControllerObj.forgotPassword);
module.exports = router;
