const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");
const { BUCKET_NAME } = require("../config");

let _customerRepository = null;

class CustomerService extends BaseService {
  constructor({ CustomerRepository }) {
    super(CustomerRepository);
    _customerRepository = CustomerRepository;
  }

  async getCustomerByEmail(email) {
    return _customerRepository.getCustomerByEmail(email);
  }

  async update(id, entity) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    const customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    const newEntity = entity;
    if (newEntity.password) {
      newEntity.urlReset = { url: "", created: new Date() };
    }
    return _customerRepository.update(id, newEntity);
  }

  async delete(id, jwt) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    const customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    if (jwt) {
      if (customerExists._id.toString() !== jwt.id) {
        const error = new Error();
        error.status = 400;
        error.message = "Don't have permissions";
        throw error;
      }
    }
    await _customerRepository.delete(id);
    return true;
  }

  async saveAvatar(filename, id) {
    const customerExists = await _customerRepository.get(id);
    if (!customerExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
    const urlAvatar = `avatar/${filename}`;
    await CloudStorage.saveImage(filename, urlAvatar);
    await _customerRepository.update(id, {
      avatar: `https://storage.googleapis.com/${BUCKET_NAME}/${urlAvatar}`,
    });
    return true;
  }
}

module.exports = CustomerService;
