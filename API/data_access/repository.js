const APIFeatures = require("./apiFeatures");

class Repository {
  constructor(model) {
    this.Model = model;
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  async createOne(data) {
    try {
      const doc = await this.Model.create(data);
      if (doc) {
        console.log("Success");
        const response = {
          status: "success",
          statusCode: 201,
          doc: doc,
        };
        return response;
      }
    } catch (err) {
      console.log(err);
      const response = {
        status: "fail",
        statusCode: 401,
        err: err,
      };
      return response;
    }
  }
  async getOne(query, select, popOptions) {
    try {
      let tempDoc = this.Model.findOne(query).select(select);
      if (popOptions) tempDoc = tempDoc.populate(popOptions);
      const doc = await tempDoc;

      if (!doc) {
        const response = {
          status: "fail",
          statusCode: 404,
          err: "cannot found document",
        };
        return response;
      }
      const response = {
        status: "success",
        statusCode: 200,
        doc,
      };
      return response;
    } catch (err) {
      const response = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return response;
    }
  }
  async updateOne(id, data) {
    try {
      const doc = await this.Model.findOneAndUpdate(id, data, {
        new: true,
      });

      if (!doc) {
        const response = {
          status: "fail",
          statusCode: 404,
          err: "cannot found document",
        };
        return response;
      }
      const response = {
        status: "success",
        statusCode: 200,
        data: {
          data: doc,
        },
      };
      return response;
    } catch (err) {
      const response = {
        error: true,
        statusCode: 400,
        err,
      };
      return response;
    }
  }
  async deleteOne(filter,options) {
    try {
      const doc = await this.Model.findOneAndDelete(filter,options);
      if (!doc) {
        const response = {
          status: "fail",
          statusCode: 404,
          err: "cannot found document",
        };
        return response;
      }
      const response = {
        status: "success",
        statusCode: 204,
        data: null,
      };
      return response;
    } catch (err) {
      const response = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return response;
    }
  }

  async getAll(filter, query) {
    try {
      const features = new APIFeatures(Model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      // const doc = await features.query.explain();
      const doc = await features.query;
      const response = {
        status: "success",
        statusCode: 200,
        data: {
          data: doc,
        },
      };
      return response;
    } catch (err) {
      const response = {
        status: "fail",
        statusCode: 400,
        err,
      };
      return response;
    }
  }
}

module.exports = Repository;
