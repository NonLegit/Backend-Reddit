//const User = require('../models/userModel');
//const Repository = require('../data_access/repository');
class subredditService {
  constructor(subreddit, subredditRepository, flair, flairRepository) {
    this.subreddit = subreddit; // can be mocked in unit testing
    this.subredditRepository = subredditRepository; // can be mocked in unit testing
    this.createSubreddit = this.createSubreddit.bind(this);
    this.deleteSubreddit = this.deleteSubreddit.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.updateSubreddit = this.updateSubreddit.bind(this);
    this.getCategoryPosts=this.getCategoryPosts.bind(this);

    // !=======================================
    this.checkFlair = this.checkFlair.bind(this);
    this.flair = flair; // can be mocked in unit testing
    this.flairRepository = flairRepository; // can be mocked in unit testing
    this.createFlair = this.createFlair.bind(this);
    this.deleteFlair = this.deleteFlair.bind(this);
    this.getFlair = this.getFlair.bind(this);
    this.updateFlair = this.updateFlair.bind(this);
    this.getFlairs = this.getFlairs.bind(this);
    this.checkSubreddit = this.checkSubreddit.bind(this);
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
      let response = await this.subredditRepository.deleteOneByQuery(filter, options);
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
      let response = await this.subredditRepository.updateOneByQuery(
        filter,
        data
      );
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
        statusCode: 401,
        err,
      };
      return error;
    }
  }

  async getCategoryPosts(query,select){
    try {
      let response = await this.subredditRepository.getOne(query,select, "");
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

  //! Doaa's part

  async createFlair(subredditName, data,userId) {
    try {

      let isModerator = await this.isModerator(subredditName,userId);
      if (isModerator.status !== 'success') {
        const error = {
        status: "fail",
        statusCode: 403,
        err:"you are not a subreddti moderator",
      };
      // console.log(err);
      return error;
      }
      let subreddit = await this.checkSubreddit(subredditName);
      if (subreddit.status !== "success") {
        return subreddit;
      }
      let flair = await this.flairRepository.createOne(data);

      
      if (flair.status !== "success") {
        return flair;
      }
     
      let addedTorefrencedFlairs =
        await this.subredditRepository.addToRefrenced(
          {name: subredditName},
          {$push: { "flairIds": flair.doc._id }}
        );
      
      if (addedTorefrencedFlairs.status !== "success") {
        
        return addedTorefrencedFlairs;
      }

      return flair;
    } catch (err) {
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return error;
    }
  }
  async checkSubreddit(subredditName) {
    try {
      let subreddit = await this.subredditRepository.getOne(
        { name: subredditName }
      );
      //console.log(subreddit);
      if (subreddit.status !== "success") {
        const error = {
          status: "Not Found",
          statusCode: 404,
          err: subreddit.err,
        };
        return error;
      }

      return subreddit;
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
  async checkFlair(subredditName, flairId) {
    try {
      let subreddit = await this.subredditRepository.getOne(
        { name: subredditName },
        "flairIds"
      ); 
      console.log("yallllllllllllllllllllllllllllllllllllll");
      console.log(subreddit);
      if (subreddit.status !== "success") {
        const error = {
          status: "Not Found",
          statusCode: 404,
          err: subreddit.err,
        };
        return error;
      }

      if (!subreddit.doc.flairIds.includes(flairId)) {
        const error = {
          status: "Not Found",
          statusCode: 404,
          err: "Flair not in subreddit",
        };
        return error;
      }
      return subreddit;
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
  async updateFlair(subredditName, flairId, data,userId) {
    try {
      let isModerator = await this.isModerator(subredditName,userId);
      if (isModerator.status !== 'success') {
        const error = {
        status: "fail",
        statusCode: 403,
        err:"you are not a subreddti moderator",
      };
      // console.log(err);
      return error;
      }
      let checkFlair = await this.checkFlair(subredditName, flairId);
      console.log(checkFlair);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }
      let response = await this.flairRepository.updateOne(flairId, data);
      console.log(response);
      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        err,
      };
      // console.log(err);
      return error;
    }
  }

  async deleteFlair(subredditName, flairId) {
    try {
      let isModerator = await this.isModerator(subredditName,userId);
      if (isModerator.status !== 'success') {
        const error = {
        status: "fail",
        statusCode: 403,
        err:"you are not a subreddti moderator",
      };
      // console.log(err);
      return error;
      }
      // eslint-disable-next-line max-len, quotes
      let checkFlair = await this.checkFlair(subredditName, flairId);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }
      let response = await this.subredditRepository.removeFromRefrenced(
        { name: subredditName },
        { $pull: { "flairIds": flairId } }
      );
      if (response.status !== "success") {
        const error = {
          status: "fail",
          statusCode: 400,
          err: response.err,
        };
        return error;
      }
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

  async getFlair(subredditName, flairId) {
    try {
      let checkFlair = await this.checkFlair(subredditName, flairId);
      if (checkFlair.status !== "success") {
        return checkFlair;
      }

      let response = await this.flairRepository.getOneById(flairId);
      return response;
    } catch (err) {
      console.log("catch error here" + err);
      const error = {
        status: "fail",
        statusCode: 400,
        err: err,
      };
      return error;
    }
  }

  async getFlairs(subredditName) {
    try {
      // console.log('in service');
      // eslint-disable-next-line max-len, quotes
      let response = await this.subredditRepository.getRefrenced(
        { name: subredditName },
        "flairIds"
      );

       console.log(response);

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


}

module.exports = subredditService;
