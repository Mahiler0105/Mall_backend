const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");

let _productRepository = null;
let _businessRepository = null;

class ProductService extends BaseService {
  constructor({ ProductRepository, BusinessRepository }) {
    super(ProductRepository);
    _productRepository = ProductRepository;
    _businessRepository = BusinessRepository;
  }

  async saveImage(filename, id) {
    const productExist = await _productRepository.get(id);
    if (!productExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Product does not found";
      throw error;
    }
    const urlImages = `${productExist.businessId}/products/${productExist._id}/${filename}`;
    await CloudStorage.saveImage(filename, urlImages);
    const { images } = productExist;
    images.push(urlImages);
    await _productRepository.update(id, { images });
    return true;
  }

  async create(productEntity) {
    const business = await _businessRepository.get(productEntity.businessId);
    if (!business) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    return _productRepository.create({ ...productEntity, category: business.category });
  }
}

module.exports = ProductService;
