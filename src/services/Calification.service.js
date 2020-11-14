const moment = require("moment");
const BaseService = require("./base.service");

let _calificationRepository = null;
let _customerRepository = null;

class CalificationService extends BaseService {
  constructor({ CalificationRepository, CustomerRepository }) {
    super(CalificationRepository);
    _calificationRepository = CalificationRepository;
    _customerRepository = CustomerRepository;
  }

  async create(entity) {
    const { idProduct, idService, idBusiness, idClient } = entity;
    const customer = await _customerRepository.get(idClient);
    if (!customer) {
      const error = new Error();
      error.status = 400;
      error.message = "Customer does not found";
      throw error;
    }
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

  async update(id, entity) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }
    const entityExists = await _calificationRepository.get(id);
    if (!entityExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Calification does not found";
      throw error;
    }
    if (moment().diff(entityExists.createdAt, "hours") > 12) {
      const error = new Error();
      error.status = 400;
      error.message = "Calification cannot be edited";
      throw error;
    }
    return _calificationRepository.update(id, entity);
  }

  async getBusinessCalification(id) {
    const califications = await _calificationRepository.getBusinessCalification(id);
    return califications.length !== 0 ? this.calificationGet(califications) : califications;
  }

  async getProductCalification(id) {
    const califications = await _calificationRepository.getProductCalification(id);
    return califications.length !== 0 ? this.calificationGet(califications) : califications;
  }

  async getServiceCalification(id) {
    const califications = await _calificationRepository.getServiceCalification(id);
    return califications.length !== 0 ? this.calificationGet(califications) : califications;
  }

  /**
   *   FUNCTION UTILITARY
   * @param {*} califications
   */
  async calificationGet(califications) {
    return Promise.all(
      califications.map(async (element) => {
        const customer = await _customerRepository.get(element.idClient);
        return {
          _id: element._id,
          review: element.review,
          stars: element.stars,
          idClient: element.idClient,
          nameClient: `${customer.name} ${customer.first_lname} ${customer.second_lname}`,
          avatarClient: customer.avatar ? customer.avatar : "",
          date: element.createdAt,
          edit: moment().diff(element.createdAt, "hours") > 12 ? 0 : 1,
        };
      }),
    );
  }
}

module.exports = CalificationService;
