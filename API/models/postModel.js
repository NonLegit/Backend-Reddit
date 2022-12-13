const mongoose = require("mongoose");
const Comment = require("./commentModel");
const Url = require("mongoose-type-url");
const validator = require("validator");
require("mongoose-type-url");

const postSchema = new mongoose.Schema({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    refPath: "ownerType",
    required: [true, "A post must have an owner"],
  },
  ownerType: {
    type: String,
    enum: ["Subreddit", "User"],
    required: [true, "A post must have an ownerType"],
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
  flairId: {
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
    required: [true, "A post must have a title"],
  },
  kind: {
    type: String,
    required: [true, "A post must have a kind"],
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
  sortOnHot: {
    type: Number,
    required: false,
  },
  sortOnBest: {
    type: Number,
    required: false,
  },
  modState: {
    type: String,
    required: true,
    enum: ["unmoderated", "approved", "removed", "spammed"],
    default: "unmoderated",
  },
  spamCount: {
    type: Number,
    required: true,
    default: 0
  },
  spammedBy: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  }]
});
postSchema.pre("save", function (next) {
  // this points to the current query

  this.sortOnHot =
    this.createdAt.getTime() * 0.5 + this.votes * 0.3 + this.commentCount * 0.2;
  this.sortOnBest =
    this.createdAt.getTime() * 0.4 +
    this.votes * 0.25 +
    this.commentCount * 0.2 +
    this.shareCount * 0.15;

  next();
});

//Whoever added this middleware should add more restrictions
postSchema.pre("find", function () {
  this.populate("owner");
  this.populate("author");
  this.populate("flairId");
});

// postSchema.pre("findOneAndUpdate", async function (next) {
//   if (this._update.isDeleted) {
//     const post = await this.model.findOne(this.getQuery());
//     await Comment.updateMany(
//       { _id: { $in: post.replies } },
//       { isDeleted: true }
//     );
//   }
//   next();
// });

// postSchema.pre('find', function(){
//   this.sortOnHot = (this.votes) * 0.8 + (this.commentCount) * 0.2;
//   this.sortOnBest=(this.createdAt.getTime())*0.4+(this.votes)*0.25+(this.commentCount)*0.2+(this.shareCount)*0.15;

// });
// postSchema.virtual('sortOnHot').get(function () {
//   return (this.votes)*0.8+(this.commentCount)*0.2;
// });
// postSchema.virtual('sortOnBest').get(function () {
//   return (this.createdAt.getTime())*0.4+(this.votes)*0.25+(this.commentCount)*0.2+(this.shareCount)*0.15;
// });
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
