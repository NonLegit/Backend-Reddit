const AuthenticationController = require("./AuthenticationController");
const User = require("../models/userModel");
const Repository = require("../data_access/repository");
const UserService = require("../service/userService");
const Email = require("../service/emailService");

const RepositoryObj = new Repository(User);
const emailServiceObj = new Email();
const userServiceObj = new UserService(User, RepositoryObj, emailServiceObj);

const authenticationControllerObj = new AuthenticationController(
  userServiceObj
);
module.exports = authenticationControllerObj;
