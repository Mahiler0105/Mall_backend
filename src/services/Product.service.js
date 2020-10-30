const BaseService = require("./base.service");
let _productRepository = null;

class ProductService extends BaseService {
  constructor({ ProductRepository }) {
    super(ProductRepository);
    _productRepository = ProductRepository;
  }
}

module.exports = ProductService;
