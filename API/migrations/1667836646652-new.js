/**
 * Make any changes you need to make to the database here
 */
const mongoose = require("mongoose");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");
mongoose.connect("mongodb://localhost:27017/redditDB", {
  useNewUrlParser: true,
});

async function up() {
  // Write migration here
  await User.create({
    userName: "Ahmed",
    email: "ahmedsabry@gmail.com",
    password: "12345678",
  });
  let userAhmed = await User.findOne({ userName: "Ahmed" });

  let post = await Post.create({
    title: "kiro post",
    kind: "self",
    text: "this is a test post",
    author: userAhmed._id,
    owner: userAhmed._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
  });
  let postID = post._id;
  await User.findOneAndUpdate(
    { userName: "Ahmed" },
    { $push: { votePost: { posts: postID, postVoteStatus: "1" },saved:postID,hidden:postID } },
    {
      new: true,
      runValidators: true,
    }
  );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
