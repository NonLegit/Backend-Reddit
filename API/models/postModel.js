const mongoose = require("mongoose");
const Comment = require('./commentModel')
const Url = require("mongoose-type-url");
const validator = require("validator");
require("mongoose-type-url");

const postSchema = new mongoose.Schema({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    refPath: "ownerType",
    required: true,
  },
  ownerType: {
    type: String,
    enum: ["Subreddit", "User"],
    required: true,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  replies: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
  flair: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Flair",
    required: false,
  },
  flairText: {
    type: String,
    required: false,
  },
  sharedFrom: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Post",
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
    enum: ["link", "self", "image", "video"],
    default: "self",
  },
  text: {
    type: String,
    required: false,
  },
  url: {
    type: Url,
    required: false,
  },
  images: [String],
  video: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  locked: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  sendReplies: {
    type: Boolean,
    required: true,
    default: true,
  },
  nsfw: {
    type: Boolean,
    required: true,
    default: false,
  },
  spoiler: {
    type: Boolean,
    required: true,
    default: false,
  },
  votes: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  commentCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  shareCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  suggestedSort: {
    type: String,
    required: true,
    enum: ["top", "new", "best", "old"],
    default: "new",
  },
  scheduled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

postSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.isDeleted) {
    const post = await this.model.findOne(this.getQuery());
    await Comment.updateMany(
      { _id: { $in: post.replies } },
      { isDeleted: true }
    );
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
