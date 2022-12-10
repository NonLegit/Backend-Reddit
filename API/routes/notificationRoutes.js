const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");

const NotificationController = container.resolve("NotificationController");

const router = express.Router();


router.use(AuthenticationController.authorize);

router.route("/token").post(NotificationController.addFirebaseToken);

module.exports = router;