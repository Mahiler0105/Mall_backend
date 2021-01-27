const BaseService = require('./base.service');
const { CloudStorage } = require('../helpers');

let _productRepository = null;
let _businessRepository = null;
let _calificationService = null;

class ProductService extends BaseService {
    constructor({ ProductRepository, BusinessRepository, CalificationService }) {
        super(ProductRepository);
        _productRepository = ProductRepository;
        _businessRepository = BusinessRepository;
        _calificationService = CalificationService;
    }

    async saveImage(filename, id) {
        const productExist = await _productRepository.get(id);
        if (!productExist) {
            const error = new Error();
            error.status = 400;
            error.message = 'Product does not found';
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
            error.message = 'Business does not found';
            throw error;
        }
        return _productRepository.create({ ...productEntity, category: business.category });
    }

    async get(idProduct) {
        let product = await _productRepository.get(idProduct);
        if (!product) {
            const error = new Error();
            error.status = 400;
            error.message = 'Product does not found';
            throw error;
        }
        product = product.getHome();
        const business = await _businessRepository.get(product.businessId);
        const calification = await _calificationService.getProductCalification(idProduct);
        return { product: { ...product, businessName: business.name }, califications: calification };
    }

    async getBySubCategory(subCategory, idBusiness) {
        return _productRepository.getBySubCategory(subCategory, idBusiness);
    }

    async getByCategory(category) {
        return _productRepository.getProductCategory(category);
    }

    async getProductsById(entity) {
        const { ids } = entity;
        if (!ids) {
            const error = new Error();
            error.status = 400;
            error.message = 'ID products does not found';
            throw error;
        }
        const response = await ids.reduce(async (obj, item) => {
            const product = await _productRepository.get(item);
            return {
                ...(await obj),
                [item]: product,
            };
        }, {});
        return response;
    }

    async deleteByBusinessId(id) {
        const products = await _productRepository.getProductsByBusinessId(id);
        console.log(products);
        return true;
    }
}

module.exports = ProductService;
