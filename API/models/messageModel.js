const mongoose = require('mongoose');
const User = require('./userModel');

const subjectSchema = new mongoose.Schema({text: {
      type: String,
      required: false,
      maxlength: [20, 'Subject must have less or equal than 20 characters']
      },});
const messageSchema = new mongoose.Schema({

    subject: subjectSchema,
    parentMessage:{//id
      type: mongoose.Schema.ObjectId,
        ref: 'Message',
        required: false
    },
    text: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: true,
      enum: [
        'postReply',//-----------------
        'userMention',
        'userMessage',//////messages-----------------

        
        'subredditBan',//////messages no changes-----------------
        'subredditMute',///messages -------------------
        'subredditModeratorInvite',//messages ---------------
        'subredditModeratorRemove',//messages xxxxxxxxxxxxxxxxx
        'subredditApprove'//messages
      ]
    },
    from: {//id //username
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    to: {//id username
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    subreddit: {//id fixed name
      type: mongoose.Schema.ObjectId,
      ref:'Subreddit',
      required: false
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isDeletedInSource: {
      type: Boolean,
      default: false
  },
    isDeletedInDestination: {
      type: Boolean,
      default: false
  },
    comment: {//id fixed name
      type: mongoose.Schema.ObjectId,
      ref:'Comment',
      required: false
    },

});
messageSchema.pre(/^find/,  function () {
 // console.log(this);
  this.populate("from","_id userName");
  this.populate("to", "_id userName");
  this.populate("comment","_id text parent -author");
  this.populate("subreddit", "_id fixedName name");
  
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
