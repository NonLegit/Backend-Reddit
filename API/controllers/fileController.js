const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { postErrors } = require("../error_handling/errors");

/**
 * FileController Class which handles authentication and authorization of user in backend
 */
class FileController {
  /**
   * Constructor
   * Depends on user services object
   * @param {object} FileService - user service object
   */
  constructor({ UserService, subredditService, PostService }) {
    // this.FileService = FileService; // can be mocked in unit testing
    this.UserServices = UserService; // can be mocked in unit testing
    this.subredditService = subredditService; // can be mocked in unit testing
    this.PostService = PostService;
    this.multerStorage = multer.memoryStorage();
    this.upload = multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter,
    });
  }
  multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb("error", false);
    }
  };
  getUpload() {
    return this.upload;
  }
  checkUploadedFile = async (req, res, next) => {
    await this.upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
      } else if (err) {
        res.status(400).json({
          status: "fail",
          errorMessage: "Please provide only images",
        });
      } else {
        if (!req.file) {
          res.status(400).json({
            status: "fail",
            errorMessage: "Please provide image you want to save",
          });
        } else {
          next();
        }
      }
    });
  };
  uploadUserImage = async (req, res, next) => {
    const type = req.body.type;
    if (type === "profilePicture" || type === "profileBackground") {
      req.file.filename = `${req.user.userName}/user-${
        req.user.userName
      }-${Date.now()}.jpeg`;
      console.log(req.file.filename);
      var x = 500;
      var y = 500;
      if (type === "profileBackground") {
        x = 1000;
        y = 1000;
      }
      try {
        let dir = "public/users/" + req.user.userName;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        await sharp(req.file.buffer)
          .resize(x, y)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/users/${req.file.filename}`);
        // .toFile(`./../public/users/${req.file.filename}`);
        let user = await this.UserServices.addUserImageURL(
          req.user._id,
          type,
          req.file.filename
        );
        const me = {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          profilePicture: user.profilePicture,
          profileBackground: user.profileBackground,
          canbeFollowed: user.canbeFollowed,
          lastUpdatedPassword: user.lastUpdatedPassword,
          followersCount: user.followersCount,
          friendsCount: user.friendsCount,
          accountActivated: user.accountActivated,
          gender: user.gender,
          displayName: user.displayName,
          postKarma: user.postKarma,
          commentKarma: user.commentKarma,
          createdAt: user.joinDate,
          description: user.description,
          adultContent: user.adultContent,
          nsfw: user.nsfw,
        };
        res.status(201).json({
          status: "success",
          user: me,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(400).json({
        status: "fail",
        errorMessage: "Please provide correct type of image you want to save",
      });
    }
  };

  uploadSubredditImage = async (req, res, next) => {
    // check on type is provided or not
    // check subreddit exists
    let subreddit = await this.subredditService.retrieveSubreddit(
      req.user._id,
      req.params.subredditName,
      true
    );
    if (!subreddit.success)
      return { success: false, error: subredditErrors.SUBREDDIT_NOT_FOUND };
    console.log(subreddit);
    // check user is moderator in subreddit
    if (!subreddit.data.moderators.find((el) => el.user.equals(req.user._id))) {
      return { success: false, error: subredditErrors.NOT_MODERATOR };
    }

    const type = req.body.type;
    req.file.filename = `${req.params.subredditName}/subreddit-${
      req.params.subredditName
    }-${Date.now()}.jpeg`;
    console.log(req.file.filename);
    var x = 500;
    var y = 500;

    try {
      let dir = "public/subreddits/" + req.params.subredditName;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      await sharp(req.file.buffer)
        .resize(x, y)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/subreddits/${req.file.filename}`);
      // .toFile(`./../public/users/${req.file.filename}`);
      let subreddit = await this.subredditService.addUserImageURL(
        req.params.subredditName,
        type,
        req.file.filename
      );
      res.status(201).json({
        status: "success",
        subreddit: subreddit,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: "fail",
        errorMessage: "Bad Request",
      });
    }
  };
  deleteUserImage = async (req, res, next) => {
    let type = req.query.type;
    console.log(type);
    if (type === "profilePicture" || type === "profileBackground") {
      console.log(req.user._id);
      try {
        let user = await this.UserServices.addUserImageURL(
          req.user._id,
          type,
          "default.png"
        );
      } catch (err) {
        console.log(err);
      }

      res.status(204).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        errorMessage: "provide type of image",
      });
    }
  };

  uploadPostFiles = async (req, res) => {
    const postId = req.params?.postId;
    const { kind, caption, link } = req.body;
    const file = req.file;
    const extension = file.originalname.split(".").pop();
    const mimetype = file.mimetype;

    if (!postId || !kind || (kind !== "image" && kind !== "video")) {
      res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
      return;
    }

    const post = await this.PostService.isAuth(postId, req.user._id, "kind");
    if (!post.success) {
      let msg, stat;
      switch (post.error) {
        case postErrors.NOT_AUTHOR:
          msg = "User must be author";
          stat = 401;
          break;
        case postErrors.POST_NOT_FOUND:
          msg = "Post not found";
          stat = 404;
          break;
      }
      res.status(stat).json({
        status: "fail",
        message: msg,
      });
      return;
    }

    if (post.data.kind !== kind) {
      res.status(400).json({
        status: "fail",
        message: "Conflict in post kind",
      });
      return;
    }

    if (kind === "image") {
      const allowedExts = ["jpeg", "jpg", "png", "svg", "webp"];
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ];
      if (
        !allowedExts.includes(extension) ||
        !allowedMimeTypes.includes(mimetype)
      ) {
        res.status(400).json({
          status: "fail",
          message: "Unsupported image format",
        });
        return;
      }

      file.filename = `${req.params.postId}/post-${
        req.params.postId
      }-${Date.now()}.jpeg`;

      var x = 1200;
      var y = 630;

      let dir = "public/posts/" + req.params.postId;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      await sharp(file.buffer)
        .resize(x, y)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/posts/${file.filename}`);
    } else if (kind === "video") {
      const allowedExts = ["mp4", "webm"];
      const allowedMimeTypes = ["video/mp4", "video/webm"];

      if (
        !allowedExts.includes(extension) ||
        !allowedMimeTypes.includes(mimetype)
      ) {
        res.status(400).json({
          status: "fail",
          message: "Unsupported video format, use either mp4 or webm",
        });
        return;
      }

      file.filename = `${req.params.postId}/post-${
        req.params.postId
      }-${Date.now()}.${extension}`;

      let dir = "public/posts/" + req.params.postId;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      fs.writeFileSync(`public/posts/${file.filename}`, file.buffer);
    }

    const updatedPost = await this.PostService.addFile(
      postId,
      kind,
      "posts/" + file.filename
    );

    res.status(201).json({
      status: "success",
      post: updatedPost,
    });
  };
}

module.exports = FileController;
