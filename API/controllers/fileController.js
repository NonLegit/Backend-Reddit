const multer = require("multer");
/**
 * FileController Class which handles authentication and authorization of user in backend
 */
class FileController {
  /**
   * Constructor
   * Depends on user services object
   * @param {object} FileService - user service object
   */
  constructor({ FileService }) {
    this.FileService = FileService; // can be mocked in unit testing
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
  
}

module.exports = FileController;
