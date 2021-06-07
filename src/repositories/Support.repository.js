const BaseRepository = require("./base.repository");
let _supportModel = null;

class SupportRepository extends BaseRepository {
     constructor({ Support }) {
          super(Support);
          _supportModel = Support;
     }

     async list(idBusiness) {
          return _supportModel.find({ idBusiness });
     }

     async search(entity) {
          return _supportModel.find(entity);
     }

}

module.exports = SupportRepository;
