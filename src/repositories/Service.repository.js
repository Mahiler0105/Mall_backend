const BaseRepository = require("./base.repository");
let _serviceModel = null;

class ServiceRepository extends BaseRepository {
  constructor({ Service }) {
    super(Service);
    _serviceModel = Service;
  }
}

module.exports = ServiceRepository;
