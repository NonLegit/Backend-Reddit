const APIFeatures = require("./apiFeatures");

class Repository {
  constructor(model) {
    this.Model = model;

    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.getAll = this.getAll.bind(this);

    this.updateOneByQuery = this.updateOneByQuery.bind(this);
    this.deleteOneByQuery = this.deleteOneByQuery.bind(this);

    this.getOneById = this.getOneById.bind(this);
    this.getRefrenced = this.getRefrenced.bind(this);
    this.addToRefrenced = this.addToRefrenced.bind(this);
    this.removeFromRefrenced = this.removeFromRefrenced.bind(this);

    this.isValidId = this.isValidId.bind(this);
    this.getById = this.getById.bind(this);
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
      console.log("MongooseError: " + err);
      const response = {
        status: "fail",
        statusCode: 400,
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
    console.log(id, data);
    try {
      const doc = await this.Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
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
        doc,
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
  async updateOneByQuery(filter, data) {
    try {
      const doc = await this.Model.findOneAndUpdate(filter, data, {
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
        data: doc,
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
  async deleteOneByQuery(filter, options) {
    try {
      const doc = await this.Model.findOneAndDelete(filter, options);
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

  async deleteOne(id) {
    try {
      const doc = await this.Model.findByIdAndDelete(id);
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
        doc: null,
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

  //! ============ DOAA ==================
  async getOneById(id, select, popOptions) {
    try {
      let tempDoc = this.Model.findById(id).select(select);
      if (popOptions) {
        tempDoc = tempDoc.populate(popOptions);
      }
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

  async getRefrenced(query, populated) {
    try {
      const doc = await this.Model.findOne(query)
        .populate(populated)
        .select({ populated: 1, _id: 0 });
      // console.log(doc);
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
  async addToRefrenced(query, refrenceQuery) {
    try {
      const doc = await this.Model.findOneAndUpdate(query, refrenceQuery);
      // console.log(doc);
      if (!doc) {
        const response = {
          status: "fail",
          statusCode: 404,
          err: "cannot find document",
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
  async removeFromRefrenced(query, refrenceQuery) {
    try {
      const doc = await this.Model.findOneAndUpdate(query, refrenceQuery);
      if (!doc) {
        const response = {
          status: "fail",
          statusCode: 404,
          err: "cannot find document",
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

  async getById(id, select) {
    const doc = await this.Model.findById(id).select(select);
    return doc;
  }

  async isValidId(id) {
    const doc = await this.Model.findById(id);
    if (!doc) return false;
    return true;
  }
}

module.exports = Repository;
