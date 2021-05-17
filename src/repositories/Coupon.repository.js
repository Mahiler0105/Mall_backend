const BaseRepository = require("./base.repository");
let _couponModel = null;

class CouponRepository extends BaseRepository {
     constructor({ Coupon }) {
          super(Coupon);
          _couponModel = Coupon;
     }

     async byLabel(label) {
          return _couponModel.findOne({ label });
     }
}

module.exports = CouponRepository;
