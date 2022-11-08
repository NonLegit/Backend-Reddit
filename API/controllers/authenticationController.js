class AuthenticationController {
  constructor(UserServices) {
    this.UserServices = UserServices; // can be mocked in unit testing
    this.createCookie = this.createCookie.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.forgotUserName = this.forgotUserName.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.logOut = this.logOut.bind(this);
    this.authorize = this.authorize.bind(this);
    this.facebookAuth = this.facebookAuth.bind(this);
    this.facebookValidation = this.facebookValidation.bind(this);
  }

  createCookie(res, token, statusCode) {
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
      status: "success",
      token,
      expiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    });
  }
  async signUp(req, res, next) {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    if (!email || !userName || !password) {
      // bad request
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username, email and password",
      });
    } else {
      const response = await this.UserServices.signUp(
        email,
        userName,
        password
      );
      if (response.status === 201) {
        //res.status(201).json(response.body);
        this.createCookie(res, response.body.token, 201);
      } else {
        res.status(response.status).json(response.body);
      }
    }
  }
  async logIn(req, res, next) {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) {
      // bad request
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username and password",
      });
    } else {
      const response = await this.UserServices.logIn(userName, password);
      if (response.status === 200) {
        //res.status(201).json(response.body);
        this.createCookie(res, response.body.token, 200);
      } else {
        res.status(response.status).json(response.body);
      }
    }
  }
  logOut(req, res) {
    res.clearCookie("jwt");
    // res.cookie("jwt", "loggedout", {
    //     expires: new Date(Date.now() + 10 * 1000),
    //     httpOnly: true,
    // });
    res.status(200).json({
      status: "success",
    });
  }
  async forgotPassword(req, res, next) {
    const email = req.body.email;
    const userName = req.body.userName;
    if (!userName || !email) {
      // Bad Request , Send APP Error in error handling class , TODO: error-handeling
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide username and email",
      });
    } else {
      const response = await this.UserServices.forgotPassword(userName, email);
      res.status(response.status).json(response.body);
    }
  }

  async forgotUserName(req, res, next) {
    const email = req.body.email;
    if (!email) {
      // Bad Request , Send APP Error in error handling class , TODO: error-handeling
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide email",
      });
    } else {
      const response = await this.UserServices.forgotUserName(email);
      res.status(response.status).json(response.body);
    }
  }
  async resetPassword(req, res, next) {
    const resetToken = req.params.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!password || !confirmPassword || password !== confirmPassword) {
      res.status(400).json({
        status: "fail",
        errorMessage: "Provide correct Passwords",
      });
    } else {
      const response = await this.UserServices.resetPassword(
        resetToken,
        password
      );
      if (response.status == 200) {
        this.createCookie(res, response.body.token, 200);
      } else {
        res.status(response.status).json(response.body);
      }

      //res.status(response.status).json(response.body);
    }
  }
  async authorize(req, res, next) {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    console.log(token);
    if (!token) {
      res.status(401).json({
        status: "fail",
        errorMessage: "Unauthorized",
      });
    } else {
      const decoded = await this.UserServices.decodeToken(token);
      const userId = decoded.id;
      const time = decoded.iat;
      const user = await this.UserServices.getUser(userId);
      if (user.status === "fail") {
        res.status(404).json({
          status: "fail",
          errorMessage: "User not found",
        });
      } else {
        if (user.doc.changedPasswordAfter(time)) {
          res.status(400).json({
            status: "fail",
            errorMessage: "Password is changed , Please login again",
          });
        } else {
          req.user = user.doc;
          next();
        }
      }
    }
  }
  async facebookAuth(accessToken, refreshToken, profile, done) {
    const email = profile.emails[o].value;
    // find user in database
    const user = await this.UserServices.getUserByEmail(email);
    if (user.status === "fail") {
      // user not found, signup new user
      const response = {
        status: "fail",
        email: email,
      };
      done(null, response);
    } else {
      const response = {
        status: "success",
        user: user.doc,
      };
      done(null, response);
    }
  }
  async facebookValidation(req, res, next) {
    let user = req.user;
    if (user.status == "fail") {
      // user should be created
      const userName = req.body.userName;
      if (!userName) {
        res.status(400).json({
          status: "fail",
          errorMessage: "provide userName",
        });
      } else {
        const email = user.email;
        let response = await this.UserServices.signUp(
          email,
          userName,
          "random passsword"
        );
        if (response.status === 201) {
          this.createCookie(res, response.body.token, 201);
        } else {
          res.status(response.status).json(response.body);
        }
      }
    } else {
      const token = await this.UserServices.createToken(user.user._id);
      this.createCookie(res, token, 200);
    }
  }
}
//export default AuthenticationController;
module.exports = AuthenticationController;
