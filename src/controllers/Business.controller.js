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

     async validate(req, res) {
          const { businessId } = req.params;
          const result = await _businessService.validate(businessId);
          return res.send(result);
     }

     async getAll(_req, res) {
          const businesses = await _businessService.getAll();
          return res.send(businesses);
     }

     async update(req, res) {
          const {
               body,
               params: { businessId },
          } = req;
          const updateBusiness = await _businessService.update(businessId, body);
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
          const imagesSave = await _businessService.saveImages(filename, businessId);
          return res.send(imagesSave);
     }

     async getCategory(req, res) {
          const { categoryName } = req.params;
          const resCategory = await _businessService.getCategory(categoryName);
          return res.send(resCategory);
     }

     async getStorage(req, res) {
          const { businessId } = req.params;
          const result = await _businessService.getStorage(businessId);
          return res.send(result);
     }

     async getLines(req, res) {
          const { businessId } = req.params;
          const result = await _businessService.getLines(businessId);
          return res.send(result);
     }

     async changeLine(req, res) {
          const { body } = req;
          const result = await _businessService.changeLine(body);
          return res.send(result);
     }

     async getShipments(req, res) {
          const { businessId } = req.params;
          const result = await _businessService.getShipments(businessId);
          return res.send(result);
     }

     async postAdvertise(req, res) {
          const {
               file: { filename },
               params: { busId, adId },
          } = req;
          const result = await _businessService.uploadImageAdvertise(busId, filename, adId);
          return res.send(result);
     }

     // async delImgAd(req, res) {
     //      const { body } = req;
     //      const result = await _businessService.removeImageAdvertise(body);
     //      return res.send(result);
     // }
}

module.exports = BusinessController;
