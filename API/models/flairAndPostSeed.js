const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;


const User = require("./userModel");

const Flair = require("./flairModel");
const Subreddit = require("./subredditModel");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
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
  
  
  

 
  
};
