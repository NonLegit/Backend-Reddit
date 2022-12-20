const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
var validator = require("email-validator");
const { trusted } = require("mongoose");
const { userErrors } = require("../error_handling/errors");
/**
 * AuthenticationController Class which handles authentication and authorization of user in backend
 */
class AuthenticationController {
  /**
   * Constructor
   * Depends on user services object
   * @param {object} UserService - user service object
   */
  constructor({ UserService }) {
    this.UserServices = UserService; // can be mocked in unit testing
  }

  errorResponse = (error, serviceMessage) => {
    let msg, stat;
    switch (error) {
      case userErrors.MONGO_ERR:
        msg = "Invalid parent, couldn't create user";
        stat = 400;
        break;
      case userErrors.USER_NOT_FOUND:
        msg = "User Not Found";
        stat = 404;
        break;
      case userErrors.USER_ALREADY_EXISTS:
        msg = "User Already Exists";
        stat = 400;
        break;
      case userErrors.INCORRECT_PASSWORD:
        msg = serviceMessage;
        stat = 400;
        break;
      case userErrors.EMAIL_ERROR:
        msg = serviceMessage;
        stat = 500;
        break;
      case userErrors.INVALID_TOKEN:
        msg = serviceMessage;
        stat = 400;
        break;
      case userErrors.INVALID_RESET_TOKEN:
        msg = serviceMessage;
        stat = 401;
        break;
    }
    return { msg, stat };
  };
  /**
   * @property {Function} createCookie create cookie to store token and send to user
   * @param {object} res - response to client
   * @param {string} token - user token to put in cookie
   * @param {number} statusCode - status code of respones
   * @returns void
   */
  createCookie = (res, token, statusCode) => {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      sameSite: "None",
      httpOnly: false,
      secure: false,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    if (process.env.NODE_ENV === "production") cookieOptions.httpOnly = true;
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
      status: "success",
      token,
      // expiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    });
  };
  /**
   * @property {Function} signUp signup new user in database
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  signUp = async (req, res, next) => {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    if (!email || !userName || !password) {
      // bad request
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username, email and password",
        errorType: 0,
      });
    } else {
      const passwordStrength =
        this.UserServices.checkPasswordStrength(password);
      if (passwordStrength === "Too weak" || passwordStrength === "Weak") {
        res.status(400).json({
          status: "fail",
          errorMessage: passwordStrength + " password",
          errorType: 1,
        });
      } else {
        const user = await this.UserServices.signUp(email, userName, password);
        if (user.success === true) {
          //res.status(201).json(response.body);
          try {
            var fs = require("fs");
            var dir = `./public/users/${userName}`;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
          } catch (error) {
            console.log(error);
          }

          this.createCookie(res, user.token, 201);
        } else {
          const response = this.errorResponse(user.error, user.msg);
          res.status(response.stat).json({
            status: "fail",
            errorMessage: response.msg,
            errorType: 2,
          });
        }
      }
    }
  };
  /**
   * @property {Function} logIn autheticate user by send cookie token to him
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  logIn = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) {
      // bad request
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username and password",
      });
    } else {
      const user = await this.UserServices.logIn(userName, password);
      if (user.success === true) {
        //res.status(201).json(response.body);
        this.createCookie(res, user.token, 200);
      } else {
        const response = this.errorResponse(user.error, user.msg);
        res.status(response.stat).json({
          status: "fail",
          errorMessage: response.msg,
        });
      }
    }
  };
  /**
   * @property {Function} logOut remove cookie of user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @returns void
   */
  logOut = (req, res) => {
    //res.clearCookie("jwt");
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      sameSite: "None",
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    res.status(200).json({
      status: "success",
    });
  };
  /**
   * @property {Function} forgotPassword send reset token to user by email
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    const userName = req.body.userName;
    if (!userName || !email) {
      // Bad Request , Send APP Error in error handling class , TODO: error-handeling
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username and email",
      });
    } else {
      const user = await this.UserServices.forgotPassword(userName, email);
      if (user.success === true) {
        res.status(204).json({
          status: "success",
        });
      } else {
        const response = this.errorResponse(user.error, user.msg);
        res.status(response.stat).json({
          status: "fail",
          errorMessage: response.msg,
        });
      }
    }
  };
  /**
   * @property {Function} forgotUserName send username to user by email
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  forgotUserName = async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
      // Bad Request , Send APP Error in error handling class , TODO: error-handeling
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide email",
      });
    } else {
      const user = await this.UserServices.forgotUserName(email);
      if (user.success === true) {
        res.status(204).json({
          status: "success",
        });
      } else {
        const response = this.errorResponse(user.error, user.msg);
        // console.log(response);
        res.status(response.stat).json({
          status: "fail",
          errorMessage: response.msg,
        });
      }
    }
  };
  /**
   * @property {Function} resetPassword reset password of user with reset token
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  resetPassword = async (req, res, next) => {
    const resetToken = req.params.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!password || !confirmPassword) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide password and confirm password",
        errorType: 0,
      });
    } else if (password !== confirmPassword) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide Equal Passwords",
        errorType: 1,
      });
    } else {
      const passwordStrength =
        this.UserServices.checkPasswordStrength(password);
      if (passwordStrength === "Too weak" || passwordStrength === "Weak") {
        res.status(400).json({
          status: "fail",
          errorMessage: passwordStrength + " password",
          errorType: 2,
        });
      } else {
        const user = await this.UserServices.resetPassword(
          resetToken,
          password
        );
        if (user.success === true) {
          this.createCookie(res, user.token, 200);
        } else {
          const response = this.errorResponse(user.error, user.msg);
          res.status(response.stat).json({
            status: "fail",
            errorMessage: response.msg,
          });
        }
      }
      //res.status(response.status).json(response.body);
    }
  };
  /**
   * @property {Function} authorize check cookie sent by client inorder to validate user logged in
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  authorize = async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
    }
    if (!token) {
      res.status(401).json({
        status: "fail",
        errorMessage: "Unauthorized",
      });
    } else {
      try {
        const decoded = await this.UserServices.decodeToken(token);
        const userId = decoded.id;
        const time = decoded.iat;
        const user = await this.UserServices.getUser(userId);
        if (user.success === false) {
          console.log(user);
          res.status(404).json({
            status: "fail",
            errorMessage: "User not found",
          });
        } else {
          if (user.data.keepLoggedIn !== true) {
            if (user.data.changedPasswordAfter(time)) {
              res.status(400).json({
                status: "fail",
                errorMessage: "Password is changed , Please login again",
              });
            } else {
              req.user = user.data;
              next();
            }
          } else {
            req.user = user.data;
            next();
          }
        }
      } catch (err) {
        res.status(401).json({
          status: "fail",
          errorMessage: "Unauthorized",
        });
      }
    }
  };
  /**
   * @property {Function} facebookAuth facebook authentication signup or login
   * @param {string} accessToken - token sent from client
   * @param {string} refreshToken
   * @param {object} profile - user profile on facebook
   * @param {Function} done - callback function
   * @returns void
   */
  facebookAuth = async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    // find user in database
    const user = await this.UserServices.getUserByEmail(email);
    if (user.success === false) {
      // user not found, signup new user
      const response = {
        status: "fail",
        email: email,
      };
      done(null, response);
    } else {
      const response = {
        status: "success",
        user: user.data,
      };
      done(null, response);
    }
  };
  /**
   * @property {Function} facebookValidation validate facebook user
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   * @returns void
   */
  facebookValidation = async (req, res, next) => {
    let user = req.user;
    //console.log(user);
    if (user.status == "fail") {
      // user should be created
      const userName = "user";
      // if (!userName) {
      //   res.status(400).json({
      //     status: "fail",
      //     errorMessage: "provide userName",
      //   });
      // } else {
      const email = user.email;
      //console.log(email);
      const password = this.UserServices.generateRandomPassword();
      let newUser = await this.UserServices.signUp(email, userName, password);
      if (newUser.success === true) {
        this.createCookie(res, newUser.token, 201);
      } else {
        const response = this.errorResponse(newUser.error, newUser.msg);
        res.status(response.stat).json({
          status: "fail",
          errorMessage: response.msg,
        });
      }
      //}
    } else {
      const token = await this.UserServices.createToken(user.user._id);
      this.createCookie(res, token, 200);
    }
  };
  /**
   * @property {Function} googleAuth google authentication signup or login
   * @param {object} req - request object sent by client
   * @param {object} res - response to client
   * @param {Function} next -  function to execute next middleware
   */
  googleAuth = async (req, res, next) => {
    const oAuth2Client = new OAuth2Client();
    if (!req.body.tokenId) {
      res.status(400).json({
        status: "fail",
        errorMessage: "provide token",
      });
    } else {
      try {
        const token = req.body.tokenId;
        const key = await oAuth2Client.verifyIdToken({
          idToken: token,
          requiredAudience: process.env.GOOGLE_APP_ID,
        });
        const payload = key.getPayload();
        const email = payload["email"];
        let user = await this.UserServices.getUserByEmail(email);
        if (user.success === false) {
          // user not found, signup new user
          const userName = "user";
          const password = this.UserServices.generateRandomPassword();
          let user = await this.UserServices.signUp(email, userName, password);
          if (user.success === true) {
            this.createCookie(res, user.token, 201);
          } else {
            const response = this.errorResponse(user.error, user.msg);
            res.status(response.stat).json({
              status: "fail",
              errorMessage: response.msg,
            });
          }
          //}
        } else {
          const token = await this.UserServices.createToken(user.data._id);
          this.createCookie(res, token, 200);
        }
      } catch (error) {
        res.status(400).json({
          status: "fail",
          errorMessage: "provide valid token",
        });
      }
    }
  };
  changeEmail = async (req, res, next) => {
    if (!req.body.newEmail || !req.body.password) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide New Email and password",
      });
    } else {
      const newEmail = req.body.newEmail;
      const password = req.body.password;
      if (req.user.email === newEmail) {
        res.status(400).json({
          status: "fail",
          errorMessage: "Insert different email",
        });
      } else {
        if (validator.validate(newEmail)) {
          if (
            await this.UserServices.checkPassword(password, req.user.userName)
          ) {
            const user = await this.UserServices.getUserByEmail(newEmail);
            if (user.success === true) {
              res.status(400).json({
                status: "fail",
                errorMessage: "Email is already taken by another user",
              });
            } else {
              // create verified token
              req.user.email = newEmail;
              let response = await this.UserServices.sendVerificationToken(
                req.user
              );
              //change email using update email
              if (response.success === true) {
                const changedUser = await this.UserServices.updateUserEmail(
                  req.user._id,
                  newEmail
                );
                res.status(204).json({
                  status: "success",
                });
              } else {
                console.log("nooo");
                response = this.errorResponse(response.error, response.msg);
                res.status(response.stat).json({
                  status: "fail",
                  errorMessage: response.msg,
                });
              }
            }
          } else {
            res.status(400).json({
              status: "fail",
              errorMessage: "Incorrect password",
            });
          }
        } else {
          res.status(400).json({
            status: "fail",
            errorMessage: "Invaild Email",
          });
        }
      }
    }
  };
  verifyEmail = async (req, res, next) => {
    const verificationToken = req.params.token;
    let result = await this.UserServices.verifyEmailToken(verificationToken);
    if (result.success === true) {
      res.status(204).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        errorMessage: "Token Invalid or Has Expired",
      });
    }
  };
  changePassword = async (req, res, next) => {
    let oldPassword = req.body.oldPassword;
    let confirmNewPassword = req.body.confirmNewPassword;
    let newPassword = req.body.newPassword;
    let keepLoggedIn = req.body.keepLoggedIn;
    if (!confirmNewPassword || !newPassword || !oldPassword) {
      res.status(400).json({
        status: "fail",
        errorMessage:
          "Provide old password and new password and confirmed new password ",
        errorType: 0,
      });
    } else if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide Equal Passwords",
        errorType: 1,
      });
    } else {
      if (oldPassword === newPassword) {
        res.status(400).json({
          status: "fail",
          errorMessage: "Enter New Password not old password",
          errorType: 4,
        });
      } else {
        const passwordStrength =
          this.UserServices.checkPasswordStrength(newPassword);
        if (passwordStrength === "Too weak" || passwordStrength === "Weak") {
          res.status(400).json({
            status: "fail",
            errorMessage: passwordStrength + " password",
            errorType: 2,
          });
        } else {
          // check on user password get me
          let me = req.user;

          let isCorrectPassword = await this.UserServices.checkPassword(
            oldPassword,
            me.userName
          );
          if (isCorrectPassword === true) {
            if (keepLoggedIn) {
              keepLoggedIn = true;
            } else {
              keepLoggedIn = false;
            }
            let token = await this.UserServices.changePassword(
              me,
              keepLoggedIn,
              newPassword
            );
            this.createCookie(res, token, 200);
          } else {
            res.status(400).json({
              status: "fail",
              errorMessage: "Incorrect Password",
              errorType: 3,
            });
          }
        }
      }

      //res.status(response.status).json(response.body);
    }
  };
  checkResetTokentime = async (req, res, next) => {
    const resetToken = req.params.token;
    let result = await this.UserServices.checkResetTokenTime(resetToken);
    if (result.success === true) {
      res.status(204).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        errorMessage: "Token is invalid or has expired",
      });
    }
  };

  checkAuthorize = async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
    }
    if (!token) {
      req.isAuthorized = false;
      next();
    } else {
      const decoded = await this.UserServices.decodeToken(token);
      const userId = decoded.id;
      const time = decoded.iat;
      const user = await this.UserServices.getUser(userId);
      if (user.success === false) {
        req.isAuthorized = false;
        next();
      } else {
        if (user.data.changedPasswordAfter(time)) {
          req.isAuthorized = false;
          next();
        } else {
          req.user = user.data;
          req.isAuthorized = true;
          next();
        }
      }
    }
  };
  deleteAccount = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) {
      // bad request
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username and password",
      });
    } else {
      if (userName === req.user.userName) {
        const user = await this.UserServices.logIn(userName, password);
        if (user.success === true) {
          // mark account as deleted
          let isDeleted = await this.UserServices.deleteAccount(req.user);
          res.status(204).json({
            status: "success",
          });
        } else {
          const response = this.errorResponse(user.error, user.msg);
          res.status(response.stat).json({
            status: "fail",
            errorMessage: response.msg,
          });
        }
      } else {
        res.status(400).json({
          status: "fail",
          errorMessage: "Invalid userName",
        });
      }
    }
  };
}

module.exports = AuthenticationController;
