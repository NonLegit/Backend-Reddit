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
  firebaseToken: {
    type: [String],
    required: false,
    select: false,
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
  verificationToken: {
    type: String,
    required: false,
  },
  verificationTokenExpires: {
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
    default: false,
  },
  accountActivated: {
    type: Boolean,
    required: false,
    default: true,
  },

  postKarma: {
    type: Number,
    default: 0,
  },
  commentKarma: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    default: "users/default.png",
    // it will be unique with time stamp and username
    //unique: true,
  },
  profileBackground: {
    type: String,
    default: "users/defaultcover.png",
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
    default: "",
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
  country: {
    type: String,
    required: false,
    default: "Egypt",
    trim: true,
  },
  autoplayMedia: {
    type: Boolean,
    required: false,
    default: true,
  },
  adultContent: {
    type: Boolean,
    required: false,
    default: false,
  },
  canbeFollowed: {
    type: Boolean,
    required: false,
    default: true,
  },
  nsfw: {
    type: Boolean,
    required: false,
    default: true,
  },
  saved: [
    {
      savedPost: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
  // saved: [
  //   {
  //     saved: {
  //       type: mongoose.Schema.ObjectId,
  //       refPath: "saved.savedType",
  //     },
  //     savedType: {
  //       type: String,
  //       enum: ["Post", "Comment"],
  //     },
  //     createdAt:{
  //       type: Date,
  //       required: true,
  //       default: Date.now(),
  //     }
  //   },
  // ],

  // saved: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Post",
  //   },
  // ],
  savedComments: [
    {
      savedComment: {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
  // savedComment: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Comment",
  //   },
  // ],
  hidden: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  ],
  spam: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  ],
  votePost: [
    {
      posts: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
      postVoteStatus: {
        type: Number,
        enum: [1, 0, -1], // 1 upvote o no vote -1 downvote
        default: 0,
      },
    },
  ],
  voteComment: [
    {
      comments: {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
      commentVoteStatus: {
        type: Number,
        enum: [1, 0, -1], // 1 upvote o no vote -1 downvote
        default: 0,
      },
    },
  ],
  // me blocked or followed a user , take care of blocked state
  meUserRelationship: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["friend", "blocked", "followed", "none"],
        default: "none",
      },
    },
  ],
  // users blocked or followed me
  userMeRelationship: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["friend", "blocked", "followed", "none"],
        default: "none",
      },
    },
  ],
  subscribed: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Subreddit",
      required: true,
    },
  ],
  subreddits: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Subreddit",
    },
  ],
  pendingInvitations: [
    {
      type: Object,
      subredditId: {
        type: mongoose.Schema.ObjectId,
        ref: "Subreddit",
      },
      permissions: {
        type: Object,
        required: false,
        all: { type: Boolean },
        access: { type: Boolean },
        config: { type: Boolean },
        flair: { type: Boolean },
        posts: { type: Boolean },
      },
    },
  ],

  favourites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Subreddit",
    },
  ],

  socialLinks: [
    {
      social: {
        type: mongoose.Schema.ObjectId,
        ref: "Social",
        autopopulate: true,
      },
      userLink: {
        type: String,
        required: true,
        // default: "",
      },
      displayText: {
        type: String,
        required: true,
      },
    },
  ],
  /*
  contentVisibility: {
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
  */
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  let profileBackground = this.profileBackground;
  let profilePicture = this.profilePicture;
  this.profilePicture = profilePicture.replace(
    `${process.env.BACKDOMAIN}/`,
    ""
  );
  this.profileBackground = profileBackground.replace(
    `${process.env.BACKDOMAIN}/`,
    ""
  );
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.lastUpdatedPassword = Date.now() - 1000;
  if (this.userName === "user") this.userName = "user" + this._id;
  if (this.displayName === undefined) this.displayName = this.userName; // add display name in case of google and facbook name
  console.log("user to save", this);
  next();
});
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ accountActivated: { $ne: false } });
  next();
});
userSchema.post(/^findOne/, async function (doc) {
  // this points to the current query
  if (doc) {
    await doc.populate({
      path: "socialLinks.social",
      select: "-__v",
    });
    doc.profilePicture = `${process.env.BACKDOMAIN}/` + doc.profilePicture;
    doc.profileBackground =
      `${process.env.BACKDOMAIN}/` + doc.profileBackground;
  }
  //next();
});
userSchema.post("init", function (doc) {
  // doc.profilePicture = `${process.env.BACKDOMAIN}/` + doc.profilePicture;
  // doc.profileBackground =
  //   `${process.env.BACKDOMAIN}/` + doc.profileBackground;
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
userSchema.methods.createVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.verificationTokenExpires = Date.now() + 259200000; // valid for 3 days  only

  return verificationToken;
};
userSchema.methods.checkPassword = async function (
  enteredPassword,
  truePassword
) {
  return await bcrypt.compare(enteredPassword, truePassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.lastUpdatedPassword) {
    const changedTimestamp = parseInt(
      this.lastUpdatedPassword.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.methods.replaceProfileDomain = function () {
  let profileBackground = this.profileBackground;
  let profilePicture = this.profilePicture;
  this.profilePicture = profilePicture.replace(
    `${process.env.BACKDOMAIN}/`,
    ""
  );
  this.profileBackground = profileBackground.replace(
    `${process.env.BACKDOMAIN}/`,
    ""
  );
};
const User = mongoose.model("User", userSchema);

// singleton User model
module.exports = User;
