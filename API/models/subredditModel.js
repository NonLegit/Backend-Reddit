const mongoose = require("mongoose");
const validator = require("validator");

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
  NSFW: {
    type: Boolean,
    required: false,
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
      required: true,
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
    trim: true,
    // unique:true,
  },
  backgroundImage: {
    type: String,
    required: false,
    trim: true,
    // unique:true,
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
  topics: [String],
  // Relationships attributes

  owner: { type: String }, //subreddit owner (first mod) by time of being mod
  members: [
    {
      username: { type: String, unique: true, trim: true },
      is_mod: { type: Boolean, default: false },
      mod_time: { type: Date, default: Date.now() },
    },
  ],

  posts: [
    {
      post_id: { type: String, unique: true, trim: true },
      is_scheduled: { type: Boolean, default: false },
      schaduled_time: { type: Date, default: Date.now() },
    },
  ],
  flairs: [String],
  baned: [
    {
      userName: { type: String, unique: true, trim: true },
      banReason: { type: String, trim: true },
      ban_type: { type: String },
      Note: { type: String },
      duration: {
        startTime: { type: Date },
        endTime: { type: Date },
      },
    },
  ],
  muted: [
    {
      userName: { type: String, unique: true, trim: true },
      muteReason: { type: String, trim: true },
      mute_type: { type: String },
      Note: { type: String },
      duration: {
        startTime: { type: Date },
        endTime: { type: Date },
      },
    },
  ],
});

const subreddit = mongoose.model("Subreddit", subredditSchema);

// singleton User model
module.exports = subreddit;
