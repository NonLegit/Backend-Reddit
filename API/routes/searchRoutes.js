const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");
const SearchController = container.resolve("SearchController");
const router = express.Router();

router.use(AuthenticationController.authorize);

router.route("/").get(SearchController.search);

module.exports = router;
