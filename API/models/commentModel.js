const { ObjectId } = require("bson");
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
  // mentions: [
  //   {
  //     type: mongoose.SchemaTypes.ObjectId,
  //     ref: "User",
  //   },
  // ],
  mentions: [
    {
      userName: String,
      userId: String,
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
  sortOnHot: {
    type: Number,
    required: false,
  },
  locked: {
    type: Boolean,
    required: true,
    default: false,
  },
  // nsfw: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  // spoiler: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  modState: {
    type: String,
    required: true,
    enum: ["unmoderated", "approved", "removed", "spammed"],
    default: "unmoderated",
  },
});

//A middleware to cascade soft delete
// commentSchema.pre("findOneAndUpdate", async function (next) {
//   const comment = await this.model.findOne(this.getQuery());
//   await this.model.updateMany(
//     { _id: { $in: comment.replies } },
//     { isDeleted: true }
//   );
//   next();
// });
// commentSchema.pre("updateMany", async function (next) {
//   const comments = await this.model.find(this.getQuery());
//   for (const comment of comments) {
//     await this.model.updateMany(
//       { _id: { $in: comment.replies } },
//       { isDeleted: true }
//     );
//   }
//   next();
// });

commentSchema.pre("find", function (next) {
  const { limit, depth, sort } = this.options;

  if (limit && depth) {
    if (depth <= 0) return next();
    this.populate({
      path: "replies",
      perDocumentLimit: limit,
      options: { depth: depth - 1, sort },
      // transform: (doc) => {
      //   doc.author.profilePicture =
      //     `${process.env.BACKDOMAIN}/` + doc.author.profilePicture;
      //   doc.author.profileBackground =
      //     `${process.env.BACKDOMAIN}/` + doc.author.profileBackground;
      //   return doc;
      // },
    });
  }

  next();
});

commentSchema.post("find", function (result) {
  for (const comment of result) {
    const author = comment.author;
    // console.log("-------------------------");
    // console.log(author);
    if (author&&author.profilePicture&&!author.profilePicture.startsWith(process.env.BACKDOMAIN)) {
      author.profilePicture =
        `${process.env.BACKDOMAIN}/` + author.profilePicture;
      author.profileBackground =
        `${process.env.BACKDOMAIN}/` + author.profileBackground;
    }
  }

  const { limit, depth } = this.options;
  if (limit && depth) {
    const ids = this.getFilter()._id.$in.slice(limit);
    const more = {
      _id: new ObjectId(ids[0]),
      Type: "moreReplies",
      count: ids.length,
      children: ids,
    };
    result.push(more);
    return result;
  }
});
commentSchema.pre("findOne", function () {
  const { userComments, getAuthor } = this.options;
  if (userComments) {
    this.populate("post");
  }
  console.log(getAuthor);
  if (getAuthor) {
    this.populate("author");
  } else {
    // this.populate("author", "_id userName profilePicture profileBackground");
    this.populate("author");
  }
});
commentSchema.pre("find", function () {
  const { userComments, getAuthor } = this.options;
  if (userComments) {
    this.populate("post");
  }
  if (getAuthor) {
    this.populate("author");
  } else {
    this.populate("author", "_id userName profilePicture profileBackground");
  }
});

commentSchema.pre("save", function (next) {
  // this points to the current query
  this.sortOnHot =
    this.createdAt.getTime() * 0.5 + this.votes * 0.3 + this.repliesCount * 0.2;
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
