"use strict";

let _customerService = null;

class CustomerController {
  constructor({
    CustomerService
  }) {
    _customerService = CustomerService;
  }

  async get(req, res) {
    const {
      customerId
    } = req.params;
    const customer = await _customerService.get(customerId);
    return res.send(customer);
  }

  async getAll(req, res) {
    const customers = await _customerService.getAll();
    return res.send(customers);
  }

  async update(req, res) {
    const {
      body
    } = req;
    const {
      customerId
    } = req.params;
    const updateCustomer = await _customerService.update(customerId, body);
    return res.send(updateCustomer);
  }

  async delete(req, res) {
    const {
      customerId
    } = req.params;
    const deletedCustomer = await _customerService.delete(customerId);
    return res.send(deletedCustomer);
  }

  async saveAvatar(req, res) {
    const {
      params: {
        customerId
      },
      file: {
        filename
      }
    } = req;
    const avatarSave = await _customerService.saveAvatar(filename, customerId);
    return res.send(avatarSave);
  }

}

module.exports = CustomerController;