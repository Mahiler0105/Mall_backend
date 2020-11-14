const BaseService = require("./base.service");

let _calificationRepository = null;

class CalificationService extends BaseService {
  constructor({ CalificationRepository }) {
    super(CalificationRepository);
    _calificationRepository = CalificationRepository;
  }

  async create(entity) {
    const { idProduct, idService, idBusiness, idClient } = entity;
    let calification;
    if (idProduct) calification = await _calificationRepository.getByProduct(idClient, idProduct);
    else if (idService) calification = await _calificationRepository.getByService(idClient, idService);
    else if (idBusiness) calification = await _calificationRepository.getByBusiness(idClient, idBusiness);
    if (calification) {
      const error = new Error();
      error.status = 404;
      error.message = "Calification already exists";
      throw error;
    }
    return _calificationRepository.create(entity);
  }
}

module.exports = CalificationService;
