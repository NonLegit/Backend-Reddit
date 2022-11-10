const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Post",
    required: true,
  },
  mentions: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    refPath: "parentModel",
    required: true,
  },
  parentType: {
    type: String,
    required: true,
    enum: ["Post", "Comment"],
    default: "Comment",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
  repliesCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
