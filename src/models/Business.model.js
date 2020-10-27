const mongoose = require("mongoose");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const { Schema } = mongoose;

let validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const BusinessSchema = new Schema({
  name: { type: String },
  description: { type: String },
  location: {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
  },
  logo: { type: String },
  images: [{ type: String }],
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
  phone: { type: String },
  telephone: { type: String },
  category: { type: String, enum: ["Deportes"] },
  subCategories: [{ type: String }],
  owner: {
    name: { type: String },
    first_lname: { type: String },
    second_lname: { type: String },
    birthdate: { type: String },
    sex: { type: Boolean },
    dni: { type: String, required: true },
    phone: { type: String },
  },
  delivery: { type: Boolean },
  bankAccount: { type: String },
  billing: new Schema(
    {
      cardNumber: { type: String },
      cvv: { type: String },
      expireDate: { type: Date },
    },
    { _id: false },
  ),
  advertisement: {
    title: { type: String },
    description: { type: String },
  },
  openClose: {
    l: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    m: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    w: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    j: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    v: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    s: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    d: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
  },
  plan: { type: Boolean },
  active: { type: Boolean },
  socialNetwork: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
  },
  password: { type: String, required: true },
});

BusinessSchema.methods.toJSON = function () {
  let business = this.toObject();
  delete business.password;
  return business;
};

BusinessSchema.methods.comparePasswords = function (pass) {
  return compareSync(pass, this.password);
};

BusinessSchema.pre("save", async function (next) {
  const business = this;
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(business.password, salt);
  business.password = hashedPassword;
  next();
});

BusinessSchema.pre("findOneAndUpdate", async function (next) {
  const business = this;
  if (business._update.password) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(business._update.password, salt);
    business._update.password = hashedPassword;
    next();
  }
  next();
});

module.exports = mongoose.model("Business", BusinessSchema);
