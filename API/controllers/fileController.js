const multer = require("multer");
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
  constructor() {
    // this.FileService = FileService; // can be mocked in unit testing
    this.multerStorage = multer.memoryStorage();
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
      }
      else{
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
      }
      else{
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
