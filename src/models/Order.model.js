const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  idPurchase: { type: Schema.Types.ObjectId },
  delivered: { type: Boolean },
  date: { type: Date },
  deliveredPersonName: { type: String },
  phone: { type: String },
  dni: { type: String },
  status: { type: String, enum: ["0", "1", "2"] },
});

module.exports = mongoose.model("Order", OrderSchema);
