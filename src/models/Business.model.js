const mongoose = require("mongoose");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const { Schema } = mongoose;

let validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const BusinessSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    urlReset: {
      url: { type: String, default: "" },
      created: { type: Date, default: new Date() },
    },
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
    phone: { type: String, maxlength: 9, minlength: 9 },
    telephone: { type: String, maxlength: 9, minlength: 9 },
    category: {
      type: String,
      enum: [
        "consumer_electronic",
        "clothing_apparel",
        "home_garden_kitchen",
        "health_beauty",
        "yewerly_watches",
        "computer_technology",
        "babies_moms",
        "sport_outdoor",
        "books_office",
        "cars_motocycles",
        "home_improments",
        "services",
      ],
    },
    subCategories: [{ type: String }],
    owner: {
      name: { type: String },
      first_lname: { type: String },
      second_lname: { type: String },
      birthdate: { type: String },
      sex: { type: Boolean },
      dni: { type: String, required: true, maxlength: 8, minlength: 8 },
      phone: { type: String, maxlength: 9, minlength: 9 },
    },
    delivery: { type: Boolean },
    bankAccount: { type: String },
    billing: new Schema(
      {
        cardNumber: { type: String },
        cvv: { type: String, maxlength: 3, minlength: 3 },
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
    password: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

BusinessSchema.methods.toJSON = function () {
  let business = this.toObject();
  delete business.password;
  return business;
};

BusinessSchema.methods.comparePasswords = function (pass) {
  return compareSync(pass, this.password);
};

BusinessSchema.pre("findOneAndUpdate", async function (next) {
  const business = this;
  if (business._update && business._update.password) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(business._update.password, salt);
    business._update.password = hashedPassword;
    next();
  }
  next();
});

module.exports = mongoose.model("Business", BusinessSchema);
