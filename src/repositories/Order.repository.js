const BaseRepository = require("./base.repository");

let _orderModel = null;
class OrderRepository extends BaseRepository {
     constructor({ Order }) {
          super(Order);
          _orderModel = Order;
     }
     async getOrdersByCustomerId(idClient) {
          return _orderModel.find({ idClient });
     }

     async getOrdersByBusinessId(idBusiness) {
          return _orderModel.find({ idBusiness });
     }

     async getOrdersByPreferenceId(preference_id) {
          return _orderModel.find({ preference_id });
     }
}

module.exports = OrderRepository;
