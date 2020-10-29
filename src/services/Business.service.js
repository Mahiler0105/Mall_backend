const BaseService = require("./base.service");
let _businessRepository = null;

class BusinessService extends BaseService {
  constructor({ BusinessRepository }) {
    super(BusinessRepository);
    _businessRepository = BusinessRepository;
  }

  /**
   *
   * @param {*} email
   */
  async getBusinessByEmail(email) {
    return await _businessRepository.getBusinessByEmail(email);
  }

  /**
   *
   * @param {*} id
   * @param {*} entity
   * @param {*} jwt
   */
  async update(id, entity, jwt) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    let businessExists = await _businessRepository.get(id);
    if (!businessExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    if (businessExists._id.toString() !== jwt.id) {
      const error = new Error();
      error.status = 400;
      error.message = "Don't have permissions";
      throw error;
    }
    return await _businessRepository.update(id, entity);
  }

  /**
   *
   * @param {*} id
   * @param {*} jwt
   */
  async delete(id, jwt) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    let businessExists = await _businessRepository.get(id);
    if (!businessExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    if (businessExists._id.toString() !== jwt.id) {
      const error = new Error();
      error.status = 400;
      error.message = "Don't have permissions";
      throw error;
    }
    await _businessRepository.delete(id);
    return true;
  }
}

module.exports = BusinessService;
