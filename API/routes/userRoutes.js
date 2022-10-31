const express = require("express");
//const userControllerObj = require("./test");
const userController = require("./../controllers/userController");
const User = require("./../models/userModel");
const Repository = require("./../data_access/repository");
const userService = require("./../service/userService");
const RepositoryObj = new Repository(User);
const userServiceObj = new userService(User, RepositoryObj);
const userControllerObj = new userController(userServiceObj);

const router = express.Router();

// test data models
router.post("/create", userControllerObj.createUser);

module.exports = router;
