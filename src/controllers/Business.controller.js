const { StorageMiddleware } = require("../middlewares");
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
    const {
      body,
      user: u,
      params: { businessId },
    } = req;
    const updateBusiness = await _businessService.update(businessId, body, u);
    return res.send(updateBusiness);
  }
  async delete(req, res) {
    const {
      params: { businessId },
      user,
    } = req;
    const deletedBusiness = await _businessService.delete(businessId, user);
    return res.send(deletedBusiness);
  }
  async saveLogo(req, res) {
    const {
      params: { businessId },
      file: { filename },
    } = req;
    const logoSave = await _businessService.saveLogo(filename, businessId);
    return res.send(logoSave);
  }
  async saveImages(req, res) {
    const {
      params: { businessId },
      file: { filename },
    } = req;
    const logoImages = await _businessService.saveImages(filename, businessId);
    return res.send(logoImages);
  }
}

module.exports = BusinessController;
