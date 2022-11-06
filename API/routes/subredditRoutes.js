const express = require("express");
//const userControllerObj = require("./test");
const subredditController = require("./../controllers/subredditController");
const Subreddit = require("./../models/subredditModel");
const Repository = require("./../data_access/repository");
const subredditService = require("../service/subredditService");
const RepositoryObj = new Repository(Subreddit);
const subredditServiceObj = new subredditService(Subreddit, RepositoryObj);
const subredditControllerObj = new subredditController(subredditServiceObj);

const router = express.Router();

// test data models
router.post("/", subredditControllerObj.createSubreddit);
router.patch("/:subredditName/:username", subredditControllerObj.updateSubredditSettings);  // *TODO: need edit here
router.get("/:subredditName", subredditControllerObj.getSubredditSettings);
router.delete("/:subredditName/:username", subredditControllerObj.deleteSubreddit);         //*TODO: need edit here

module.exports = router;
