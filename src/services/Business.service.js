const BaseService = require("./base.service");
const { CloudStorage } = require("../helpers");
const { BUCKET_NAME } = require("../config");

let _businessRepository = null;

class BusinessService extends BaseService {
  constructor({ BusinessRepository }) {
    super(BusinessRepository);
    _businessRepository = BusinessRepository;
  }

  /**
   *
   * @param {*} email
   */
  async getBusinessByEmail(email) {
    return _businessRepository.getBusinessByEmail(email);
  }

  /**
   *
   * @param {*} dni
   */
  async getBusinessByDni(dni) {
    return _businessRepository.getBusinessByDni(dni);
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
      error.message = "ID must be sent";
      throw error;
    }
    const businessExists = await _businessRepository.get(id);
    if (!businessExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    const newEntity = entity;
    if (newEntity.password) {
      newEntity.urlReset = { url: "", created: new Date() };
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
    if (!businessExists) {
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
    await _businessRepository.delete(id);
    return true;
  }

  /**
   *
   * @param {*} "filename"
   * @param {*} id
   */
  async saveLogo(filename, id) {
    const businessExists = await _businessRepository.get(id);
    if (!businessExists) {
      CloudStorage.deleteLocalImage(filename);
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    const urlLogo = `${id}/${filename}`;
    await CloudStorage.deleteImage(businessExists.logo);
    await CloudStorage.saveImage(filename, urlLogo);
    await _businessRepository.update(id, {
      logo: urlLogo,
    });
    return true;
  }

  async saveImages(filename, id) {
    const businessExists = await _businessRepository.get(id);
    if (!businessExists) {
      const error = new Error();
      error.status = 400;
      error.message = "Business does not found";
      throw error;
    }
    const urlImages = `${id}/images/${filename}`;
    await CloudStorage.saveImage(filename, urlImages);
    const { images } = businessExists;
    images.push(`https://storage.googleapis.com/${BUCKET_NAME}/${urlImages}`);
    await _businessRepository.update(id, { images });
    return true;
  }
}

module.exports = BusinessService;
