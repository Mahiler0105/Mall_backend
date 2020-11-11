const BaseService = require("./base.service");

// let _calificationRepository = null;

class CalificationService extends BaseService {
  constructor({ CalificationRepository }) {
    super(CalificationRepository);
    // _calificationRepository = CalificationRepository;
  }
}

module.exports = CalificationService;
