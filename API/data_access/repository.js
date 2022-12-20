const APIFeatures = require("./apiFeatures");
const ObjectId = require("mongodb").ObjectId;
const { mongoErrors, decorateError } = require("../error_handling/errors");

class Repository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Creates a document with type model
   * @param {object} data
   * @returns {object}
   */
  async createOne(data) {
    try {
      const doc = await this.model.create(data);
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  /**
   * Finds a doc based on its ID
   * @param {string} id - The doc ID
   * @param {string} [select] - A comma separated list of fields to be selected
   * @param {string} [pop] - The field to be populated
   * @returns {object}
   */
  async findById(id, select, pop) {
    try {
      if (!ObjectId.isValid(id))
        return { success: false, error: mongoErrors.NOT_FOUND };
     // console.log("beforeeeeeeeeeeeeeeeeeeeeeeeee");
     // console.log(select);
    //  console.log(pop);
      let query = this.model.findById(id);
      if (select) query = query.select(select);
      if (pop) query = query.populate(pop);
      const doc = await query;
      console.log("should not");
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
     // console.log(doc);
      return { success: true, doc: doc };

      //most probably you won't need error handling in this function but just to be on the safe side
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async findByName(name, select, pop) {
    try {
      let query = this.model.findOne({ fixedName: name });
      if (select) query = query.select(select);
      if (pop) query = query.populate(pop);
      const doc = await query;

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };

      //most probably you won't need error handling in this function but just to be on the safe side
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async push(id, obj) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { _id: id },
        { $push: obj }
      );
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async pull(id, obj) {
    try {
      const doc = await this.model.findOneAndUpdate(
        { _id: id },
        { $pull: obj }
      );
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  async deleteById(id) {
    try {
      if (!ObjectId.isValid(id))
        return { success: false, error: mongoErrors.NOT_FOUND };

      const doc = await this.model.findByIdAndDelete(id);
      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };
      return { success: true, doc: doc };
    } catch (err) {
      return { sucess: false, ...decorateError(err) };
    }
  }

  async isValidId(id) {
    if (!ObjectId.isValid(id)) return false;

    const doc = await this.model.findById(id);
    if (!doc) return false;
    return true;
  }

  /**
   * Finds a doc based on its ID
   * Makes sure post is not soft deleted
   * @param {string} id - The doc ID
   * @param {string} [select] - A comma separated list of fields to be selected
   * @param {string} [pop] - The field to be populated
   * @returns {object}
   */
  async exists(id) {
    try {
      if (!ObjectId.isValid(id))
        return { success: false, error: mongoErrors.NOT_FOUND };

      const doc = await this.model.findOne({ _id: id, isDeleted: false });
      await doc.depopulate("author");

      if (!doc) return { success: false, error: mongoErrors.NOT_FOUND };

      return { success: true, doc: doc };

      //most probably you won't need error handling in this function but just to be on the safe side
    } catch (err) {
      return { success: false, ...decorateError(err) };
    }
  }

  //==========================================================================================================
  //==========================="DEPRECATED"(DO NOT USE THESE FUNCTIONS, CREATE YOUR OWN IN YOUR REPO)==========
  //==========================================================================================================

  async getOneById(id, select, popOptions) {
    try {
      let tempDoc = this.model.findById(id).select(select);
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
  async updateOneByQuery(filter, data) {
    try {
      const doc = await this.model.findOneAndUpdate(filter, data, {
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
  async deleteOneByQuery(filter, options) {
    try {
      const doc = await this.model.findOneAndDelete(filter, options);
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
  async getByQuery(query, select) {
    try {
      let doc = this.model.findOne(query);
      if (select) doc = doc.select(select);

      return await doc;
    } catch (error) {
      return null;
    }
  }
  async getOne(query, select, popOptions) {
    try {
      let tempDoc = this.model.findOne(query).select(select);
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
      const doc = await this.model.findByIdAndUpdate(id, data, {
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
  async getlist(query, select, popOptions) {
    try {
      let tempDoc = this.model.find(query).select(select);
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
  async getAllAndSelect(filter, select, populate, query) {
    try {
      const features = new APIFeatures(
        model.find(filter).select(select).populate(populate),
        query
      )
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
  async getAll(filter, query, popOptions) {
    try {
      const features = new APIFeatures(this.model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      // const doc = await features.query.explain();
      let doc = await features.query.populate(popOptions);
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
      const doc = await this.model
        .findOne(query)
        .populate(populated)
        .select({ populated: 1, _id: 0, createdAt: 1 });
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
      const doc = await this.model.findOneAndUpdate(query, refrenceQuery);
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
      const doc = await this.model.findOneAndUpdate(query, refrenceQuery);
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
}

module.exports = Repository;
