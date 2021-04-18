"use strict";

const BaseRepository = require("./base.repository");

let _serviceModel = null;

class ServiceRepository extends BaseRepository {
  constructor({
    Service
  }) {
    super(Service);
    _serviceModel = Service;
  }

  getTopService() {
    return _serviceModel.find().sort({
      counter: -1
    }).limit(5);
  }

  async getBySubCategory(subCategory, businessId) {
    return _serviceModel.find({
      subCategory,
      businessId
    }).sort({
      counter: -1
    });
  }

}

module.exports = ServiceRepository;