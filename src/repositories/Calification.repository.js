const BaseRepository = require("./base.repository");

// let _calificationModel = null;

class CalificationRepository extends BaseRepository {
  constructor({ Calification }) {
    super(Calification);
    // _calificationModel = Calification;
  }
}

module.exports = CalificationRepository;
