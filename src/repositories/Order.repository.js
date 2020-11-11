const BaseRepository = require("./base.repository");

// let _orderModel = null;

class OrderRepository extends BaseRepository {
  constructor({ Order }) {
    super(Order);
    // _orderModel = Order;
  }
}

module.exports = OrderRepository;
