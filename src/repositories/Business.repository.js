const BaseRepository = require("./base.repository");
let _businessModel = null;

class BusinessRepository extends BaseRepository {
  constructor({ Business }) {
    super(Business);
    _businessModel = Business;
  }
  async getBusinessByEmail(email) {
    return await _businessModel.findOne({ email });
  }
  async getBusinessByDni(dni) {
    return await _businessModel.findOne({ "owner.dni": dni });
  }
}

module.exports = BusinessRepository;
