const BaseService = require("./base.service");
let _businessRepository = null;

class BusinessService extends BaseService {
  constructor({ BusinessRepository }) {
    super(BusinessRepository);
    _businessRepository = BusinessRepository;
  }
  async getBusinessByEmail(email) {
    return await _businessRepository.getBusinessByEmail(email);
  }
}

module.exports = BusinessService;
