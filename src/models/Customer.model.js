const mongoose = require("mongoose");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const { Schema } = mongoose;

let validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const CustomerSchema = new Schema(
  {
    name: { type: String },
    urlReset: {
      url: { type: String, default: "" },
      created: { type: Date, default: new Date() },
    },
    avatar: { type: String },
    first_lname: { type: String },
    second_lname: { type: String },
    birthdate: { type: String },
    sex: { type: Boolean },
    dni: { type: String, required: true, maxlength: 8, minlength: 8 },
    phone: { type: String, maxlength: 9, minlength: 9 },
    email: {
      type: String,
      required: true,
      validate: [validateEmail, "Please fill a valid email address"],
    },
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
        cvv: { type: String, maxlength: 3, minlength: 3 },
        expireDate: { type: Date },
      },
      { _id: false },
    ),
    cart: [
      {
        type: new Schema(
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "product",
              required: false,
              autopopulate: false,
            },
            quantity: { type: Number },
            specifications: { color: { type: String }, size: { type: String } },
          },
          { _id: false },
        ),
      },
    ],
    preferences: [{ type: String }],
    password: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

CustomerSchema.methods.toJSON = function () {
  let customer = this.toObject();
  delete customer.password;
  delete customer.billing;
  return customer;
};

CustomerSchema.methods.comparePasswords = function (pass) {
  return compareSync(pass, this.password);
};

CustomerSchema.pre("findOneAndUpdate", async function (next) {
  const customer = this;
  if (customer._update && customer._update.password) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(customer._update.password, salt);
    customer._update.password = hashedPassword;
    next();
  }
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
