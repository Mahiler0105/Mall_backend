const BaseRepository = require('./base.repository');

let _productModel = null;

class ProductRepository extends BaseRepository {
    constructor({ Product }) {
        super(Product);
        _productModel = Product;
    }

    async getAll() {
        return _productModel.find({ available: true });
    }

    async getProductCategory(category) {
        return _productModel.find({ category, available: true }).sort({ counter: -1 }).limit(5);
    }

    async getBySubCategory(subCategory, businessId) {
        return _productModel.find({ subCategory, businessId }).sort({ counter: -1 });
    }

    async getProductsByBusinessId(businessId) {
        return _productModel.find({ businessId }).sort({ counter: -1 });
    }

    async deleteProductsByBusinessId(businessId) {
        return _productModel.updateMany({ businessId }, { available: false, images: [] });
    }

    async updateManySubcategory(businessId, subCategory, to) {
        return _productModel.updateMany({ businessId, subCategory }, { subCategory:to });
    }
}

module.exports = ProductRepository;
