const BaseService = require('./base.service');
const { CloudStorage } = require('../helpers');

let _businessRepository = null;
let _calificationService = null;
let _productService = null;
let _servService = null;

class BusinessService extends BaseService {
    constructor({ BusinessRepository, CalificationService, ProductService, ServService }) {
        super(BusinessRepository);
        _businessRepository = BusinessRepository;
        _calificationService = CalificationService;
        _productService = ProductService;
        _servService = ServService;
    }

    /**
     *
     * @param {*} email
     */
    async getBusinessByEmail(email) {
        const business = await _businessRepository.getBusinessByEmail(email);
        if (business.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        return business;
    }

    /**
     *
     * @param {*} dni
     */
    async getBusinessByDni(dni) {
        const business = await _businessRepository.getBusinessByDni(dni);
        if (business.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        return business;
    }

    /**
     *
     * @param {*} id
     * @param {*} entity
     * @param {*} jwt
     */
    async update(id, entity) {
        if (!id) {
            const error = new Error();
            error.status = 400;
            error.message = 'ID must be sent';
            throw error;
        }

        const businessExists = await _businessRepository.get(id);
        if (!businessExists || businessExists.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        const newEntity = entity;
        if (newEntity.source) {
            const error = new Error();
            error.status = 400;
            error.message = 'You do not have permission';
            throw error;
        }
        if (newEntity.password) newEntity.urlReset = { url: '', created: new Date() };
        if (newEntity.advertisement === null) {
            _businessRepository.deleteField(businessExists._id, 'advertisement');
            delete newEntity.advertisement;
        }
        if (newEntity.images) {
            const imagesDelete = businessExists.images.filter((image) => !newEntity.images.includes(image));
            imagesDelete.forEach(async (urlImage) => {
                await CloudStorage.deleteImage(urlImage);
            });
        }
        return _businessRepository.update(id, newEntity);
    }

    /**
     *
     * @param {*} id
     * @param {*} jwt
     */
    async delete(id, jwt) {
        if (!id) {
            const error = new Error();
            error.status = 400;
            error.message = 'ID must be sent';
            throw error;
        }
        const businessExists = await _businessRepository.get(id);
        if (!businessExists || businessExists.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        if (jwt) {
            if (businessExists._id.toString() !== jwt.id) {
                const error = new Error();
                error.status = 400;
                error.message = "Don't have permissions";
                throw error;
            }
        }
        try {
            await _productService.deleteByBusinessId(businessExists._id);
            if (businessExists.logo && !businessExists.logo.includes('default')) {
                await CloudStorage.deleteImage(businessExists.logo);
            }
            if (businessExists.images.length !== 0) {
                businessExists.images.forEach(async (image) => {
                    await CloudStorage.deleteImage(image);
                });
            }
            await _businessRepository.update(id, { disabled: true, active: false, logo: '', images: [] });
        } catch (err) {
            console.log(err);
        }
        return true;
    }

    /**
     *
     * @param {*} "filename"
     * @param {*} id
     */
    async saveLogo(filename, id) {
        const businessExists = await _businessRepository.get(id);
        if (!businessExists || businessExists.disabled) {
            CloudStorage.deleteLocalImage(filename);
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        const urlLogo = `${id}/${filename}`;
        if (businessExists.logo && !businessExists.logo.includes('default')) {
            await CloudStorage.deleteImage(businessExists.logo);
        }
        await CloudStorage.saveImage(filename, urlLogo);
        await _businessRepository.update(id, {
            logo: urlLogo,
        });
        return true;
    }

    async saveImages(filename, id) {
        const businessExists = await _businessRepository.get(id);
        if (!businessExists || businessExists.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        const urlImages = `${id}/images/${filename}`;
        await CloudStorage.saveImage(filename, urlImages);
        const { images } = businessExists;
        images.push(urlImages);
        await _businessRepository.update(id, { images });
        return true;
    }

    /**
     *
     * @param {*} idBusiness
     */
    async get(idBusiness) {
        let business = await _businessRepository.get(idBusiness);
        if (business.disabled) {
            const error = new Error();
            error.status = 400;
            error.message = 'Business does not found';
            throw error;
        }
        business = business.getHome();
        const califications = await _calificationService.getBusinessCalification(idBusiness);
        const articles = await business.subCategories.reduce(async (obj, item) => {
            let objResponse = { products: null, type: '' };
            if (business.category === 'services') objResponse = { ...objResponse, products: await _servService.getBySubCategory(item, business._id), type: 'S' };
            else objResponse = { ...objResponse, products: await _productService.getBySubCategory(item, business._id), type: 'P' };
            objResponse.products = objResponse.products.map((ele) => {
                return {
                    _id: ele._id,
                    name: ele.name,
                    price: ele.price,
                    image: ele.images[0],
                    counter: ele.counter,
                    type: objResponse.type,
                    specification: ele.specification,
                };
            });
            return {
                ...(await obj),
                [item]: objResponse.products,
            };
        }, {});
        return { business, califications, articles };
    }

    async getCategory(category) {
        return _productService.getByCategory(category);
    }
}

module.exports = BusinessService;
