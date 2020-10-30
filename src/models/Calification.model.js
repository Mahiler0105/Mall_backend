const mongoose = require("mongoose");
const { Schema } = mongoose;

const CalificationSchema = new Schema({
  review: { type: String },
  stars: { type: Number },
  idClient: {
    type: Schema.Types.ObjectId,
    ref: "customer",
    required: false,
    autopopulate: false,
  },
  idProduct: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: false,
    autopopulate: false,
  },
  idService: {
    type: Schema.Types.ObjectId,
    ref: "service",
    required: false,
    autopopulate: false,
  },
  idBusiness: {
    type: Schema.Types.ObjectId,
    ref: "business",
    required: false,
    autopopulate: false,
  },
  date: { type: Date },
});

module.exports = mongoose.model("Calification", CalificationSchema);
