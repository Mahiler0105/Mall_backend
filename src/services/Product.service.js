const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");
const { BUCKET_NAME } = require("../config");

let _productRepository = null;

class ProductService extends BaseService {
  constructor({ ProductRepository }) {
    super(ProductRepository);
    _productRepository = ProductRepository;
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
    images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${urlImages}`);
    await _productRepository.update(id, { images });
    return true;
  }
}

module.exports = ProductService;
