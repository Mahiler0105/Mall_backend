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
          urlConfirm: {
               url: { type: String, default: "" },
               created: { type: Date, default: new Date() },
          },
          urlReset: {
               url: { type: String, default: "" },
               created: { type: Date, default: new Date() },
          },
          source: { type: String, enum: ["google", "facebook", "microsoft", "email"] },
          codeVerification: {
               code: { type: String, default: "" },
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
                    "home_kitchen",
                    "health_beauty",
                    "yewerly_watches",
                    "computer_technology",
                    "babies_moms",
                    "sport_outdoor",
                    "books_office",
                    "vehicles",
                    "home_improments",
                    "services",
                    "farming",
                    "toy_store",
                    "pets",
                    "optical",
                    "sexshop",
                    "garden",
                    "musical_instruments",
                    "handicrafts",
                    "gift_details",
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
          //     shipments: {
          //         enabled: { type: Boolean },
          //         options: [
          //              {
          //                   type: new Schema(
          //                        {
          //                             name: { type: String },
          //                             type: { type: String, enum: ["own", "third_party"] },
          //                             places: [{ type: String, maxlength: 4, minlength: 4 }],
          //                             price: { type: Number },
          //                        },
          //                        { _id: false }
          //                   ),
          //              },
          //         ],
          //    },
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
          subscription: { type: String },
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
          plan: { type: String },
          active: { type: Boolean, default: false },
          // disabled: { type: Boolean, default: false },
          inactive: {
               type: new Schema(
                    {
                         created: { type: Date },
                         reason: { type: String },
                         seven_days: { type: Boolean, default: false },
                    },
                    { _id: false }
               ),
          },
          socialNetwork: {
               facebook: { type: String },
               instagram: { type: String },
               twitter: { type: String },
          },
          // payments: {
          //      tunki: { type: Boolean, default: false },
          //      plin: { type: Boolean, default: false },
          //      cash: { type: Boolean, default: false },
          //      yape: { type: Boolean, default: false },
          //      bankDeposit: { type: Boolean, default: false },
          //      wireTransfer: { type: Boolean, default: false },
          // },

          businessType: { type: Number, enum: [1, 2], required: true }, // RUC10, RUC20
          ruc: { type: Number, maxlength: 11, minlength: 11 }, // LENGTH 11

          password: { type: String },
          admin: { type: String, default: "denied", enum: ["authorized", "denied"] },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

BusinessSchema.methods.toJSON = function () {
     const business = this.toObject();
     delete business.password;
     delete business.billing;
     delete business.urlReset;
     delete business.urlConfirm;
     delete business.codeVerification;
     delete business.active;
     delete business.admin;
     delete business.businessType;
     delete business.counter;
     delete business.source;
     return business;
};

BusinessSchema.methods.getHome = function () {
     const business = this.toObject();
     delete business.password;
     delete business.stripeId;
     delete business.cards;
     delete business.urlReset;
     delete business.urlConfirm;
     delete business.counter;
     delete business.updatedAt;
     delete business.createdAt;
     delete business.email;
     delete business.subscription;
     delete business.language;
     delete business.currency;
     delete business.plan;
     delete business.__v;
     delete business.owner.birthdate;
     delete business.owner.sex;
     delete business.owner.dni;
     // delete business.disabled;
     delete business.codeVerification;
     delete business.source;
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

BusinessSchema.pre("save", async function (next) {
     const business = this;
     business.advertisement = undefined;
     next();
});

module.exports = mongoose.model("Business", BusinessSchema);
