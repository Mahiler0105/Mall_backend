const BaseRepository = require("./base.repository");

let _calificationModel = null;

class CalificationRepository extends BaseRepository {
  constructor({ Calification }) {
    super(Calification);
    _calificationModel = Calification;
  }

  async getByProduct(idClient, idProduct) {
    console.log(idClient, idProduct);
    return _calificationModel.findOne({ idClient, idProduct });
  }

  async getByService(idClient, idService) {
    return _calificationModel.findOne({ idClient, idService });
  }

  async getByBusiness(idClient, idBusiness) {
    return _calificationModel.findOne({ idClient, idBusiness });
  }
}

module.exports = CalificationRepository;
