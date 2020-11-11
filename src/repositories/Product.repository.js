const BaseRepository = require("./base.repository");

// let _productModel = null;

class ProductRepository extends BaseRepository {
  constructor({ Product }) {
    super(Product);
    // _productModel = Product;
  }
}

module.exports = ProductRepository;
