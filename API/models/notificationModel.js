const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
        enum: [
            'postReply',
            'commentReply',
            'userMention',
            'firstPostUpVote',
            'firstCommentUpVote',
            'follow']
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: true
    },
    commentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      required: true
    },
    followerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false
    },
    followedId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false
    },
    seen: {
      type: Boolean,
      default: false
    },
    isHidden: {//this one is not included yet in schema
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now()
    },


});
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
