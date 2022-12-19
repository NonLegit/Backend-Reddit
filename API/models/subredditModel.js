const mongoose = require("mongoose");
const validator = require("validator");

const subredditSchema = new mongoose.Schema({
  fixedName: {
    type: String,
    required: [true, "subreddit must have a name"],
    unique: true,
    trim: true,
    maxlength: [
      40,
      "A subreddit name must have less or equal then 40 characters",
    ],
    minlength: [
      2,
      "A subreddit name must have more or equal then 2 characters",
    ],
  },
  name: { type: String, default: " " },
  isJoined: { type: Boolean, default: false },
  rules: [
    {
      createdAt: {
        type: Date,
        default: Date.now(),
        select: true,
      },
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
  ],
  description: {
    type: String,
    required: false,
    default: "",
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
    default: "Unknown",
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
  allowImgs: { type: Boolean, required: false, default: true },
  allowVideos: { type: Boolean, required: false, default: true },
  allowLinks: { type: Boolean, required: false, default: true },
  suggestedSort: { type: String, default: "Top" },
  icon: {
    type: String,
    required: false,
    default: "subreddits/default.png",
    trim: true, // *TODO: it will be unique with time stamp and username
  },
  backgroundImage: {
    type: String,
    required: false,
    default: "subreddits/default.png",
    trim: true, // *TODO: it will be unique with time stamp and username
  },
  membersCount: {
    type: Number,
    required: false,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  topics: {
    type: [{ type: String }],
    validate: [topicsLimit, "{PATH} exceeds the limit of 25"],
  },
  primaryTopic: {
    type: String,
    default: "Add a Primary Topic",
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
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: false,
      },
      userName: { type: String },
      joiningDate: { type: Date, required: true, default: Date.now() },
      profilePicture: {
        type: String,
        required: false,
        trim: true, // *TODO: it will be unique with time stamp and username
        default: "users/default.png",
      },
      moderatorPermissions: {
        type: Object,
        required: false,
        all: { type: Boolean }, // everything
        access: { type: Boolean }, // can edit users
        config: { type: Boolean }, // manage settings
        flair: { type: Boolean }, // manage flairs
        posts: { type: Boolean }, // manage posts
      },
    },
  ],
  flairIds: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Flair",
    },
  ],
  punished: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: false,
      },
      userName: { type: String },
      banDate: { type: Date, default: Date.now() },
      profilePicture: {
        type: String,
        required: false,
        trim: true, // *TODO: it will be unique with time stamp and username
        default: "users/default.png",
      },
      type: { type: String, enum: ["banned", "muted"], required: true },
      banInfo: {
        punishReason: { type: String, trim: true, default: "No reason" },
        punish_type: { type: String, default: "other" },
        Note: { type: String, default: "no Note" },
        duration: {
          type: Number,
        },
      },
      muteInfo: {
        muteMessage: { type: String, default: "Spammer" },
      },
    },
  ],
  approved: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: false,
      },
      approvedDate: { type: Date, default: Date.now() },
    },
  ],
});

//Indexed fields for search
// subredditSchema.index({
//   name: "text",
//   fixedName: "text",
//   description: "text",
//   'rules.title': "text",
//   'rules.description': "text",
//   primaryTopic: "text",
//   topics: "text",
// });
subredditSchema.index({ "$**": "text" });

function topicsLimit(val) {
  return val.length <= 25;
}
subredditSchema.post("init", function (doc) {
  doc.icon = `${process.env.BACKDOMAIN}/` + doc.icon;
  doc.backgroundImage = `${process.env.BACKDOMAIN}/` + doc.backgroundImage;
});
const subreddit = mongoose.model("Subreddit", subredditSchema);

// singleton User model
module.exports = subreddit;
