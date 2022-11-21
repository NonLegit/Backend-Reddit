const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { passwordStrength } = require("check-password-strength");
const generator = require("generate-password");
const { userErrors } = require("../error_handling/errors");

const { promisify } = require("util");

/**
 * User Service Class for handleing user model and services
 */
class UserService {
  /**
   * User Service Constructor
   * Depend on User,UserRepository Class which deals with database and email Services
   * @param {object} User - User Data Model
   * @param {object} UserRepository - User Repository Object for Deal with mongodb
   * @param {object} emailServices - Email Service Object for send emails to users
   */
  constructor({ /*Repository*/ UserRepository, Email }) {
    //this.User = User; // can be mocked in unit testing
    //this.userRepository = Repository; // can be mocked in unit testing
    this.userRepository = UserRepository; // can be mocked in unit testing
    this.emailServices = Email;
    // this.createUser = this.createUser.bind(this);
    // this.createToken = this.createToken.bind(this);
    // this.signUp = this.signUp.bind(this);
    // this.logIn = this.logIn.bind(this);
    // this.forgotPassword = this.forgotPassword.bind(this);
    // this.forgotUserName = this.forgotUserName.bind(this);
    // this.resetPassword = this.resetPassword.bind(this);
    // this.getUser = this.getUser.bind(this);
    // this.getUserByEmail = this.getUserByEmail.bind(this);
    // this.getUserByName = this.getUserByName.bind(this);
    // this.decodeToken = this.decodeToken.bind(this);
    // this.getPrefs = this.getPrefs.bind(this);
    // this.updatePrefs = this.updatePrefs.bind(this);
    // this.filterObj = this.filterObj.bind(this);

    // this.isAvailable = this.isAvailable.bind(this);
    // this.subscribe = this.subscribe.bind(this);
  }

  generateRandomPassword() {
    var password = generator.generate({
      length: 10,
      uppercase: true,
      numbers: true,
      symbols: true,
    });
    console.log(password);
    return password;
  }
  checkPasswordStrength(password) {
    console.log(passwordStrength(password));
    return passwordStrength(password).value;
  }
  async createUser(data) {
    try {
      let user = await this.userRepository.createOne(data);
      return user;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  /**
   * @property {Function} createToken create user token
   * @param {string} id - User Id to be stored in token
   * @returns {string} - User Token
   */
  createToken(id) {
    // what to put in token ?
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  }
  /**
   * @property {Function} signUp sign up user in backend
   * add user in database if not exists before
   * or reject services if user already exists.
   * @param {object} email - user email (unique)
   * @param {string} userName - user user name (unique)
   * @param {string} password - user password
   * @returns {object} - response of signup contain status of services and body to send to client
   */
  async signUp(email, userName, password) {
    const userData = {
      email: email,
      userName: userName,
      password: password,
    };
    //this.checkPasswordStrength(password);
    let user = await this.userRepository.createOne(userData);
    if (user.success === false) {
      // user with this email or username is exists
      const response = {
        success: false,
        error: userErrors.USER_ALREADY_EXISTS,
        msg: user.msg,
      };
      return response;
    } else {
      const token = this.createToken(user.doc._id);
      const response = {
        success: true,
        token: token,
      };
      return response;
    }
  }
  /**
   * @property {Function} logIn login user in backend
   * check if user is already in database and add correct pasword to authenticate user and send token
   * or reject services if not found or incorrect password entered
   * @param {string} userName - user user name (unique)
   * @param {string} password - user password
   * @returns {object} - response of login contain status of services and body to send to client
   */
  async logIn(userName, password) {
    let user = await this.userRepository.findByUserName(userName, "+password");
    if (user.success === false) {
      const response = {
        success: false,
        error: userErrors.USER_NOT_FOUND,
        msg: user.msg,
        // msg:"invaild userName or password",
      };
      return response;
    } else {
      if (await user.doc.checkPassword(password, user.doc.password)) {
        const token = this.createToken(user.doc._id);
        const response = {
          success: true,
          token: token,
        };
        return response;
      } else {
        const response = {
          success: false,
          error: userErrors.INCORRECT_PASSWORD,
          msg: "Incorrect Password",
          // msg:"invaild userName or password",
        };
        return response;
      }
    }
  }
  /**
   * @property {Function} forgotUserName send username to user
   * @param {string} email - user email to send username to it
   * @returns {object} - response of forgotUserName contain status of services and body to send to client
   */
  async forgotUserName(email) {
    try {
      let user = await this.userRepository.findByEmail(email);
      if (user.success === true) {
        await this.emailServices.sendUserName(user.doc);
        const response = {
          success: true,
        };
        return response;
      } else {
        const response = {
          success: false,
          error: userErrors.USER_NOT_FOUND,
          msg: "User Not Found",
        };
        return response;
      }
    } catch (err) {
      console.log(err);
      const response = {
        success: false,
        error: userErrors.EMAIL_ERROR,
        msg: "Cannot Send Emails at that moment ,try again later",
      };
      return response;
    }
  }
  /**
   * @property {Function} forgotPassword send reset token to user
   * check user is already exists in database then create reset token and send it to provided email
   * @param {string} userName - user name
   * @param {string} email - user email
   * @returns {object} - response of forgotPassword contain status of services and body to send to client
   */
  async forgotPassword(userName, email) {
    try {
      let user = await this.userRepository.findByEmailAndUserName(
        userName,
        email
      );

      if (user.success === true) {
        const resetToken = user.doc.createPasswordResetToken();
        await user.doc.save({ validateBeforeSave: false });
        const resetURL = `${process.env.FRONTDOMAIN}resetPassword/${resetToken}`;
        await this.emailServices.sendPasswordReset(user.doc, resetURL);
        const response = {
          success: true,
        };
        return response;
      } else {
        const response = {
          success: false,
          error: userErrors.USER_NOT_FOUND,
          msg: "User Not Found",
        };
        return response;
      }
    } catch (err) {
      const response = {
        success: false,
        error: userErrors.EMAIL_ERROR,
        msg: "Cannot Send Emails at that moment ,try again later",
      };
      return response;
    }
  }
  /**
   * @property {Function} resetPassword reset user password
   * check if token expired or not then insert new password in database in case of not expired
   * @param {string} resetToken - unique reset token sent to mail
   * @param {string} password  - new password of user
   * @returns {object} - response of resetPassword contain status of services and body to send to client
   */
  async resetPassword(resetToken, password) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    let user = await this.userRepository.findByResetPassword(hashedToken);
    if (user.success === false) {
      // invalid token or time passed
      const response = {
        success: false,
        error: userErrors.INVALID_RESET_TOKEN,
        msg: "Token Invalid or Has Expired",
      };
      return response;
    } else {
      user.doc.password = password;
      user.doc.passwordResetToken = undefined;
      user.doc.passwordResetExpires = undefined;
      await user.doc.save();
      const token = this.createToken(user.doc._id);
      const response = {
        success: true,
        token: token,
      };
      return response;
    }
  }
  /**
   * @property {Function} decodeToken get information out from token
   * @param {string} token - user token
   * @returns {object} - decoded object of token which contains id of user and secret key to check if token is valid
   */
  async decodeToken(token) {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
  }

  /**
   * @property {Function} getUser get user information from database by user id
   * should be generic
   * @param {*} id - user id
   * @returns {object} - user model
   */
  async getUser(id) {
    let user = await this.userRepository.findById(id, "", "");
    if (user.success === true) {
      const response = {
        success: true,
        data: user.doc,
      };
      return response;
    } else {
      const response = {
        success: false,
        error: userErrors.USER_NOT_FOUND,
        msg: "User Not Found",
      };
      return response;
    }
  }
  /**
   * @property {Function} getUserByEmail get user information from database by email
   * @param {string} email - user email
   * @returns {object} - user model
   */
  async getUserByEmail(email) {
    let user = await this.userRepository.findByEmail(email);
    if (user.success === true) {
      const response = {
        success: true,
        data: user.doc,
      };
      return response;
    } else {
      const response = {
        success: false,
        error: userErrors.USER_NOT_FOUND,
        msg: "User Not Found",
      };
      return response;
    }
  }
  /**
   * @property {Function} getUserByName get user information from database by userName
   * @param {string} userName - user name
   * @param {string|object} popOptions - population options of relationships stored in user data model
   * @returns {object} - user model
   */
  async getUserByName(userName, popOptions) {
    let user = await this.userRepository.findByUserName(
      userName,
      "",
      popOptions
    );
    if (user.success === true) {
      const response = {
        success: true,
        data: user.doc,
      };
      return response;
    } else {
      const response = {
        success: false,
        error: userErrors.USER_NOT_FOUND,
        msg: "User Not Found",
      };
      return response;
    }
  }
  /**
   * @property {Function} getPrefs get user preferences from user model
   * @param {object} user - user datamodel
   * @returns {object} - user preferences object
   */
  getPrefs(user) {
    let prefs = {
      canbeFollowed: user.canbeFollowed,
      nsfw: user.nsfw,
      gender: user.gender,
      adultContent: user.adultContent,
      autoplayMedia: user.autoplayMedia,
      displayName: user.displayName,
      profilePicture: user.profilePicture,
      profileBackground: user.profileBackground,
      description: user.description,
    };
    return prefs;
  }
  /**
   * @property {Function} updatePrefs  update user preferences from user model
   * @param {object} query - filtered updated fields to change in user preferences
   * @param {string} id - user id
   * @returns {object} - updated user preferences object
   */
  async updatePrefs(query, id) {
    const filteredBody = this.filterObj(
      query,
      "canbeFollowed",
      "nsfw",
      "gender",
      "adultContent",
      "autoplayMedia",
      "displayName",
      "description"
    );
    let user = await this.userRepository.updateOne(id, filteredBody);
    return this.getPrefs(user.doc);
  }
  /**
   * @property {Function} filterObj filter data to prevent changing of nonchangeable in database like password
   * @param {object} obj - object to filterd by allowedFields
   * @param  {...any} allowedFields - fields which will be kept if found in new object
   * @returns {object} - filtered object
   */
  filterObj(obj, ...allowedFields) {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  }

  /**
   * Checks if username is available, that is, it doesn't exist in the database
   * @param {string} userName - The name of the user to be checked
   * @returns {boolean}
   */
  async isAvailable(userName) {
    const user = await this.userRepository.findByUserName(userName);
    if (user.success) return false;
    return true;
  }

  /**
   * Subscribe or unsubscribe a user to a subreddit according to action
   * @param {string} userId - The user id
   * @param {string} subredditId - The subreddit to subscribe to
   * @param {string} action - sub for subscribe and unsub for unsubscribe
   * @returns {boolean}
   */
  async subscribe(userId, subredditId, action) {
    const alreadySubscribed = await this.userRepository.isSubscribed(
      userId,
      subredditId
    );
    //In order to subscribe, user should not be already subscribed
    if (action === "sub" && !alreadySubscribed) {
      const temp = await this.userRepository.push(userId, {
        subscribed: subredditId,
      });
      return true;
      //In order to unsubscribe, user should be already subscribed
    } else if (action === "unsub" && alreadySubscribed) {
      await this.userRepository.pull(userId, {
        subscribed: subredditId,
      });
      return true;
    }

    return false;
  }
  async updateUserEmail(id, email) {
    const user = await this.userRepository.updateEmailById(id, email);
    if (user.success === true) {
      const response = {
        success: true,
        data: user.doc,
      };
      return response;
    } else {
      const response = {
        success: false,
        error: userErrors.USER_NOT_FOUND,
        msg: "User Not Found",
      };
      return response;
    }
  }
}

module.exports = UserService;
