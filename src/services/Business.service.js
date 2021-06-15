const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");

import { Payment, Support } from "../helpers";

let _businessRepository = null;
let _calificationService = null;
let _productService = null;
let _servService = null;
let _historyRepository = null;

function _err(msg, code = 500) {
     const err = new Error();
     err.code = code;
     err.message = msg;
     throw err;
}

class BusinessService extends BaseService {
     constructor({ BusinessRepository, CalificationService, ProductService, ServService, HistoryRepository }) {
          super(BusinessRepository);
          _businessRepository = BusinessRepository;
          _calificationService = CalificationService;
          _productService = ProductService;
          _servService = ServService;
          _historyRepository = HistoryRepository;
     }

     /**
      *
      * @param {*} email
      */
     async getBusinessByEmail(email) {
          const business = await _businessRepository.getBusinessByEmail(email);
          if (business?.inactive?.reason) {
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
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
          if (business?.inactive?.reason) {
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
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
          if (!id) _err("ID must be sent", 401);

          const { admin, source, urlConfirm, urlReset, codeVerification, counter, active, plan, businessType, ruc } = entity;
          if (admin || source || urlConfirm || urlReset || codeVerification || counter || active || plan || businessType || ruc) {
               _err("You do not have permission", 401);
          }

          const businessExists = await _businessRepository.get(id);

          if (!businessExists || businessExists?.inactive?.reason) {
               _err("Business not found", 400);
          }
          const newEntity = entity;

          if (newEntity.password) {
               if (businessExists.urlConfirm?.url) await _businessRepository.deleteField(businessExists._id, "urlConfirm");
               newEntity.urlReset = { url: "", created: new Date() };
          }
          if (newEntity.advertisement === null) {
               _businessRepository.deleteField(businessExists._id, "advertisement");
               delete newEntity.advertisement;
          }
          if (newEntity.images) {
               const imagesDelete = businessExists.images.filter((image) => !newEntity.images.includes(image));
               imagesDelete.forEach(async (urlImage) => {
                    await CloudStorage.deleteImage(urlImage);
               });
          }
          const _plan = String(businessExists.plan);
          const BASIC = _plan.includes("basic");

          if (newEntity.places && BASIC)  _err("Not authorized", 401);
               
          if (newEntity.owner) {
               const { owner } = businessExists;
               if (owner) {
                    const { dni: A, name: B, first_lname: C, second_lname: D } = newEntity.owner;
                    const { dni: _A, name: _B, first_lname: _C, second_lname: _D } = owner;
                    if (_A != A || _B != B || _C != C || _D != D) _err("Not authorized", 401);
               } else _err("Invalid", 400);
          }

          if (newEntity.subCategories && BASIC) {
               if (newEntity.subCategories.length > 3) _err("Not authorized", 401);
          }

          if (newEntity.shipments && BASIC) {
               if (newEntity.shipments.length > 2) _err("Not authorized", 401);
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
               error.message = "ID must be sent";
               throw error;
          }
          const businessExists = await _businessRepository.get(id);
          if (!businessExists || businessExists?.inactive?.reason) {
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
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
               if (businessExists.logo && !businessExists.logo.includes("default")) {
                    await CloudStorage.deleteImage(businessExists.logo);
               }
               if (businessExists.images.length !== 0) {
                    businessExists.images.forEach(async (image) => {
                         await CloudStorage.deleteImage(image);
                    });
               }
               await _historyRepository.create({ ...businessExists.toJSON(), type: "business" });
               await _businessRepository.delete(id);
               // await _businessRepository.update(id, { disabled: true, active: false, logo: '', images: [] });
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
          if (!businessExists || businessExists?.inactive?.reason) {
               CloudStorage.deleteLocalImage(filename);
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
               throw error;
          }
          const urlLogo = `${id}/${filename}`;
          if (businessExists.logo && !businessExists.logo.includes("default")) {
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
          if (!businessExists || businessExists?.inactive?.reason) {
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
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
          if (business?.inactive?.reason) {
               const error = new Error();
               error.status = 400;
               error.message = "Business does not found";
               throw error;
          }
          business = business.getHome();
          const califications = await _calificationService.getBusinessCalification(idBusiness);
          const articles = await business.subCategories.reduce(async (obj, item) => {
               let objResponse = { products: null, type: "" };
               if (business.category === "services")
                    objResponse = { ...objResponse, products: await _servService.getBySubCategory(item, business._id), type: "S" };
               else objResponse = { ...objResponse, products: await _productService.getBySubCategory(item, business._id), type: "P" };
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

     async validate(id, object = false) {
          const error = new Error();
          if (!id) {
               error.status = 404;
               error.message = "Id must be sent";
               throw error;
          }
          const business = await _businessRepository.get(id);
          if (!business) {
               error.status = 404;
               error.message = "Not found";
               throw error;
          }
          if (object) return business;
          return true;
     }

     async getCategory(category) {
          return _productService.getByCategory(category);
     }

     async getStorage(businessId) {
          const business = await this.validate(businessId, true);
          const { plan } = business;
          const { storage: remain_size } = Payment.planDictionary[plan];

          const S = (v, p = "") => `${p}`.concat(v);
          const I = (v) => parseInt(v);

          const meta = await CloudStorage.getMeta(businessId);
          const data = [].concat(meta).reduce(
               (o, v) => {
                    const { name, contentType, size } = v;
                    const extension = S(S(contentType).split("/")[1], ".");
                    var _no_ext = S(name).replace(extension, "");
                    const _dirs = S(_no_ext).split("/");
                    // _dirs.reduce((o, k) => (o[k] = o[k] || {}), o.tree);
                    _dirs.reduce((o, k, ind, ori) => (o[k] = o[k] || (ind === ori.length - 1 ? { contentType, size } : {})), o.tree);
                    o.types[contentType] = o.types[contentType] + 1 || 0;
                    o.extensions.push(extension);
                    o.extensions = [...new Set(o.extensions)];

                    const _size = I(size);
                    o.size_KB += _size / 1000;
                    o.size_Kb += _size / 1024;
                    o.size_MB += _size / 1000000;
                    o.size_Mb += _size / 1024000;
                    o.remain_size -= _size;
                    o.length_files += 1;
                    _dirs.splice(0, 1);
                    _dirs.splice(_dirs.length - 1, 1);
                    o.directories = o.directories.concat(_dirs);
                    o.directories = [...new Set(o.directories)];
                    o.length_directories = o.directories.length;
                    return o;
               },
               {
                    tree: {},
                    types: {},
                    extensions: [],
                    size_KB: 0,
                    size_Kb: 0,
                    size_MB: 0,
                    size_Mb: 0,
                    remain_size,
                    length_files: 0,
                    directories: [],
                    length_directories: 0,
               }
          );
          return data;
     }

     async getLines(businessId) {
          const error = new Error();

          const business = await this.validate(businessId, true);

          const { subCategories } = business;
          if (!subCategories) {
               error.status = 500;
               error.message = "No subcategories";
               throw error;
          }

          return new Promise((r, n) => {
               var f = {};
               subCategories.forEach(async (v, i, o) => {
                    await _productService.getBySubCategory(v, business._id).then((ar) => {
                         f[v] = ar.length;
                         if (Object.keys(f).length === o.length) r(f);
                    });
               });
          });
     }

     async changeLine(entity) {
          const { id, from, to, ruc, email } = entity;

          if (!id || !from || !to || !ruc || !email) _err("Invalid parameters");

          if (from === to) _err("Cannot be the same");

          const business = await this.validate(id, true);

          const { ruc: _r, email: _e } = business;
          if (_r != ruc || _e != email) _err("Invalid business");

          const { subCategories } = business;

          if (!subCategories) _err("Invalid subcategories");

          const _from = subCategories.findIndex((v) => v === from);

          if (_from === -1) _err("Invalid subcategory");

          const _to = subCategories.find((v) => v === to);
          if (_to) _err("Cannot be a subcategory already registered");

          subCategories[_from] = to;
          await _businessRepository.update(id, { subCategories });
          await _productService.updateMany(id, from, to);
          return true;
     }

     async getShipments(businessId) {
          const business = await this.validate(businessId, true);

          const { shipments } = business;
          if (!shipments) _err("No shipments found", 500)

          return new Promise((r, n) => {
               var f = {};
               shipments.forEach(async (v, i, o) => {
                    await _productService.getByShipment(v, business._id).then((ar) => {
                         f[v] = ar.length;
                         if (Object.keys(f).length === o.length) r(f);
                    });
               });
          });
     }
     
}

module.exports = BusinessService;
