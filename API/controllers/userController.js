class UserController {
  constructor(UserServices,PostServices) {
    this.userServices = UserServices; // can be mocked in unit testing
    this.postServices = PostServices;
    this.createUser = this.createUser.bind(this);
    this.getPrefs = this.getPrefs.bind(this);
    this.updatePrefs = this.updatePrefs.bind(this);

    this.getBestPosts = this.getBestPosts.bind(this);
    this.getTopPosts = this.getTopPosts.bind(this);
    this.getHotPosts = this.getHotPosts.bind(this);
    this.getNewPosts = this.getNewPosts.bind(this);
  }
  async createUser(req, res, next) {
    let data = req.body;
    try {
      let user = await this.userServices.createUser(data);
      if (user.status === "success") {
        res.status(user.statusCode).json({
          status: user.status,
          user: user.doc,
        });
      } else {
        res.status(user.statusCode).json({
          status: user.status,
          message: user.err,
        });
      }
    } catch (err) {
      console.log("error in userservices " + err);
      res.status(500).json({
        status: "fail",
      });
    }
  }
  async getPrefs(req, res, next) {
    console.log(req.user);
    const prefs = this.userServices.getPrefs(req.user);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  }
  async updatePrefs(req, res, next) {
    console.log(req.body);
    const query = req.body;
    const prefs = await this.userServices.updatePrefs(query, req.user._id);
    res.status(200).json({
      status: "success",
      prefs: prefs,
    });
  }
  /////////////////////////////////////////////////////
  async getHotPosts(req, res) {
      try { 
          req.query.sort = '-createdAt,-votes,-commentCount';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query,{});
          // console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.statusCode,
              errorMessage: response.err,
              });
          }
          } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
              status: "fail",
          });
      }
  }
  async getNewPosts(req, res) {
    try{
          req.query.sort = '-createdAt';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query, {});
          // console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.statusCode,
              errorMessage: response.err,
              });
          }
      } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
          status: "fail",
      });
      }
    }
    async getTopPosts(req, res) {
      try {
          req.query.sort = '-votes';
          console.log(req.query);
          let response = await this.postServices.getPosts(req.query, {});
          // console.log( response);
          if (response.status === "success") {
              res.status(response.statusCode).json({
              status: response.status,
              data: response.doc,
              });
          } else {
              res.status(response.statusCode).json({
              status: response.statusCode,
              errorMessage: response.err,
              });
          }
      } catch (err) {
          console.log("error in subredditservices " + err);
          res.status(500).json({
              status: "fail",
      });
      }
    }
  async getBestPosts(req, res) {
    try {
      req.query.sort = '-createdAt,-votes,-commentCount,-shareCount';
      console.log(req.query);
      let response = await this.postServices.getPosts(req.query, {});
      // console.log( response);
      if (response.status === "success") {
          res.status(response.statusCode).json({
          status: response.status,
          data: response.doc,
          });
      } else {
          res.status(response.statusCode).json({
          status: response.statusCode,
          errorMessage: response.err,
          });
      }
    } catch (err) {
      console.log("error in subredditservices " + err);
      res.status(500).json({
          status: "fail",
      });
  }
}
}
//export default userController;
module.exports = UserController;
