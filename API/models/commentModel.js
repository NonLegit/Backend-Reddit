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
    autopopulate: true,
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

//A middleware to cascade soft delete
commentSchema.pre("findOneAndUpdate", async function (next) {
  const comment = await this.model.findOne(this.getQuery());
  await this.model.updateMany({_id: {$in: comment.replies}}, {isDeleted: true});
  next();
});
commentSchema.pre("updateMany", async function (next) {
  const comments = await this.model.find(this.getQuery());
  for (const comment of comments) {
    await this.model.updateMany({_id: {$in: comment.replies}}, {isDeleted: true});
  }
  next();
});
// commentSchema.post("init", function () {
//   console.log(this);
//   this.populate("post");
//   this.populate("author","_id userName profilePicture profileBackground");
// });
commentSchema.pre(/^find/,  function () {
  console.log(this);
  this.populate("post");
  this.populate("author","_id userName profilePicture profileBackground");
});
// commentSchema.pre(/^find/, function(next) {
//   this.find({ isDeleted: false });
//   next();
// });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
