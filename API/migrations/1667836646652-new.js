/**
 * Make any changes you need to make to the database here
 */
// const mongoose = require("mongoose");
// const User = require("./../models/userModel");
// const Post = require("./../models/postModel");
// mongoose.connect("mongodb://localhost:27017/redditDB", {
//   useNewUrlParser: true,
// });
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

async function up() {
  // Write migration here
  const seeder = require("./../models/seed");
  await seeder();
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
