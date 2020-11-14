const BaseRepository = require("./base.repository");

let _productModel = null;

class ProductRepository extends BaseRepository {
  constructor({ Product }) {
    super(Product);
    _productModel = Product;
  }

  async getProductCategory(category) {
    return _productModel.find({ category }).sort({ counter: -1 }).limit(5);
  }
}

module.exports = ProductRepository;
