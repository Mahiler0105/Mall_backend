const BaseService = require("./base.service");
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
      error.message = "Business does not found";
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
}

module.exports = CustomerService;
