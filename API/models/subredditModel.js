const mongoose = require("mongoose");
const validator = require("validator");

// *TODO: change all ids to objectid after merging with dev branch
//    *TODO: postId
//    *TODO: owner
//    *TODO: moderators.username
// ! Dont forget to push again

const subredditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "subreddit Name must be unique"],
    unique: true,
    trim: true,
    maxlength: [
      40,
      "A subreddit name must have less or equal then 40 characters",
    ],
    minlength: [
      10,
      "A subreddit name must have more or equal then 10 characters",
    ],
  },
  rules: {
    type: Object,
    required: false,
    defaultName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    appliesTo: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  language: {
    type: String,
    required: false,
    trim: true,
  },
  region: {
    type: String,
    required: false,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Public", "Private", "Restricted"],
    required: [true, "subreddit must have a type"],
    default: "Public",
  },
  nsfw: {
    type: Boolean,
    required: true,
  },
  postType: {
    type: String,
    enum: ["Text", "ImgOrvid", "Link"],
    required: false,
    default: "Text",
  },
  removalReason: {
    type: Object,
    title: {
      type: String,
      trim: true,
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  allowCrossposting: {
    type: Boolean,
    required: false,
    default: true,
  },
  allowArchivePosts: {
    type: Boolean,
    required: false,
    default: true,
  },
  allowSpoilerTag: {
    type: Boolean,
    required: false,
    default: true,
  },
  allowImageUploads: {
    type: Boolean,
    required: false,
    default: true,
  },
  allowMultipleImage: {
    type: Boolean,
    required: false,
    default: true,
  },
  allowGif: {
    type: Boolean,
    required: false,
    default: true,
  },
  icon: {
    type: String,
    required: false,
    trim: true, // *TODO: it will be unique with time stamp and username
  },
  backgroundImage: {
    type: String,
    required: false,
    trim: true, // *TODO: it will be unique with time stamp and username
  },
  usersCount: {
    type: Number,
    required: false,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  topics: {
    type: [{ type: String }],
    validate: [topicsLimit, "{PATH} exceeds the limit of 25"],
  },
  // Relationships attributes
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  }, //subreddit owner (first mod) by time of being mod

  moderators: [
    {
      type: Object,
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: false,
      },
      mod_time: { type: Date, default: Date.now() },
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
  posts: [
    {
      postId: {
        // ref post => (nsfw ,spoiler)
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post",
        required: false,
      },
      is_scheduled: { type: Boolean, default: false },
      schaduled_time: { type: Date, default: Date.now() },
      category: { type: String, enum: ["spam", "edited", "unmoderated"] },
      spamCount: { type: Number, default: 0 },
    },
  ],
  flairIds: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "flair",
    },
  ],
  punishers: [
    {
      userIds: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: false,
        trim: true,
      },
      type: { type: String, enum: ["baned", "muted"] },
      punishReason: { type: String, trim: true },
      punish_type: { type: String },
      Note: { type: String },
      duration: {
        startTime: { type: Date },
        endTime: { type: Date },
      },
    },
  ],
});

function topicsLimit(val) {
  return val.length <= 25;
}

const subreddit = mongoose.model("Subreddit", subredditSchema);

// singleton User model
module.exports = subreddit;
