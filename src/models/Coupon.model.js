const mongoose = require("mongoose");

const { Schema } = mongoose;

const CouponSchema = new Schema(
     {
          amount: { type: Number },
          unit: { type: String, enum: ["fixed", "percent"], default: "fixed" },
          // currency: { type: String, enum: ["USD", "PEN"], default: "PEN" },

          label: { type: String },
          scope: {
               type: new Schema(
                    {
                         global: { type: Boolean, default: false },
                         idBusiness: {
                              type: Schema.Types.ObjectId,
                              ref: "business",
                              required: false,
                              autopopulate: false,
                         },
                         //NEGOCIO QUE HA CREADO EL CUPON DUEÑO DEL PRODUCTO
                         idProduct: {
                              type: Schema.Types.ObjectId,
                              ref: "product",
                              required: false,
                              autopopulate: false,
                         },
                         //CUPON APLICADO A UN PRODUCTO EN ESPECIFICO
                         field: { type: String, enum: ["product", "membership"] },
                    },
                    { _id: false }
               ),
          },
          capsule: { type: Boolean },
          start_date: { type: Date },
          end_date: { type: Date },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

CouponSchema.methods.toJSON = function () {
     const member = this.toObject();
     return member;
};

module.exports = mongoose.model("Coupon", CouponSchema);
