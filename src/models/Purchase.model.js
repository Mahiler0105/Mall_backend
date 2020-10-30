const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseSchema = new Schema({
  idClient: {
    type: Schema.Types.ObjectId,
    ref: "customer",
    required: false,
    autopopulate: false,
  },
  idBusiness: {
    type: Schema.Types.ObjectId,
    ref: "business",
    required: false,
    autopopulate: false,
  },
  body: [
    {
      type: new Schema(
        {
          idProduct: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: false,
            autopopulate: false,
          },
          quantity: { type: Number },
          specification: {
            type: new Schema(
              {
                color: [{ type: String }],
                size: [{ type: String }],
              },
              { _id: false },
            ),
          },
          subtotal: { type: Number },
        },
        { _id: false },
      ),
    },
  ],
  date: { type: Date, default: new Date() },
  type: { type: Boolean },
  total: { type: Number },
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
