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

     async getByCurrency(currency) {
          return _documentModel.findOne({ currency });
     }

     async getBySorter() {
          return _documentModel.findOne({ type:'sorter' });
     }

     async sortDNI(asc) {
          return _documentModel.find({ type: "dni" }, null, { sort: { dni: asc ? 1 : -1 } });
     }
}

module.exports = DocumentRepository;
