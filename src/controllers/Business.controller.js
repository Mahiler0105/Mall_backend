let _businessService = null;

class BusinessController {
  constructor({ BusinessService }) {
    _businessService = BusinessService;
  }
  async get(req, res) {
    const { businessId } = req.params;
    const business = await _businessService.get(businessId);
    return res.send(business);
  }
  async getAll(req, res) {
    const businesses = await _businessService.getAll();
    return res.send(businesses);
  }
  async update(req, res) {
    const { body } = req;
    const { businessId } = req.params;
    const updateBusiness = await _businessService.update(businessId, body);
    return res.send(updateBusiness);
  }
  async delete(req, res) {
    const { businessId } = req.params;
    const deletedBusiness = await _businessService.delete(businessId);
    return res.send(deletedBusiness);
  }
}

module.exports = BusinessController;
