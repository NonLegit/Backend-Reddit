//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
class subredditService {
  constructor(subreddit, subredditRepository) {
    this.subreddit = subreddit; // can be mocked in unit testing
    this.subredditRepository = subredditRepository; // can be mocked in unit testing
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.updateSubreddit = this.updateSubreddit.bind(this);
  }
  async createSubreddit(data) {
    try {
      let subreddit = await this.subredditRepository.createOne(data);
      return subreddit;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  async deleteSubreddit(filter, options) {
    try {
      let response = await this.subredditRepository.deleteOne(filter, options);
      return response;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }

  async updateSubreddit(filter, data) {
    try {
      let response = await this.subredditRepository.updateOneByQuery(filter, data);
      return response;
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

  async getSubreddit(query) {
    try {
      let response = await this.subredditRepository.getOne(query, "", "");
      return response;
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
  
  async isModerator(subredditName, userID) {
    try {
      let ismoderator = await this.getSubreddit(
        {
          name: subredditName,
          "moderators.username": userID,
        },
        "",
        ""
      );
      return ismoderator;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
}

module.exports = subredditService;
