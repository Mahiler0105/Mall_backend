const mongoose = require("mongoose");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");

const { Schema } = mongoose;

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const BusinessSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    counter: { type: Number, default: 0 },
    urlReset: {
      url: { type: String, default: "" },
      created: { type: Date, default: new Date() },
    },
    language: { type: String },
    currency: { type: String, enum: ["PEN", "USD"] },
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
      dni: {
        type: String,
        required: true,
        maxlength: 8,
        minlength: 8,
      },
      phone: { type: String, maxlength: 9, minlength: 9 },
    },
    delivery: { type: Boolean },
    bankAccount: { type: String },
    stripeId: { type: String },
    cards: [
      {
        _id: false,
        last4: { type: String, maxlength: 4, minlength: 4 },
        brand: { type: String },
        paymentMethodId: { type: String },
        default: { type: Boolean },
      },
    ],
    suscription: { type: String },
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
  const business = this.toObject();
  delete business.password;
  delete business.billing;
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
