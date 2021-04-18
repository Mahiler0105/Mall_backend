"use strict";

const BaseRepository = require("./base.repository");

let _customerModel = null;

class CustomerRepository extends BaseRepository {
  constructor({
    Customer
  }) {
    super(Customer);
    _customerModel = Customer;
  }

  async getCustomerByEmail(email) {
    return _customerModel.findOne({
      email
    });
  }

}

module.exports = CustomerRepository;