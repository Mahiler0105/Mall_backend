const mongoose = require("mongoose");
const { Schema } = mongoose;

const BusinessSchema = new Schema({
  name: { type: String },
  description: { type: String },
  location: {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
  },
  logo: { type: String },
  images: [{ type: String }],
  email: { type: String, required: true },
  phone: { type: String },
  telephone: { type: String },
  category: { type: String, enum: [""] },
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
  billing: new Schema({
    cardNumber: { type: String },
    cvv: { type: String },
    expireDate: { type: Date },
  }),
  advertisement: {
    title: { type: String },
    description: { type: String },
  },
  openClose: {
    m: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    t: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    w: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    t: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    f: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    s: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
    x: {
      open: { type: Date },
      close: { type: Date },
      enabled: { type: Boolean },
    },
  },
  plan: { type: Boolean },
  active: { type: Boolean },
  socialNetwork: {
    facebook: { link: { type: String } },
    instagram: { link: { type: String } },
    twitter: { link: { type: String } },
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Business", BusinessSchema);
