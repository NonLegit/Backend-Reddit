/**
 * Make any changes you need to make to the database here
 */
const mongoose = require("mongoose");
const User = require("./../models/userModel");
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
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
    // Write migration here
}

module.exports = { up, down };
