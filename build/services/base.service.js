"use strict";

class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async get(id) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }

    const currentEntity = await this.repository.get(id);

    if (!currentEntity) {
      const error = new Error();
      error.status = 404;
      error.message = "Entity does not found";
      throw error;
    }

    return currentEntity;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async create(entity) {
    return this.repository.create(entity);
  }

  async update(id, entity) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }

    const entityRes = await this.repository.update(id, entity);

    if (!entityRes) {
      const error = new Error();
      error.status = 400;
      error.message = "Entity does not found";
      throw error;
    }

    return entityRes;
  }

  async delete(id) {
    if (!id) {
      const error = new Error();
      error.status = 400;
      error.message = "ID must be sent";
      throw error;
    }

    const entityDel = await this.repository.delete(id);

    if (!entityDel) {
      const error = new Error();
      error.status = 400;
      error.message = "Entity does not found";
      throw error;
    }

    return true;
  }

  async deleteField(_id, field) {
    if (!field) {
      const error = new Error("Field must be sent");
      error.status = 400;
      throw error;
    }

    await this.repository.update({
      _id
    }, {
      $unset: {
        [field]: ""
      }
    });
    return true;
  }

}

module.exports = BaseService;