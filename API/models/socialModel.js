const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema({
  type: {
    type: String,
    unique: [true, "this social media exists"],
    required: [true, "Enter unique social media"],
  },
  baseLink: {
    type: String,
    required: false,
    trim: true,
  },
  placeholderLink: {
    type: String,
    required: false,
    trim: true,
  },
  icon: {
    type: String,
    default: "icons/default.png",
    // it will be unique with time stamp and username
    //unique: true,
  },
  popularity: {
    type: Number,
    default: 0,
    required: false,
  },
});

socialSchema.post("init", function (doc) {
  console.log("post-init");
  console.log(doc);
  doc.icon = `${process.env.BACKDOMAIN}/` + doc.icon;
});
const Social = mongoose.model("Social", socialSchema);

// singleton User model
module.exports = Social;
