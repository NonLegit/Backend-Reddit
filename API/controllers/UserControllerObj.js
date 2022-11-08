const User = require("./../models/userModel");
const Repository = require("./../data_access/repository");
const UserService = require("./../service/userService");
const Email = require("./../service/emailService");
const UserController = require("./../controllers/userController");

const RepositoryObj = new Repository(User);
const emailServiceObj = new Email();
const userServiceObj = new UserService(User, RepositoryObj, emailServiceObj);
const userControllerObj = new UserController(userServiceObj);

module.exports = userControllerObj;