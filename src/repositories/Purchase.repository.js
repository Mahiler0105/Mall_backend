const BaseRepository = require("./base.repository");

let _purchaseModel = null;

class PurchaseRepository extends BaseRepository {
     constructor({ Purchase }) {
          super(Purchase);
          _purchaseModel = Purchase;
     }
     async getPaymentsByCustomerId(idClient) {
          return _purchaseModel.find({ idClient });
     }
}

module.exports = PurchaseRepository;
