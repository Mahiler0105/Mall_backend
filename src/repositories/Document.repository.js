const BaseRepository = require("./base.repository");
let _documentModel = null;

class DocumentRepository extends BaseRepository {
     constructor({ Document }) {
          super(Document);
          _documentModel = Document;
     }
     
     async getByDNI(dni) {
          return _documentModel.findOne({ dni });
     }

     async getByRUC(ruc) {
          return _documentModel.findOne({ ruc });
     }
}

module.exports = DocumentRepository;
