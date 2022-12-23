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
  try {
    let user0 = await User.create({
      userName: "EngMohab",
      email: "EngMohab@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user1 = await User.create({
      userName: "EngEslam",
      email: "EngEslam@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user2 = await User.create({
      userName: "EngHosny",
      email: "EngHosny@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user3 = await User.create({
      userName: "EngNour",
      email: "EngNour@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user4 = await User.create({
      userName: "EngBasma",
      email: "EngBasma@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user5 = await User.create({
      userName: "EngFady",
      email: "EngFady@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user6 = await User.create({
      userName: "EngAdham",
      email: "EngAdham@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user7 = await User.create({
      userName: "EngMadbouly",
      email: "EngMadbouly@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user8 = await User.create({
      userName: "EngZeinab",
      email: "EngZeinab@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user9 = await User.create({
      userName: "EngEman",
      email: "EngEman@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user10 = await User.create({
      userName: "EngFawzy",
      email: "EngFawzy@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user11 = await User.create({
      userName: "EngAmr",
      email: "EngAmr@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user12 = await User.create({
      userName: "EngFathy",
      email: "EngFathy@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user13 = await User.create({
      userName: "EngSalem",
      email: "EngSalem@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user14 = await User.create({
      userName: "EngYoussef",
      email: "EngYoussef@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user15 = await User.create({
      userName: "EngSabry",
      email: "EngSabry@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user16 = await User.create({
      userName: "EngKhaled",
      email: "EngKhaled@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user17 = await User.create({
      userName: "EngKirollous",
      email: "EngKirollous@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });
    let user18 = await User.create({
      userName: "EngDoaa",
      email: "EngDoaa@gmail.com",
      password: "Aa123456*",
      emailVerified: true,
      nsfw: false,
    });

    let post1 = await Post.create({
      title: "First Post",
      kind: "self",
      text: "this is my first post on NONLEGIT",
      author: user0._id,
      owner: user0._id,
      ownerType: "User",
      nsfw: false,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 2,
      views: 0,
      shareCount: 0,
      commentCount: 0,
    });
    let post2 = await Post.create({
      title: "Second Post",
      kind: "self",
      text: "this is my second post on NONLEGIT",
      author: user0._id,
      owner: user0._id,
      ownerType: "User",
      nsfw: false,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 0,
      views: 0,
      shareCount: 0,
      commentCount: 5,
    });
    let post3 = await Post.create({
      title: "Thrid Post",
      kind: "self",
      text: "this is my thrid post on NONLEGIT",
      author: user0._id,
      owner: user0._id,
      ownerType: "User",
      nsfw: false,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 0,
      views: 0,
      shareCount: 0,
      commentCount: 1,
    });
    let post4 = await Post.create({
      title: "Fourth Post",
      kind: "self",
      text: "this is my fourth post on NONLEGIT",
      author: user0._id,
      owner: user0._id,
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
      kind: "self",
      text: "this is my fifth post on NONLEGIT",
      author: user0._id,
      owner: user0._id,
      ownerType: "User",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 0,
      views: 0,
      shareCount: 1,
      commentCount: 0,
      isDeleted: false,
    });
    let sharedPost = await Post.create({
      title: "Cross Post from post fifth",
      kind: "self",
      text: "this is my sixth post on NONLEGIT",
      author: user0._id,
      owner: user10._id,
      ownerType: "User",
      sharedFrom: post5._id,
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 0,
      views: 0,
      shareCount: 0,
      commentCount: 0,
      isDeleted: false,
    });

    let post6 = await Post.create({
      title: "eslam Post",
      kind: "self",
      text: "this is my first post on NONLEGIT",
      author: user1._id,
      owner: user1._id,
      ownerType: "User",
      nsfw: true,
      spoiler: false,
      sendReplies: true,
      suggestedSort: "top",
      scheduled: false,
      votes: 0,
      views: 0,
      shareCount: 0,
      commentCount: 0,
      isDeleted: false,
    });

    let comment1 = await Comment.create({
      author: user0._id,
      parent: post2._id,
      post: post2._id,
      parentType: "Post",
      text: "My First comment",
      isDeleted: true,
    });
    let comment2 = await Comment.create({
      author: user0._id,
      parent: post3._id,
      post: post3._id,
      parentType: "Post",
      text: "My Second comment",
    });
    let comment3 = await Comment.create({
      author: user0._id,
      parent: post2._id,
      post: post2._id,
      parentType: "Post",
      text: "My Thrid comment",
    });
    let comment4 = await Comment.create({
      author: user0._id,
      parent: post2._id,
      post: post2._id,
      parentType: "Post",
      text: "My Fourth comment",
      repliesCount: 1,
    });
    let comment5 = await Comment.create({
      author: user0._id,
      parent: comment4._id,
      post: post2._id,
      parentType: "Comment",
      text: "My fifth comment",
      repliesCount: 1,
    });
    let comment6 = await Comment.create({
      author: user0._id,
      parent: comment5._id,
      post: post2._id,
      parentType: "Comment",
      text: "My sixth comment",
    });

    post2.replies.push(comment1._id);
    post3.replies.push(comment2._id);
    post2.replies.push(comment3._id);
    post2.replies.push(comment4._id);

    comment4.replies.push(comment5._id);
    comment5.replies.push(comment6._id);

    await post2.save();
    await post3.save();
    await comment4.save();
    await comment5.save();

    await User.findOneAndUpdate(
      { userName: "EngMohab" },
      {
        $push: {
          votePost: {
            $each: [
              { posts: post1._id, postVoteStatus: 1 },
              { posts: post2._id, postVoteStatus: 1 },
              { posts: post3._id, postVoteStatus: -1 },
              { posts: post4._id, postVoteStatus: -1 },
              { posts: sharedPost._id, postVoteStatus: 1 },
            ],
          },
          saved: {
            $each: [
              { savedPost: post2._id, createdAt: Date.now() },
              { savedPost: post3._id, createdAt: Date.now() },
              { savedPost: post4._id, createdAt: Date.now() },
              { savedPost: sharedPost._id, createdAt: Date.now() },
            ],
          },
          savedComments: {
            $each: [
              { savedComment: comment1._id, createdAt: Date.now() },
              { savedComment: comment2._id, createdAt: Date.now() },
              { savedComment: comment3._id, createdAt: Date.now() },
              { savedComment: comment4._id, createdAt: Date.now() },
              { savedComment: comment5._id, createdAt: Date.now() },
            ],
          },
          // socialLinks: {
          //   $each: [
          //     { social: facebook._id, userLink: "facebook", displayText: "Nour" },
          //     { social: twitter._id, userLink: "twitter", displayText: "Nour" },
          //   ],
          // },
          hidden: { $each: [post2._id, post3._id] },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await User.findOneAndUpdate(
      { userName: "EngEslam" },
      {
        $push: {
          votePost: {
            $each: [
              { posts: post1._id, postVoteStatus: 1 },
              { posts: post2._id, postVoteStatus: 1 },
              { posts: post3._id, postVoteStatus: -1 },
              { posts: post4._id, postVoteStatus: -1 },
              { posts: sharedPost._id, postVoteStatus: 1 },
            ],
          },
          saved: {
            $each: [
              { savedPost: post1._id, createdAt: Date.now() },
              { savedPost: post3._id, createdAt: Date.now() },
              { savedPost: sharedPost._id, createdAt: Date.now() },
            ],
          },
          savedComments: {
            $each: [
              { savedComment: comment1._id, createdAt: Date.now() },
              { savedComment: comment2._id, createdAt: Date.now() },
              { savedComment: comment4._id, createdAt: Date.now() },
              { savedComment: comment5._id, createdAt: Date.now() },
            ],
          },
          hidden: { $each: [post1._id, post4._id] },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    user0.meUserRelationship.push({
      userId: user1._id,
      status: "blocked",
    });
    user1.userMeRelationship.push({
      userId: user0._id,
      status: "blocked",
    });

    user2.meUserRelationship.push({
      userId: user0._id,
      status: "followed",
    });
    user0.userMeRelationship.push({
      userId: user2._id,
      status: "followed",
    });

    user0.followersCount += 1;
    user0.postKarma = 2;
    //   await user0.save();
    //   await user1.save();
    //   await user2.save();

    let flair1 = await Flair.create({
      text: "first flair",
      backgroundColor: "#111111",
      textColor: "#ffffff",
    });
    let flair2 = await Flair.create({
      text: "second flair",
      backgroundColor: "#121212",
      textColor: "#eeeeee",
    });
    let flair3 = await Flair.create({
      text: "third flair",
      backgroundColor: "#111111",
      textColor: "#f1f3f3",
    });

    try {
      let subreddit1 = await Subreddit.create({
        owner: user17._id,
        fixedName: "BACKENDSUBREDDIT",
        name: "BACKENDSUBREDDIT",
        description: "this is a backend subreddit",
        membersCount: 4,
        type: "Public",
        nsfw: false,
        rules: [
          {
            defaultName: "Rule 1",
            title: "No Front or Cross or Testing Developers Can join ",
            description: "Backend developers are best developers  ",
            appliesTo: "Posts",
          },
        ],
      });
      await Subreddit.findOneAndUpdate(
        { _id: subreddit1._id },
        {
          $push: {
            moderators: {
              $each: [
                {
                  user: user17._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user15._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user16._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user18._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
              ],
            },
            approved: {
              $each: [
                {
                  user: user17._id,
                },
                {
                  user: user15._id,
                },
                {
                  user: user16._id,
                },
                {
                  user: user18._id,
                },
              ],
            },
            users: {
              $each: [
                {
                  _id: user17._id,
                },
                {
                  _id: user15._id,
                },
                {
                  _id: user16._id,
                },
                {
                  _id: user18._id,
                },
              ],
            },
            flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
          },
        },
        { new: true }
      );

      let subreddit2 = await Subreddit.create({
        owner: user1._id,
        fixedName: "FRONTSUBREDDIT",
        name: "FRONTSUBREDDIT",
        description: "this is a front subreddit",
        membersCount: 5,
        type: "Public",
        nsfw: true,
        rules: [
          {
            defaultName: "Rule 1",
            title: "No Testing Developers Can join ",
            description:
              "Backend developers are best developers then Frontend developers  ",
            appliesTo: "Posts",
          },
        ],
      });
      await Subreddit.findOneAndUpdate(
        { _id: subreddit2._id },
        {
          $push: {
            moderators: {
              $each: [
                {
                  user: user1._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user3._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user4._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user5._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user6._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
              ],
            },
            approved: {
              $each: [
                {
                  user: user1._id,
                },
                {
                  user: user3._id,
                },
                {
                  user: user4._id,
                },
                {
                  user: user5._id,
                },
                {
                  user: user6._id,
                },
              ],
            },
            users: {
              $each: [
                {
                  _id: user1._id,
                },
                {
                  _id: user3._id,
                },
                {
                  _id: user4._id,
                },
                {
                  _id: user5._id,
                },
                {
                  _id: user6._id,
                },
              ],
            },
            flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
          },
        },
        { new: true }
      );

      let subreddit3 = await Subreddit.create({
        owner: user7._id,
        fixedName: "CROSSSUBREDDIT",
        name: "CROSSSUBREDDIT",
        description: "this is a cross subreddit",
        membersCount: 5,
        type: "Public",
        nsfw: false,
        rules: [
          {
            defaultName: "Rule 1",
            title: "No Testing Developers Can join ",
            description:
              "Backend developers are best developers then Cross developers  ",
            appliesTo: "Posts",
          },
        ],
      });
      await Subreddit.findOneAndUpdate(
        { _id: subreddit3._id },
        {
          $push: {
            moderators: {
              $each: [
                {
                  user: user7._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user8._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user9._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user10._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
                {
                  user: user11._id,
                  moderatorPermissions: {
                    all: true,
                    access: true,
                    config: true,
                    flair: true,
                    posts: true,
                  },
                },
              ],
            },
            approved: {
              $each: [
                {
                  user: user7._id,
                },
                {
                  user: user8._id,
                },
                {
                  user: user9._id,
                },
                {
                  user: user10._id,
                },
                {
                  user: user11._id,
                },
              ],
            },
            users: {
              $each: [
                {
                  _id: user7._id,
                },
                {
                  _id: user8._id,
                },
                {
                  _id: user9._id,
                },
                {
                  _id: user10._id,
                },
                {
                  _id: user11._id,
                },
              ],
            },
            flairIds: { $each: [flair1._id, flair2._id, flair3._id] },
          },
        },
        { new: true }
      );

      let subreddit_post1 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on Backend ",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post2 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on Backend again",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });

      let subreddit_post3 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on Backend again",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
        modState: "spammed",
      });

      let subreddit_post4 = await Post.create({
        title: "subreddit Post 2",
        kind: "self",
        text: "this subreddit post on Backend again",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair2._id,
        modState: "removed",
      });
      let subreddit_post5 = await Post.create({
        title: "subreddit Post 3",
        kind: "self",
        text: "Backend is best team",
        author: user15._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post6 = await Post.create({
        title: "subreddit Post 4",
        kind: "self",
        text: "Sabor is best ",
        author: user15._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post7 = await Post.create({
        title: "subreddit Post 5",
        kind: "self",
        text: "Fact: Sabor is the best",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post8 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "if you forgot fact that Sabor is the best, you will be banned from subreddit",
        author: user17._id,
        owner: subreddit1._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair3._id,
      });

      let subreddit_post9 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on front ",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post10 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on front again",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });

      let subreddit_post11 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on front again",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
        modState: "spammed",
      });

      let subreddit_post12 = await Post.create({
        title: "subreddit Post 2",
        kind: "self",
        text: "this subreddit post on front again",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair2._id,
        modState: "removed",
      });
      let subreddit_post13 = await Post.create({
        title: "subreddit Post 3",
        kind: "self",
        text: "Backend is best team",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post14 = await Post.create({
        title: "subreddit Post 4",
        kind: "self",
        text: "Sabor is best ",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post15 = await Post.create({
        title: "subreddit Post 5",
        kind: "self",
        text: "Fact: Sabor is the best",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post16 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "if you forgot fact that Sabor is the best, you will be banned from subreddit",
        author: user1._id,
        owner: subreddit2._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair3._id,
      });

      let subreddit_post17 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on cross ",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post18 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on cross again",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });

      let subreddit_post19 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "this subreddit post on cross again",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
        modState: "spammed",
      });

      let subreddit_post20 = await Post.create({
        title: "subreddit Post 2",
        kind: "self",
        text: "this subreddit post on cross again",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair2._id,
        modState: "removed",
      });
      let subreddit_post21 = await Post.create({
        title: "subreddit Post 3",
        kind: "self",
        text: "Backend is best team",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post22 = await Post.create({
        title: "subreddit Post 4",
        kind: "self",
        text: "Sabor is best ",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post23 = await Post.create({
        title: "subreddit Post 5",
        kind: "self",
        text: "Fact: Sabor is the best",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair1._id,
      });
      let subreddit_post24 = await Post.create({
        title: "subreddit Post",
        kind: "self",
        text: "if you forgot fact that Sabor is the best, you will be banned from subreddit",
        author: user7._id,
        owner: subreddit3._id,
        ownerType: "Subreddit",
        nsfw: true,
        spoiler: false,
        sendReplies: true,
        suggestedSort: "top",
        scheduled: false,
        votes: 0,
        views: 0,
        shareCount: 0,
        commentCount: 0,
        flairId: flair3._id,
      });

      user1.subreddits.push(subreddit2._id);
      user3.subreddits.push(subreddit2._id);
      user4.subreddits.push(subreddit2._id);
      user5.subreddits.push(subreddit2._id);
      user6.subreddits.push(subreddit2._id);
      user7.subreddits.push(subreddit3._id);
      user8.subreddits.push(subreddit3._id);
      user9.subreddits.push(subreddit3._id);
      user10.subreddits.push(subreddit3._id);
      user11.subreddits.push(subreddit3._id);
      user15.subreddits.push(subreddit1._id);
      user16.subreddits.push(subreddit1._id);
      user17.subreddits.push(subreddit1._id);
      user18.subreddits.push(subreddit1._id);
      await user1.save();
      await user2.save();
      await user3.save();
      await user4.save();
      await user5.save();
      await user6.save();
      await user7.save();
      await user8.save();
      await user9.save();
      await user10.save();
      await user11.save();
      await user15.save();
      await user16.save();
      await user17.save();
      await user18.save();
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log(err);
  }
};
