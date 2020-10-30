let _productService = null;

class ProductController {
  constructor({ ProductService }) {
    _productService = ProductService;
  }
  async get(req, res) {
    const { productId } = req.params;
    const product = await _productService.get(productId);
    return res.send(product);
  }
  async getAll(req, res) {
    const products = await _productService.getAll();
    return res.send(products);
  }
  async update(req, res) {
    const { body } = req;
    const { productId } = req.params;
    const updateProduct = await _productService.update(productId, body);
    return res.send(updateProduct);
  }
  async delete(req, res) {
    const { productId } = req.params;
    const deletedProduct = await _productService.delete(productId);
    return res.send(deletedProduct);
  }
  async create(req, res) {
    const { body } = req;
    const createProduct = await _productService.create(body);
    return res.status(201).send(createProduct);
  }
}

module.exports = ProductController;
