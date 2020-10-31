const BaseService = require("./base.service");
const { imageSave } = require("./Custom.handler");
const { BUCKET_NAME } = require("../config");
let _customerRepository = null;

class CustomerService extends BaseService {
  constructor({ CustomerRepository }) {
    super(CustomerRepository);
    _customerRepository = CustomerRepository;
  }
  async getCustomerByEmail(email) {
    return await _customerRepository.getCustomerByEmail(email);
  }

  async update(id, entity, jwt) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    let customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    if (customerExists._id.toString() !== jwt.id) {
      const error = new Error();
      error.status = 400;
      error.message = "Don't have permissions";
      throw error;
    }
    return await _customerRepository.update(id, entity);
  }

  async delete(id, jwt) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    let customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    if (customerExists._id.toString() !== jwt.id) {
      const error = new Error();
      error.status = 400;
      error.message = "Don't have permissions";
      throw error;
    }
    await _customerRepository.delete(id);
    return true;
  }
  async saveAvatar(filename, id) {
    let customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    const urlAvatar = `avatar/${filename}`;
    await imageSave(filename, urlAvatar);
    await _customerRepository.update(id, {
      avatar: `https://storage.googleapis.com/${BUCKET_NAME}/${urlAvatar}`,
    });
    return true;
  }
}

module.exports = CustomerService;
