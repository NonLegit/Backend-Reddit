const mongoose = require('mongoose');
const User = require('./userModel');

const messageSchema = new mongoose.Schema({

    subject: {
      type: String,
      required: true,
      maxlength: [20, 'Subject must have less or equal than 100 characters']
    },
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'postReply',
        'userMention',
        'userMessage',
        'subredditBan',
        'subredditMute',
        'subredditModeratorInvite',
        'subredditModeratorAccept',
        'subredditModeratorRemove',
        'subredditApprove'
      ]
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    subreddit: {
      type: mongoose.Schema.ObjectId,
      ref:'Subreddit',
      required: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now()
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },

});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
