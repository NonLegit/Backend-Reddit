const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Flair = require("../models/flairModel");
const Subreddit = require("../models/subredditModel");
const Social = require("../models/socialModel");
const Comment = require("../models/commentModel");
const dotenv = require("dotenv");

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
  let defaultImg = `default.png`;
  let postImg = `${process.env.BACKDOMAIN}/posts/default.jpg`;

  let facebook = await Social.create({
    type: "Facebook",
    baseLink: "https://facebook.com/",
    placeholderLink: "https://facebook.com",
    check: "https://facebook.com/",
    icon: "icons/facebook.png",
  });
  let twitter = await Social.create({
    type: "Twitter",
    baseLink: "https://twitter.com/",
    placeholderLink: "@username",
    check: "@",
    icon: "icons/twitter.png",
  });
  let tiktok = await Social.create({
    type: "Tiktok",
    baseLink: "https://tiktok.com/@",
    placeholderLink: "@username",
    check: "@",
    icon: "icons/tiktok.png",
  });
  let instagram = await Social.create({
    type: "Instagram",
    baseLink: "https://instagram.com/",
    placeholderLink: "@username",
    check: "@",
    icon: "icons/instagram.png",
  });

  let discord = await Social.create({
    type: "Discord",
    baseLink: "https://discord.com/",
    placeholderLink: "https://discord.com",
    check: "https://discord.com/",
    icon: "icons/discord.png",
  });
  let reddit = await Social.create({
    type: "Reddit",
    baseLink: "https://reddit.com/user/",
    placeholderLink: "u/user",
    check: "u/",
    icon: "icons/reddit.png",
  });
  let youtube = await Social.create({
    type: "Youtube",
    baseLink: "https://youtube.com/",
    placeholderLink: "https://youtube.com",
    check: "https://youtube.com/",
    icon: "icons/youtube.png",
  });

  let user0 = await User.create({
    userName: "Mohab",
    email: "Mohab@gmail.com",
    password: "Aa123456*",
  });
  let user1 = await User.create({
    userName: "Eslam",
    email: "Eslam@gmail.com",
    password: "Aa123456*",
  });
  let user2 = await User.create({
    userName: "Hosny",
    email: "Hosny@gmail.com",
    password: "Aa123456*",
  });
  let user3 = await User.create({
    userName: "Nour",
    email: "Nour@gmail.com",
    password: "Aa123456*",
  });
  let user4 = await User.create({
    userName: "Basma",
    email: "Basma@gmail.com",
    password: "Aa123456*",
  });
  let user5 = await User.create({
    userName: "Fady",
    email: "Fady@gmail.com",
    password: "Aa123456*",
  });
  let user6 = await User.create({
    userName: "Adham",
    email: "Adham@gmail.com",
    password: "Aa123456*",
  });
  let user7 = await User.create({
    userName: "Madbouly",
    email: "Madbouly@gmail.com",
    password: "Aa123456*",
  });
  let user8 = await User.create({
    userName: "Zeinab",
    email: "Zeinab@gmail.com",
    password: "Aa123456*",
  });
  let user9 = await User.create({
    userName: "Eman",
    email: "Eman@gmail.com",
    password: "Aa123456*",
  });
  let user10 = await User.create({
    userName: "Fawzy",
    email: "Fawzy@gmail.com",
    password: "Aa123456*",
  });
  let user11 = await User.create({
    userName: "Amr",
    email: "Amr@gmail.com",
    password: "Aa123456*",
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
    votes: 34,
    views: 90,
    shareCount: 2,
    commentCount: 9,
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
    votes: -60,
    views: 95,
    shareCount: 0,
    commentCount: 9,
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
    votes: 90,
    views: 500,
    shareCount: 0,
    commentCount: 66,
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
    views: 0,
    shareCount: 0,
    commentCount: 0,
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
    votes: 0,
    views: 8,
    shareCount: 0,
    commentCount: 0,
    images: [postImg],
  });
  let comment1 = await Comment.create({
    author: user3._id,
    parent: post2._id,
    post: post2._id,
    parentType: "Post",
    text: "My Fourth comment",
  });
  let comment2 = await Comment.create({
    author: user3._id,
    parent: post3._id,
    post: post3._id,
    parentType: "Post",
    text: "My Fourth comment",
  });
  let comment3 = await Comment.create({
    author: user3._id,
    parent: post2._id,
    post: post2._id,
    parentType: "Post",
    text: "My Fourth comment",
  });
  let flair1 = await Flair.create({
    text: "first flair",
    backgroundColor: "#111111",
    textColor: "#ffffff",
    permissions: "modOnly",
  });
  let flair2 = await Flair.create({
    text: "second flair",
    backgroundColor: "#121212",
    textColor: "#eeeeee",
    permissions: "modOnly",
  });
  let flair3 = await Flair.create({
    text: "third flair",
    backgroundColor: "#111111",
    textColor: "#f1f3f3",
    permissions: "modOnly",
  });
  console.log(comment1);
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
        saved: {
          $each: [
            { savedPost: post2._id, createdAt: Date.now() },
            { savedPost: post3._id, createdAt: Date.now() },
            { savedPost: post4._id, createdAt: Date.now() },
          ],
        },
        savedComments: {
          $each: [
            { savedComment: comment1._id, createdAt: Date.now() },
            { savedComment: comment2._id, createdAt: Date.now() },
            { savedComment: comment3._id, createdAt: Date.now() },
          ],
        },
        // saved: {
        //   $each: [post2._id, post3._id, post4._id],
        // },
        socialLinks: {
          $each: [
            { social: facebook._id, userLink: "facebook", displayText: "Nour" },
            { social: twitter._id, userLink: "twitter", displayText: "Nour" },
          ],
        },
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
        // saved: {
        //   $each: [post2._id, post3._id, post4._id],
        // },
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
        // saved: {
        //   $each: [post2._id, post3._id, post4._id],
        // },
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
        // saved: {
        //   $each: [post2._id, post3._id, post4._id],
        // },
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
      owner: user1._id,
      fixedName: "Nonlegit",
      type: "Private",
      nsfw: false,
    });
    await Subreddit.findOneAndUpdate(
      { _id: subreddit1 },
      {
        description: "this is a Nonlegit subreddit",
        icon: `subreddits/default.png`,
        membersCount: 1000,
        rules: [
          {
            defaultName: "rule 1",
            title: "this is a title",
            description: "this is a description",
            appliesTo: " ",
          },
        ],
        $push: {
          moderators: {
            id: user1._id,
            userName: user1.userName,
            joiningDate: Date.now(),
            profilePicture: `users/default.png`,
            moderatorPermissions: {
              all: true,
              access: true,
              config: true,
              flair: true,
              posts: true,
            },
          },
          flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
        },
      },
      { new: true }
    );

    let subreddit2 = await Subreddit.create({
      owner: user2._id,
      fixedName: "selm alsodan",
      type: "Public",
      nsfw: true,
    });
    await Subreddit.findOneAndUpdate(
      { _id: subreddit2 },
      {
        primaryTopic: "study",
        description: "this is a selm alsodan subreddit",
        icon: `subreddits/default.png`,
        membersCount: 1000,
        rules: [
          {
            defaultName: "rule 1",
            title: "this is a title",
            description: "this is a description",
            appliesTo: " ",
          },
        ],
        $push: {
          moderators: {
            id: user2._id,
            userName: user2.userName,
            joiningDate: Date.now(),
            profilePicture: `users/default.png`,
            moderatorPermissions: {
              all: true,
              access: true,
              config: true,
              flair: true,
              posts: true,
            },
          },
          flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
        },
      },
      { new: true }
    );
    let subreddit3 = await Subreddit.create({
      owner: user2._id,
      fixedName: "yaaah yalmedan",
      type: "Restricted",
      nsfw: true,
    });
    await Subreddit.findOneAndUpdate(
      { _id: subreddit3 },
      {
        primaryTopic: "study",
        description: "this is a yaaah yalmedan subreddit",
        icon: `subreddits/default.png`,
        membersCount: 1230,
        rules: [
          {
            defaultName: "rule 1",
            title: "this is a title",
            description: "this is a description",
            appliesTo: " ",
          },
        ],
        $push: {
          moderators: {
            id: user3._id,
            userName: user3.userName,
            joiningDate: Date.now(),
            profilePicture: `users/default.png`,
            moderatorPermissions: {
              all: true,
              access: true,
              config: true,
              flair: true,
              posts: true,
            },
          },
          flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
        },
      },
      { new: true }
    );
    let subreddit4 = await Subreddit.create({
      owner: user2._id,
      fixedName: "fl share3",
      type: "Public",
      nsfw: true,
    });
    await Subreddit.findOneAndUpdate(
      { _id: subreddit4 },
      {
        primaryTopic: "movies",
        description: "this is a yaaah fl share3 subreddit",
        icon: `subreddits/default.png`,
        membersCount: 1230,
        rules: [
          {
            defaultName: "rule 1",
            title: "this is a title",
            description: "this is a description",
            appliesTo: " ",
          },
        ],
        $push: {
          moderators: {
            id: user4._id,
            userName: user4.userName,
            joiningDate: Date.now(),
            profilePicture: `users/default.png`,
            moderatorPermissions: {
              all: true,
              access: true,
              config: true,
              flair: true,
              posts: true,
            },
          },
          flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
        },
      },
      { new: true }
    );
    let subreddit5 = await Subreddit.create({
      owner: user2._id,
      fixedName: "al3enb al3enb al3enb",
      type: "Public",
      nsfw: false,
    });
    await Subreddit.findOneAndUpdate(
      { _id: subreddit5 },
      {
        primaryTopic: "sports",
        description: "this is a al3enb al3enb al3enb subreddit",
        icon: `subreddits/default.png`,
        membersCount: 123330,
        rules: [
          {
            defaultName: "rule 1",
            title: "this is a title",
            description: "this is a description",
            appliesTo: " ",
          },
        ],
        $push: {
          moderators: {
            id: user5._id,
            userName: user5.userName,
            joiningDate: Date.now(),
            profilePicture: `users/default.png`,
            moderatorPermissions: {
              all: true,
              access: true,
              config: true,
              flair: true,
              posts: true,
            },
          },
        },
      },
      { new: true }
    );
    let post6 = await Post.create({
      title: "subreddit Post",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 50,
      views: 300,
      shareCount: 30,
      commentCount: 9,
      images: [postImg],
      flairId: flair1._id,
    });
    let post66 = await Post.create({
      title: "subreddit Post",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 50,
      views: 300,
      shareCount: 30,
      commentCount: 9,
      images: [postImg],
      flairId: flair1._id,
    });

    let post69 = await Post.create({
      title: "subreddit Post",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 50,
      views: 300,
      shareCount: 30,
      commentCount: 9,
      images: [postImg],
      flairId: flair1._id,
      modState: "spammed",
    });

    let post7 = await Post.create({
      title: "subreddit Post 2",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 5,
      views: 30,
      shareCount: 100,
      commentCount: 8,
      images: [postImg],
      flairId: flair2._id,
      modState: "removed",
    });
    let post8 = await Post.create({
      title: "subreddit Post 3",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user1._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 1000,
      views: 100,
      shareCount: 4,
      commentCount: 0,
      images: [postImg],
      flairId: flair1._id,
    });
    let post9 = await Post.create({
      title: "subreddit Post 4",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user4._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 5,
      views: 0,
      shareCount: 0,
      commentCount: 800,
      images: [postImg],
      flairId: flair1._id,
    });
    let post10 = await Post.create({
      title: "subreddit Post 5",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: -200,
      views: 300,
      shareCount: 0,
      commentCount: 90,
      images: [postImg],
      flairId: flair1._id,
    });
    let post11 = await Post.create({
      title: "subreddit Post",
      kind: "self",
      text: "this subreddit post on NONLEGIT",
      author: user3._id,
      owner: subreddit1._id,
      ownerType: "Subreddit",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 1000,
      views: 3000,
      shareCount: 200,
      commentCount: 300,
      images: [postImg],
      flairId: flair3._id,
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
