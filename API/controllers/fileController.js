const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
/**
 * FileController Class which handles authentication and authorization of user in backend
 */
class FileController {
  /**
   * Constructor
   * Depends on user services object
   * @param {object} FileService - user service object
   */
  constructor({ UserService, subredditService }) {
    // this.FileService = FileService; // can be mocked in unit testing
    this.UserServices = UserService; // can be mocked in unit testing
    this.subredditService = subredditService; // can be mocked in unit testing
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

    // check user is moderator in subreddit

  

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
  getUserProfileImage(req, res, next) {
    const fileName = req.params.fileName;
    const filePath = `./public/users/${fileName}`;

    // Check if file specified by the filePath exists
    fs.exists(filePath, function (exists) {
      if (exists) {
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        res.writeHead(200, {
          "Content-Type": "img/png",
          "Content-Disposition": "attachment; filename=" + fileName,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      } else {
        res.writeHead(200, {
          "Content-Type": "img/png",
          "Content-Disposition": "attachment; filename=" + "default.png",
        });
        fs.createReadStream("./public/users/default.png").pipe(res);
      }
    });
  }
  getPostImage(req, res, next) {
    const fileName = req.params.fileName;
    const filePath = `./public/posts/${fileName}`;

    // Check if file specified by the filePath exists
    fs.exists(filePath, function (exists) {
      if (exists) {
        // Content-type is very interesting part that guarantee that
        // Web browser will handle response in an appropriate manner.
        res.writeHead(200, {
          "Content-Type": "img/png",
          "Content-Disposition": "attachment; filename=" + fileName,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      } else {
        res.writeHead(200, {
          "Content-Type": "img/jpg",
          "Content-Disposition": "attachment; filename=" + "default.jpg",
        });
        fs.createReadStream("./public/posts/default.jpg").pipe(res);
      }
    });
  }
}

module.exports = FileController;
