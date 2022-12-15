const express = require("express");
const { container } = require("./../di-setup");

const AuthenticationController = container.resolve("AuthenticationController");

const MessageController = container.resolve("MessageController");

const router = express.Router();


router.use(AuthenticationController.authorize);





router.route("/mark_as_read").post(MessageController.markAllAsRead);
router.route("/sent").get(MessageController.getSentMessage);
router.route("/unread").get(MessageController.getUnreadMessage);
router.route("/").post(MessageController.sendMessage);
router.route("/:messageId").delete(MessageController.deleteMessage);
router.route("/post_replies").get(MessageController.getPostReplies);
// router.route("/").get(NotificationController.getAllNotifications);

module.exports = router;