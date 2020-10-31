const BaseService = require("./base.service");
const { imageSave } = require("./Custom.handler");
const { BUCKET_NAME } = require("../config");
let _productRepository = null;

class ProductService extends BaseService {
  constructor({ ProductRepository }) {
    super(ProductRepository);
    _productRepository = ProductRepository;
  }
  async saveImage(filename, id) {
    let productExist = await _productRepository.get(id);
    if (!productExist) {
      const error = new Error();
      error.status = 400;
      error.message = "Product does not found";
      throw error;
    }
    const urlImages = `${productExist.businessId}/products/${productExist._id}/${filename}`;
    await imageSave(filename, urlImages);
    let images = productExist.images;
    images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${urlImages}`);
    await _productRepository.update(id, { images });
    return true;
  }
}

module.exports = ProductService;
