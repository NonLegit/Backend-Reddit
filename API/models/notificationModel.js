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
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: false
    },
    comment: {
      type: Object,
      required: false
    },
    followedUser: {
      type: Object,
      required: false
    },
    followerUser: {
      type: Object,
      required: true
    },
    followedSubreddit:{
        type: Object,
      
      required: false

    },
    seen: {
      type: Boolean,
      default: false
    },
    hidden: {//this one is not included yet in schema
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
