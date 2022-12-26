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
  constructor({
    /*Repository*/ UserRepository,
    Email,
    SocialRepository,
    SubredditRepository,
  }) {
    //this.User = User; // can be mocked in unit testing
    //this.userRepository = Repository; // can be mocked in unit testing
    this.userRepository = UserRepository; // can be mocked in unit testing
    this.emailServices = Email;
    this.SocialRepository = SocialRepository;
    this.subredditRepository = SubredditRepository;

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
  /**
   * @property {Function} generateRandomPassword generate random password for user
   * generate random password for user  if sign up with google or facebook
   * @returns {string} - valid password to store in db
   */
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
  /**
   * @property {Function} checkPasswordStrength check strength of password
   * generate random password for user  if sign up with google or facebook
   * @param {string} password - password to check it's strength
   * @returns {string} - strength enum one of [Too weak,Weak,Medium,Strong]
   */
  checkPasswordStrength(password) {
    return passwordStrength(password).value;
  }
  // async createUser(data) {
  //   try {
  //     let user = await this.userRepository.createOne(data);
  //     return user;
  //   } catch (err) {
  //     console.log("catch error here" + err);
  //     const error = {
  //       status: "fail",
  //       statusCode: 400,
  //       err,
  //     };
  //     return error;
  //   }
  // }
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
        const resetURL = `${process.env.FRONTDOMAIN}/login`;
        await this.emailServices.sendUserName(user.doc, resetURL);
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
        this.replaceProfile(user.doc);
        await user.doc.save({ validateBeforeSave: false });
        const resetURL = `${process.env.FRONTDOMAIN}/resetpassword/${resetToken}`;
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
   * @property {Function} sendVerificationToken send verification mail to user
   * @param {object} user - User object
   * @returns {object} - response of sendVerificationToken contain status of services if successful sent or not
   */
  async sendVerificationToken(user) {
    const verificationToken = user.createVerificationToken();
    user.emailVerified = false;
    this.replaceProfile(user);
    await user.save({ validateBeforeSave: false });

    // front Domain verification page
    const verifyURL = `${process.env.FRONTDOMAIN}/verification/${verificationToken}`;
    try {
      await this.emailServices.sendVerificationMail(user, verifyURL);
      const response = {
        success: true,
      };
      return response;
    } catch (error) {
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
      this.replaceProfile(user.doc);
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
   * @property {Function} changePassword store new password in database
   * @param {object} user - User object
   * @param {object} keepLoggedIn - keep other tokens valid
   * @param {object} password - new password
   * @returns {string} - User Token
   */
  async changePassword(user, keepLoggedIn, password) {
    // let user = await this.userRepository.changekeepLoggedIn(
    //   userId,
    //   keepLoggedIn
    // );
    user.password = password;
    user.keepLoggedIn = keepLoggedIn;
    await user.save();
    const token = this.createToken(user._id);
    return token;
  }
  /**
   * @property {Function} verifyEmailToken verify user email with verificationToken
   * @param {object} verificationToken - verificationToken token
   * @returns {object} - response object contain state of verification (success and verified or failed)
   */
  async verifyEmailToken(verificationToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    let user = await this.userRepository.findByVerificationToken(hashedToken);
    if (user.success === false) {
      // invalid token or time passed
      const response = {
        success: false,
        error: userErrors.INVALID_RESET_TOKEN,
        msg: "Token Invalid or Has Expired",
      };
      return response;
    } else {
      user.doc.verificationToken = undefined;
      user.doc.verificationTokenExpires = undefined;
      user.doc.emailVerified = true;
      this.replaceProfile(user.doc);
      await user.doc.save();
      const response = {
        success: true,
      };
      return response;
    }
  }
  /**
   * @property {Function} deleteAccount soft delete user account
   * @param {object} user - user object
   * @returns {boolean} - true boolean
   */
  async deleteAccount(user) {
    user.isDeleted = true;
    user.keepLoggedIn = false;
    await user.save();
    return true;
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
   * @property {Function} getUserWithFollowers create user token
   * @param {object} id - User Id to be stored in token
   * @returns {object} - response object contains followers if success or error type in fail
   */
  async getUserWithFollowers(id) {
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
      email: user.email,
      socialLinks: user.socialLinks,
      country: user.country,
      emailVerified: user.emailVerified,
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
      "description",
      "adultContent",
      "autoplayMedia",
      "country"
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
    //const user = await this.userRepository.findByUserName(userName);
    const user = await this.userRepository.findByName(userName);
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
      await this.userRepository.subscribe(subredditId, userId);
      await this.subredditRepository.subscribe(subredditId, userId);
      return true;
      //In order to unsubscribe, user should be already subscribed
    } else if (action === "unsub" && alreadySubscribed) {
      await this.userRepository.unSubscribe(subredditId, userId);
      await this.subredditRepository.unSubscribe(subredditId, userId);
      return true;
    }

    return false;
  }
  /**
   * @property {Function} checkPassword check user password is same as in database
   * @param {object} password - password entered by user
   * @param {object} userName - UserName to check it's password
   * @returns {boolean} - boolean indicate if correct password or not
   */
  async checkPassword(password, userName) {
    let user = await this.userRepository.findByUserName(userName, "+password");
    return await user.doc.checkPassword(password, user.doc.password);
  }
  /**
   * @property {Function} updateUserEmail updateUserEmail
   * @param {object} id - User Id
   * @param {object} email - User new email to be stored in db
   * @returns {object} - response indicate if successful update or user not found
   */
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

  /**
   * @property {Function} checkResetTokenTime checkResetToken is valid and not expired
   * @param {object} resetToken - resetToken
   * @returns {object} - response indicate if resetToken valid or expired
   */
  async checkResetTokenTime(resetToken) {
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
      const response = {
        success: true,
        msg: "valid token",
      };
      return response;
    }
  }

  /**
   * @property {Function} about return information about user
   * check if user i followed him or  blocked by him inorder to return appropriate data
   * @param {object} me - User object of requested user
   * @param {object} user - User object of user to get its information
   * @returns {object} - SearchUser data
   */
  about(me, user) {
    const relation = me.meUserRelationship.find(
      (element) => element.userId.toString() === user._id.toString()
    );
    let isFollowed = false;
    let isBlocked = false;
    if (relation) {
      if (relation.status === "followed") {
        isFollowed = true;
      } else if (relation.status === "blocked") {
        isBlocked = true;
      }
    }
    const checkBlocked = me.userMeRelationship.find(
      (element) => element.userId.toString() === user._id.toString()
    );
    let userBlockedMe = false;
    if (checkBlocked) {
      if (checkBlocked.status === "blocked") userBlockedMe = true;
    }
    let searchUser;
    if (userBlockedMe) {
      searchUser = {
        _id: user._id,
        userName: user.userName,
        profilePicture: `${process.env.BACKDOMAIN}/users/default.png`,
        profileBackground: `${process.env.BACKDOMAIN}/users/defaultcover.png`,
        canbeFollowed: false,
        followersCount: user.followersCount,
        friendsCount: user.friendsCount,
        gender: user.gender,
        displayName: user.displayName,
        postKarma: user.postKarma,
        commentKarma: user.commentKarma,
        description: "",
        createdAt: user.joinDate,
        nsfw: user.nsfw,
        autoplayMedia: user.autoplayMedia,
        adultContent: user.adultContent,
        isFollowed: false,
        country: user.country,
        socialLinks: [],
        isBlocked: isBlocked,
      };
    } else {
      searchUser = {
        _id: user._id,
        userName: user.userName,
        profilePicture: user.profilePicture,
        profileBackground: user.profileBackground,
        canbeFollowed: user.canbeFollowed,
        followersCount: user.followersCount,
        friendsCount: user.friendsCount,
        gender: user.gender,
        displayName: user.displayName,
        postKarma: user.postKarma,
        commentKarma: user.commentKarma,
        description: user.description,
        createdAt: user.joinDate,
        nsfw: user.nsfw,
        autoplayMedia: user.autoplayMedia,
        adultContent: user.adultContent,
        isFollowed: isFollowed,
        country: user.country,
        socialLinks: user.socialLinks,
        isBlocked: isBlocked,
      };
    }
    return searchUser;
  }

  /**
   * @property {Function} addUserImageURL add ImageURL to user
   * @param {object} userId -userId to store path in
   * @param {string} type - type of image (profilePicture or Background)
   * @param {string} path - relative path of imagek
   * @returns {object} - user object
   */
  async addUserImageURL(userId, type, path) {
    //console.log(path);
    path = "users/" + path;

    let user = {};
    if (type === "profilePicture") {
      user = await this.userRepository.updateOne(userId, {
        profilePicture: path,
      });
    } else {
      user = await this.userRepository.updateOne(userId, {
        profileBackground: path,
      });
    }

    return user.doc;
  }
  /**
   * @property {Function} getSocialLinks get list of available Social Media
   * @returns {Array} - List of available Social Media
   */
  async getSocialLinks() {
    let data = await this.SocialRepository.getAll();
    return data;
  }
  /**
   * @property {Function} createSocialLinks create social link to user with social media id
   * @param {object} me -me object of database
   * @param {string} socialId - id of  social media
   * @param {string} displayText - display text of social link
   * @param {string} userLink - valid social link of social media
   * @returns {object} - object indicate if social link created successfully or max count reached
   */
  async createSocialLinks(me, displayText, userLink, socialId) {
    // check if social id is valid
    //console.log(me.socialLinks.length);
    if (me.socialLinks.length === 5) {
      return {
        success: false,
        msg: "Max Links 5",
        error: userErrors.MAXSOCIALLINKS,
      };
    } else {
      let data = await this.SocialRepository.findOne(socialId);
      //console.log(data);
      if (data.success === true) {
        // bug here should use updateone

        // try {
        //   me.socialLinks.push({
        //     social: socialId,
        //     displayText: displayText,
        //     userLink: userLink,
        //   });
        // } catch (err) {
        //   console.log(err);
        // }
        // await me.save();

        await this.userRepository.updateSocialLinks(me._id, {
          social: socialId,
          displayText: displayText,
          userLink: userLink,
        });
        return { success: true };
      } else {
        return {
          success: false,
          msg: "Invalid social Id",
          error: userErrors.INVALID_SOCIALID,
        };
      }
    }
  }

  /**
   * @property {Function} updateSocialLinks update social link of user by id
   * @param {object} me -me object of database
   * @param {string} id - id of user social link
   * @param {string} displayText - display text of social link
   * @param {string} userLink - valid social link of social media
   * @returns {object} - boolean indicate if social link deleted successfully or not
   */
  async updateSocialLinks(me, id, userLink, displayText) {
    let index = me.socialLinks.findIndex((item) => item._id.toString() == id);
    if (index != -1) {
      if (userLink) {
        me.socialLinks[index].userLink = userLink;
      }
      if (displayText) {
        console.log("should save");
        me.socialLinks[index].displayText = displayText;
        let profileBackground = me.profileBackground;
        let profilePicture = me.profilePicture;
        me.profilePicture = profilePicture.replace(
          `${process.env.BACKDOMAIN}/`,
          ""
        );
        me.profileBackground = profileBackground.replace(
          `${process.env.BACKDOMAIN}/`,
          ""
        );
      }
      console.log(me.profileBackground + " " + me.profilePicture);
      await me.save();
      return { success: true, socialLinks: me.socialLinks };
    } else {
      return { success: false };
    }
  }
  /**
   * @property {Function} deleteSocialLinks delete social link of user by id
   * @param {object} me -me object of database
   * @param {object} id - id of user social link
   * @returns {object} - boolean indicate if social link deleted successfully or not
   */
  async deleteSocialLinks(me, id) {
    let index = me.socialLinks.findIndex((item) => item._id == id);
    if (index != -1) {
      try {
        me.socialLinks.pull({ _id: id });
      } catch (err) {}

      let profileBackground = me.profileBackground;
      let profilePicture = me.profilePicture;
      me.profilePicture = profilePicture.replace(
        `${process.env.BACKDOMAIN}/`,
        ""
      );
      me.profileBackground = profileBackground.replace(
        `${process.env.BACKDOMAIN}/`,
        ""
      );
      console.log(me.profileBackground + " " + me.profilePicture);
      await me.save();
      return { success: true };
    } else {
      return { success: false };
    }
  }
  /**
   * @property {Function} replaceProfile remove changes done to doc to keep user in valid state
   * @param {object} doc -user object of database
   * @returns {object} - doc to save later
   */
  replaceProfile(doc) {
    let profileBackground = doc.profileBackground;
    let profilePicture = doc.profilePicture;
    doc.profilePicture = profilePicture.replace(
      `${process.env.BACKDOMAIN}/`,
      ""
    );
    doc.profileBackground = profileBackground.replace(
      `${process.env.BACKDOMAIN}/`,
      ""
    );
    return doc;
  }
  /**
   * @property {Function} checkBlockStatus check if other User blocked me or not
   * @param {object} me -me object of database
   * @param {object} otherUser - user object  of database
   * @returns {object} - boolean indicate if user blocked me or not
   */
  async checkBlockStatus(me, otherUser) {
    const index = otherUser.meUserRelationship.findIndex((element) => {
      return element.userId.toString() == me._id.toString();
    });

    if (index != -1) {
      console.log(otherUser.meUserRelationship[index].status);
      if (otherUser.meUserRelationship[index].status === "blocked") {
        return true;
      }
    }
    return false;
  }
  /**
   * @property {Function} blockUser block User
   * check if user is in blocked users
   * if no add it to blocked list
   * if yes return
   * @param {object} me -me object of database
   * @param {object} otherUser - user object  of database
   * @returns {object} - boolean indicate if blocked successfully
   */
  async blockUser(me, otherUser) {
    this.replaceProfile(me);
    this.replaceProfile(otherUser);
    let index = me.meUserRelationship.findIndex(
      (item) => item.userId.toString() == otherUser._id.toString()
    );
    let index2 = otherUser.userMeRelationship.findIndex(
      (item) => item.userId.toString() == me._id.toString()
    );
    // console.log(index);
    // console.log(index2);
    if (index != -1) {
      me.meUserRelationship[index].status = "blocked";
      otherUser.userMeRelationship[index2].status = "blocked";
    } else {
      me.meUserRelationship.push({
        userId: otherUser._id,
        status: "blocked",
      });
      otherUser.userMeRelationship.push({
        userId: me._id,
        status: "blocked",
      });
    }
    // remove relationship of other user and me
    index = me.userMeRelationship.findIndex(
      (item) => item.userId.toString() == otherUser._id.toString()
    );
    index2 = otherUser.meUserRelationship.findIndex(
      (item) => item.userId.toString() == me._id.toString()
    );

    if (index != -1) {
      me.userMeRelationship[index].status = "none";
      otherUser.meUserRelationship[index2].status = "none";
    }
    await otherUser.save();
    await me.save();
    return true;
  }
  /**
   * @property {Function} unBlockUser unBlock user
   * check if user is in blocked users
   * if yes mark its state to none
   * if no return true
   * @param {object} me -me object of database
   * @param {object} otherUser - user object  of database
   * @returns {object} - boolean indicate if unblocked successfully
   */
  async unBlockUser(me, otherUser) {
    this.replaceProfile(me);
    this.replaceProfile(otherUser);
    let index = me.meUserRelationship.findIndex(
      (item) => item.userId.toString() == otherUser._id.toString()
    );
    let index2 = otherUser.userMeRelationship.findIndex(
      (item) => item.userId.toString() == me._id.toString()
    );

    if (index != -1) {
      me.meUserRelationship[index].status = "none";
      otherUser.userMeRelationship[index2].status = "none";
    }
    await otherUser.save();
    await me.save();
    return true;
  }
  async saveFirebaseToken(userId, token) {
    //check if existing subreddit to create flair in

    let addedToken = await this.userRepository.addTokenToUser(userId, token);
    if (!addedToken.success) {
      return { success: false, error: userErrors.MONGO_ERR };
    }
    return { success: true };
  }

  async getFirebaseToken(userId) {
    let token = await this.userRepository.getFirebaseToken(userId);
    if (!token.success) {
      return { success: false, error: userErrors.MONGO_ERR };
    }
    return { success: true, data: token.doc };
  }
  /**
   * @property {Function} followUser uollow user
   * check if user is in followed users
   * if no mark its state to follow and return false
   * if yse return true
   * @param {object} me -me object of database
   * @param {object} otherUser - user object  of database
   * @returns {object} - boolean indicate if followed him or he is already followed
   */
  async followUser(me, otherUser) {
    this.replaceProfile(me);
    this.replaceProfile(otherUser);

    //console.log(otherUser);
    let isAlreadyFollowed = true;
    let index = me.meUserRelationship.findIndex(
      (item) => item.userId.toString() == otherUser._id.toString()
    );
    let index2 = otherUser.userMeRelationship.findIndex(
      (item) => item.userId.toString() == me._id.toString()
    );
    if (index != -1) {
      if (me.meUserRelationship[index].status !== "followed") {
        isAlreadyFollowed = false;
      }
      me.meUserRelationship[index].status = "followed";
      otherUser.userMeRelationship[index2].status = "followed";
      otherUser.followersCount = otherUser.followersCount + 1;
    } else {
      me.meUserRelationship.push({
        userId: otherUser._id,
        status: "followed",
      });
      otherUser.userMeRelationship.push({
        userId: me._id,
        status: "followed",
      });
      otherUser.followersCount = otherUser.followersCount + 1;
      isAlreadyFollowed = false;
    }
    await otherUser.save();
    await me.save();
    return isAlreadyFollowed;
  }
  /**
   * @property {Function} unfollowUser unfollow user
   * check if user is in followed users
   * if yes mark its state to none and return false
   * if no return true
   * @param {object} me -me object of database
   * @param {object} otherUser - user object  of database
   * @returns {object} - boolean indicate if unfollowed him or he is already unfollowed
   */
  async unfollowUser(me, otherUser) {
    this.replaceProfile(me);
    this.replaceProfile(otherUser);
    let isAlreadyUnfollowed = true;
    let index = me.meUserRelationship.findIndex(
      (item) => item.userId.toString() == otherUser._id.toString()
    );
    let index2 = otherUser.userMeRelationship.findIndex(
      (item) => item.userId.toString() == me._id.toString()
    );

    if (index != -1) {
      if (me.meUserRelationship[index].status === "followed") {
        isAlreadyUnfollowed = false;
      }
      me.meUserRelationship[index].status = "none";
      otherUser.userMeRelationship[index2].status = "none";
      otherUser.followersCount = otherUser.followersCount - 1;
    }
    await otherUser.save();
    await me.save();
    return isAlreadyUnfollowed;
  }
  /**
   * @property {Function} getBlockedUsers get Blocked users by me
   * @param {object} user - user object
   * @returns {Array} - List of Blocked Users
   */
  async getBlockedUsers(user) {
    let users = await this.userRepository.getBlocked(user);
    let blocked = [];
    users.forEach((element) => {
      if (element!== null && element.status === "blocked") {
        blocked.push({
          _id: element.userId._id,
          userName: element.userId.userName,
          profilePicture:
            process.env.BACKDOMAIN + "/" + element.userId.profilePicture,
          postKarma: element.userId.postKarma,
          commentKarma: element.userId.commentKarma,
        });
      }
    });
    return blocked;
  }
  /**
   * @property {Function} getFollowers get myFollowers and state indicate if followed them too
   * @param {object} me - me object to search for isFollowed status for each follower
   * @returns {Array} - List of Followers data
   */
  async getFollowers(me) {
    let users = await this.userRepository.getFollowers(me);
    let followers = [];
    users.forEach((element) => {
      if (element!== null && element.status === "followed") {
        let isFollowed = this.isFollowed(me, element.userId._id);
        followers.push({
          _id: element.userId._id,
          userName: element.userId.userName,
          profilePicture:
            process.env.BACKDOMAIN + "/" + element.userId.profilePicture,
          postKarma: element.userId.postKarma,
          commentKarma: element.userId.commentKarma,
          displayName: element.userId.displayName,
          isFollowed: isFollowed,
        });
      }
    });
    return followers;
  }

  getPeopleUserKnows(user) {
    let people = [];
    let blockedTwoWay = [];
    user.meUserRelationship.forEach((element) => {
      if (element.status === "followed" || element.status === "friend") {
        if (
          !user.userMeRelationship.find((el) => {
            return el.userId.equals(element.userId) && el.status == "blocked";
          })
        ) {
          people.push(element.userId);
        } else {
          blockedTwoWay.push(element.userId);
        }
      }
      if (element.status === "blocked") {
        blockedTwoWay.push(element.userId);
      }
    });
    return { people: people, blocked: blockedTwoWay };
    // return people;
  }
  /**
   * @property {Function} isFollowed check if i followd user or not
   * @param {object} me - me object to search in meUserRelationShip stored in it
   * @param {string} userId - User Id to be stored in token
   * @returns {boolean} - boolean indicate if i followd user or not
   */
  isFollowed(me, userId) {
    const relation = me.meUserRelationship.find(
      (element) => element.userId.toString() === userId.toString()
    );
    let isFollowed = false;
    if (relation) {
      if (relation.status === "followed") isFollowed = true;
    }
    return isFollowed;
  }
}

module.exports = UserService;
