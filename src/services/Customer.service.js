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
}

module.exports = CustomerService;
