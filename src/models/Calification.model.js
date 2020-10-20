const mongoose = require("mongoose");
const { Schema } = mongoose;

const CalificationSchema = new Schema({
  review: { type: String },
  stars: { type: Number },
  idClient: { type: Schema.Types.ObjectId },
  idProduct: { type: Schema.Types.ObjectId },
  idBusiness: { type: Schema.Types.ObjectId },
  date: { type: Date },
});

module.exports = mongoose.model("Calification", CalificationSchema);
