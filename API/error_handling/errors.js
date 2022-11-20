/**
 * @readonly
 * @enum {Number}
 * Enum for errors
 * Freezing the object makes it immutable,
 * that is, you can't add/remove properties or change their values.
 * This is essential to mock the behavior of enum which isn't natively supported by JS
 */
exports.postErrors = Object.freeze({
  MONGO_ERR: 0,
  NOT_AUTHOR: 1,
  INVALID_POST_KIND: 2,
  INVALID_OWNER: 3,
  SUBREDDIT_NOT_FOUND: 4,
  POST_NOT_FOUND: 5,
  NOT_EDITABLE: 7,
});

exports.commentErrors = Object.freeze({
  MONGO_ERR: 0,
  NOT_AUTHOR: 1,
  INVALID_PARENT: 2,
  COMMENT_NOT_FOUND: 3,
});

exports.subredditErrors = Object.freeze({
  MONGO_ERR: 0,
  SUBREDDIT_NOT_FOUND: 1,
  BANNED: 2,
  MUTED: 3,
  NOT_OWNER: 4,
  NOT_MODERATOR: 5,
  ALREADY_EXISTS: 6,
  INVALID_ENUM: 7,
});

exports.userErrors = Object.freeze({
  MONGO_ERR: 0,
  USER_NOT_FOUND: 1,
  USER_ALREADY_EXISTS: 2,
  INCORRECT_PASSWORD: 3,
  EMAIL_ERROR:5,
  INVALID_TOKEN:6,
  INVALID_RESET_TOKEN:7,

});

exports.mongoErrors = Object.freeze({
  NOT_FOUND: 0,
  VALIDATION: 1,
  INVALID_ID: 2,
  DUPLICATRE_KEY: 3,
  UNKOWN: 4,
});

exports.decorateError = (err) => {
  let msg = "",
    error = this.mongoErrors.UNKOWN;

  if (err.name === "CastError") {
    error = this.mongoErrors.INVALID_ID;
    msg = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    //Extracting the duplicate value from the error msg
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error = this.mongoErrors.DUPLICATRE_KEY;
    msg = `Duplicate field value: ${value}`;
  } else if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => {
      if (el.name === "CastError") return el.path;
      return el.message;
    });
    error = this.mongoErrors.VALIDATION;
    msg = `Invalid data: ${errors.join(", ")}`;
  }

  return { error, msg };
};