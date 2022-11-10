const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const User = require("./userModel");
const Post = require("./postModel");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
if (process.env.NODE_ENV === "test") {
  const DB = process.env.DATABASE_LOCAL;
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(() => {
    mongoose
      .connect(DB)
      .then(() => console.log("Fake DB connection for testing successful!"));
  });
} else {
  const DB = process.env.DATABASE_LOCAL;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));
}

module.exports = async function seeder() {
  let user1 = await User.create({
    userName: "Ahmed",
    email: "ahmedsabry@gmail.com",
    password: "12345678",
  });
  let user2 = await User.create({
    userName: "khaled",
    email: "khaled@gmail.com",
    password: "12345678",
  });
  let user3 = await User.create({
    userName: "kirollos",
    email: "kirollos@gmail.com",
    password: "12345678",
  });
  let user4 = await User.create({
    userName: "doaa",
    email: "doaa@gmail.com",
    password: "12345678",
  });
  let userAhmed = await User.findOne({ userName: "Ahmed" });

  let post1 = await Post.create({
    title: "ahmed post",
    kind: "self",
    text: "this is a test post 1",
    author: user1._id,
    owner: user1._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
  });
  let post2 = await Post.create({
    title: "khaled post",
    kind: "self",
    text: "this is a test post 2",
    author: user2._id,
    owner: user2._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
  });
  let post3 = await Post.create({
    title: "kiro post",
    kind: "self",
    text: "this is a test post 3",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
  });
  let post4 = await Post.create({
    title: "doaa post",
    kind: "self",
    text: "this is a test post 4",
    author: user4._id,
    owner: user4._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
  });
  let post5 = await Post.create({
    title: "ahmed post",
    kind: "self",
    text: "this is a test post 1",
    author: user1._id,
    owner: user1._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes:5,
  });

  await User.findOneAndUpdate(
    { userName: "Ahmed" },
    {
      $push: {
        votePost: {
          $each: [
            { posts: post2._id, postVoteStatus: "1" },
            { posts: post3._id, postVoteStatus: "-1" },
            { posts: post4._id, postVoteStatus: "1" },
          ],
        },
        saved: { $each: [post2._id, post3._id, post4._id] },
        hidden: { $each: [post2._id, post3._id, post4._id] },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  //   await User.findOneAndUpdate(
  //     { userName: "Ahmed" },
  //     {
  //       $push: {
  //         votePost: { posts: post3._id, postVoteStatus: "-1" },
  //         saved: post3._id,
  //         hidden: post3._id,
  //       },
  //     },
  //     {
  //       new: true,
  //       runValidators: true,
  //     }
  //   );
  //   await User.findOneAndUpdate(
  //     { userName: "Ahmed" },
  //     {
  //       $push: {
  //         votePost: { posts: post4._id, postVoteStatus: "1" },
  //         saved: post4._id,
  //         hidden: post4._id,
  //       },
  //     },
  //     {
  //       new: true,
  //       runValidators: true,
  //     }
  //   );
};
