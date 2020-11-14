const BaseRepository = require("./base.repository");

let _calificationModel = null;

class CalificationRepository extends BaseRepository {
  constructor({ Calification }) {
    super(Calification);
    _calificationModel = Calification;
  }

  async getByProduct(idClient, idProduct) {
    return _calificationModel.findOne({ idClient, idProduct });
  }

  async getByService(idClient, idService) {
    return _calificationModel.findOne({ idClient, idService });
  }

  async getByBusiness(idClient, idBusiness) {
    return _calificationModel.findOne({ idClient, idBusiness });
  }

  async getBusinessCalification(idBusiness) {
    return _calificationModel.find({ idBusiness });
  }

  async getProductCalification(idProduct) {
    return _calificationModel.find({ idProduct });
  }

  async getServiceCalification(idService) {
    return _calificationModel.find({ idService });
  }
}

module.exports = CalificationRepository;
