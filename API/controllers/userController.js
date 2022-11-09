class UserController {
  constructor(UserServices) {
    this.userServices = UserServices; // can be mocked in unit testing
    this.createUser = this.createUser.bind(this);
    this.getPrefs = this.getPrefs.bind(this);
    this.updatePrefs = this.updatePrefs.bind(this);
    this.usernameAvailable = this.usernameAvailable.bind(this);
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

  async usernameAvailable(req, res) {
    if (!req.query.userName) {
      res.status(400).json({
        status: "fail",
        message: "userName query paramater is required",
      });
      return;
    }
    const available = await this.userServices.isAvailable(req.query.userName);
    if (available) {
      res.status(200).json({
        status: "success",
        available: true,
      });
    } else {
      res.status(200).json({
        status: "success",
        available: false,
      });
    }
  }
}
//export default userController;
module.exports = UserController;
