const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");

let _serviceRepository = null;
let _businessRepository = null;
let _calificationService = null;

class ServService extends BaseService {
  constructor({ ServiceRepository, BusinessRepository, CalificationService }) {
    super(ServiceRepository);
    _serviceRepository = ServiceRepository;
    _businessRepository = BusinessRepository;
    _calificationService = CalificationService;
  }

  async saveImage(filename, id) {
    const serviceExist = await _serviceRepository.get(id);
    if (!serviceExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Service does not found";
      throw error;
    }
    const urlImages = `${serviceExist.businessId}/services/${serviceExist._id}/${filename}`;
    await CloudStorage.saveImage(filename, urlImages);
    const { images } = serviceExist;
    images.push(urlImages);
    await _serviceRepository.update(id, { images });
    return true;
  }

  async create(serviceEntity) {
    const business = await _businessRepository.get(serviceEntity.businessId);
    if (!business) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    return _serviceRepository.create({ ...serviceEntity, category: business.category });
  }

  async get(idService) {
    let service = await _serviceRepository.get(idService);
    service = service.getHome();
    if (!service) {
      const error = new Error();
      error.status = 400;
      error.message = "Product does not found";
      throw error;
    }
    const business = await _businessRepository.get(service.businessId);
    const calification = await _calificationService.getServiceCalification(idService); /// FALTA
    return { service: { ...service, businessName: business.name }, califications: calification };
  }

  async getBySubCategory(subCategory, idBusiness) {
    return _serviceRepository.getBySubCategory(subCategory, idBusiness);
  }

  // async getServicesById(entity) {
  //   const { ids } = entity;
  //   if (!ids) {
  //     const error = new Error();
  //     error.status = 400;
  //     error.message = "ID products does not found";
  //     throw error;
  //   }
  //   const response = await ids.reduce(async (obj, item) => {
  //     const service = await _serviceRepository.get(item);

  //     return {
  //       ...(await obj),
  //       [item]: service,
  //     };
  //   }, {});
  //   return response;
  // }
}

module.exports = ServService;
