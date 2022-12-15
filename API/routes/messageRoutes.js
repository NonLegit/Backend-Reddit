const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");

const MessageController = container.resolve("MessageController");

const router = express.Router();


router.use(AuthenticationController.authorize);

router.route("/").post(MessageController.sendMessage);
// router.route("/").get(NotificationController.getAllNotifications);

module.exports = router;