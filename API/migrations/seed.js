const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const User = require("../models/userModel");
const Post = require("../models/postModel");
const dotenv = require("dotenv");
const Subreddit = require("../models/subredditModel");
dotenv.config();
if (process.env.NODE_ENV === "test") {
  const DB = process.env.DATABASE;
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(() => {
    console.log("helooooo");
    mongoose
      .connect(DB)
      .then(() => console.log("Fake DB connection for testing successful!"));
  });
} else if (process.env.NODE_ENV === "production") {
  const DB = process.env.DATABASE;
  mongoose.connect(DB).then(() => {});
} else {
  const DB = process.env.DATABASE;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));
}

module.exports = async function seeder() {
  let defaultImg = `${process.env.BACKDOMAIN}/api/v1/users/images/default.png`;
  let postImg = `${process.env.BACKDOMAIN}/api/v1/posts/images/default.jpg`;

  let user0 = await User.create({
    userName: "Mohab",
    email: "Mohab@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user1 = await User.create({
    userName: "Eslam",
    email: "Eslam@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user2 = await User.create({
    userName: "Hosny",
    email: "Hosny@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user3 = await User.create({
    userName: "Nour",
    email: "Nour@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user4 = await User.create({
    userName: "Basma",
    email: "Basma@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user5 = await User.create({
    userName: "Fady",
    email: "Fady@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user6 = await User.create({
    userName: "Adham",
    email: "Adham@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user7 = await User.create({
    userName: "Madbouly",
    email: "Madbouly@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user8 = await User.create({
    userName: "Zeinab",
    email: "Zeinab@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user9 = await User.create({
    userName: "Eman",
    email: "Eman@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user10 = await User.create({
    userName: "Fawzy",
    email: "Fawzy@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });
  let user11 = await User.create({
    userName: "Amr",
    email: "Amr@gmail.com",
    password: "Aa123456*",
    profilePicture: defaultImg,
    profileBackground: defaultImg,
  });

  //let userAhmed = await User.findOne({ userName: "Ahmed" });

  let post1 = await Post.create({
    title: "First Post",
    kind: "self",
    text: "this is my first post on NONLEGIT",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: false,
    spoiler: false,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 2,
  });
  let post2 = await Post.create({
    title: "Second Post",
    kind: "self",
    text: "this is my second post on NONLEGIT",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: false,
    spoiler: false,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 0,
  });
  let post3 = await Post.create({
    title: "Thrid Post",
    kind: "self",
    text: "this is my thrid post on NONLEGIT",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: false,
    spoiler: false,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 2,
  });
  let post4 = await Post.create({
    title: "Fourth Post",
    kind: "self",
    text: "this is my fourth post on NONLEGIT",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: false,
    spoiler: false,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 0,
  });
  let post5 = await Post.create({
    title: "Fifth Post",
    kind: "image",
    text: "this is my fifth post on NONLEGIT",
    author: user3._id,
    owner: user3._id,
    ownerType: "User",
    nsfw: true,
    spoiler: false,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: -1,
    images: [postImg],
  });

  await User.findOneAndUpdate(
    { userName: "Nour" },
    {
      $push: {
        votePost: {
          $each: [
            { posts: post1._id, postVoteStatus: "1" },
            { posts: post2._id, postVoteStatus: "-1" },
            { posts: post3._id, postVoteStatus: "1" },
            { posts: post4._id, postVoteStatus: "-1" },
          ],
        },
        saved: { $each: [post2._id, post3._id, post4._id] },
        // hidden: { $each: [post2._id, post3._id, post4._id] },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  await User.findOneAndUpdate(
    { userName: "Hosny" },
    {
      $push: {
        votePost: {
          $each: [
            { posts: post1._id, postVoteStatus: "-1" },
            { posts: post2._id, postVoteStatus: "-1" },
            { posts: post3._id, postVoteStatus: "-1" },
            { posts: post4._id, postVoteStatus: "-1" },
            { posts: post5._id, postVoteStatus: "1" },
          ],
        },
        saved: { $each: [post2._id, post3._id, post4._id] },
        // hidden: { $each: [post2._id, post3._id, post4._id] },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  await User.findOneAndUpdate(
    { userName: "Eslam" },
    {
      $push: {
        votePost: {
          $each: [
            { posts: post1._id, postVoteStatus: "1" },
            { posts: post2._id, postVoteStatus: "1" },
            { posts: post3._id, postVoteStatus: "1" },
            { posts: post4._id, postVoteStatus: "1" },
            { posts: post5._id, postVoteStatus: "-1" },
          ],
        },
        saved: { $each: [post2._id, post3._id, post4._id] },
        // hidden: { $each: [post2._id, post3._id, post4._id] },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  await User.findOneAndUpdate(
    { userName: "Adham" },
    {
      $push: {
        votePost: {
          $each: [
            { posts: post1._id, postVoteStatus: "1" },
            { posts: post2._id, postVoteStatus: "1" },
            { posts: post3._id, postVoteStatus: "1" },
            { posts: post4._id, postVoteStatus: "1" },
            { posts: post5._id, postVoteStatus: "-1" },
          ],
        },
        saved: { $each: [post2._id, post3._id, post4._id] },
        // hidden: { $each: [post2._id, post3._id, post4._id] },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  try {
    let subreddit1 = await Subreddit.create({
      owner: user2._id,
      name: "hosny_Subreddit",
      type: "Public",
      nsfw: true,
    });
  } catch (error) {
    console.log(error);
  }

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