const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerSchema = new Schema({
  name: { type: String },
  first_lname: { type: String },
  second_lname: { type: String },
  birthdate: { type: String },
  sex: { type: Boolean },
  dni: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  address: {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
    department: { type: String, default: "" },
    province: { type: String, default: "" },
    district: { type: String, default: "" },
  },
  billing: new Schema(
    {
      cardNumber: { type: String },
      cvv: { type: String },
      expireDate: { type: Date },
    },
    { _id: false },
  ),
  cart: [
    {
      type: new Schema(
        {
          productId: { type: Schema.Types.ObjectId },
          quantity: { type: Number },
          specifications: { color: { type: String }, size: { type: String } },
        },
        { _id: false },
      ),
    },
  ],
  preferences: [{ type: String }],
  password: { type: String, required: true },
});

module.exports = mongoose.model("Customer", CustomerSchema);
