const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;

const Post = require("../models/postModel");
const User = require("../models/userModel");

const Flair = require("../models/flairModel");
const Subreddit = require("../models/subredditModel");
const dotenv = require("dotenv");
dotenv.config();
if (process.env.NODE_ENV === "test") {
  const DB = process.env.DATABASE_LOCAL;
  const mockgoose = new Mockgoose(mongoose);
  mockgoose.prepareStorage().then(() => {
    console.log("helooooo");
    mongoose
      .connect(DB)
      .then(() => console.log("Fake DB connection for testing successful!"));
    
  });
} else {
  const DB = process.env.DATABASE_LOCAL;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const connection = mongoose.connection;
connection.once("open", function() {
console.log("*** MongoDB got connected ***");
console.log(`Our Current Database Name : ${connection.db.databaseName}`);
mongoose.connection.db.dropDatabase(
console.log(`${connection.db.databaseName} database dropped.`)
);
});}

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
  
  let userAhmed = await User.findOne({ userName: "Ahmed" });

  let subreddit1 = await Subreddit.create({
    owner: user1._id,
    name:"first_subreddit",
    type: "Public",
    nsfw: true,
  });
  let subreddit2 = await Subreddit.create({
    owner: user2._id,
    name:"second_subreddit",
    type: "Public",
    nsfw:true,
  });
  
  
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
    votes: 1,
    views: 8,
    commentCount:5
    
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
    votes: 1,
    views: 87,
    commentCount:50
  });
  let post3 = await Post.create({
    title: "kiro post",
    kind: "self",
    text: "this is a test post 3",
    author: user1._id,
    owner: subreddit1._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 85,
    views: 6,
    commentCount:2
  });
  let post4 = await Post.create({
    title: "doaa post",
    kind: "self",
    text: "this is a test post 4",
    author: user1._id,
    owner: subreddit2._id,
    ownerType: "User",
    nsfw: true,
    spoiler: true,
    sendReplies: true,
    suggestedSort: "top",
    scheduled: false,
    votes: 9,
    views: 4,
    commentCount:0
  });

 
  
};
