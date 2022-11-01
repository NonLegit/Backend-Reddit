const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: [true, "this username is already exists"],
        required: [true, "Enter unique username"],
    },
    displayName: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: [true, "this email is already exists"],
        lowercase: true,
        validate: [validator.isEmail, " Provide valid email"],
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        minlength: 8,
        select: false,
    },
    lastUpdatedPassword: {
        type: Date,
        required: false,
    },
    passwordResetToken: {
        type: String,
        required: false,
    },
    passwordResetExpires: {
        type: Date,
        required: false,
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        select: false,
    },
    emailVerified: {
        type: Boolean,
        required: false,
    },
    accountActivated: {
        type: Boolean,
        required: false,
        default: true,
    },

    karma: {
        type: Number,
        default: 0,
    },
    profilePicture: {
        type: String,
        default: "default.png",
        // it will be unique with time stamp and username
        //unique: true,
    },
    // log out make active Now false and in log in make active now true
    activeNow: {
        type: Boolean,
        required: false,
        default: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    followersCount: {
        type: Number,
        default: 0,
    },
    friendsCount: {
        type: Number,
        default: 0,
    },

    // user preferences
    canbeFollowed: {
        type: Boolean,
        required: false,
        default: true,
    },
    contentvisibility: {
        type: Boolean,
        required: false,
        default: true,
    },
    nsfw: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowInboxMessage: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowMentions: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowCommentsOnPosts: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowUpvotesOnComments: {
        type: Boolean,
        required: false,
        default: true,
    },
    allowUpvotesOnPosts: {
        type: Boolean,
        required: false,
        default: true,
    },
});

userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.lastUpdatedPassword = Date.now() - 1000;
    next();
});
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ accountActivated: { $ne: false } });
    next();
});

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes only

    return resetToken;
};
const User = mongoose.model("User", userSchema);

// singleton User model
module.exports = User;
