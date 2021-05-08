const mongoose = require("mongoose");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");

const { Schema } = mongoose;

const validateEmail = function (email) {
     const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     return re.test(email);
};

const validateDocs = function ({ list, active: { doc_number, doc_type } }) {
     const M = {
          DNI: { max: 8, min: 8 },
          "C.E": { max: 12, min: 8 },
          RUC: { max: 11, min: 11 },
          Otro: { max: 20, min: 5 },
     };
     if (list.length > 2) return false;
     var _pre = {},
          pass = true;
     list.forEach(function ({ doc_number, doc_type }) {
          if (_pre[doc_number]) pass = false;
          const { max, min } = M[doc_type];
          const _l = doc_number.length;
          if (_l < min || _l > max) pass = false;
          _pre[doc_number] = true;
     });
     const _l = doc_number.length;
     const { max, min } = M[doc_type];
     if (_l < min || _l > max) pass = false;
     return pass;
};
const docs = ["DNI", "RUC", "C.E", "Otro"];
const sources = ["google", "facebook", "microsoft", "email"];

const CustomerSchema = new Schema(
     {
          name: { type: String },
          urlReset: {
               url: { type: String, default: "" },
               created: { type: Date, default: new Date() },
          },
          urlConfirm: {
               url: { type: String, default: "" },
               created: { type: Date, default: new Date() },
          },
          source: { type: String, enum: sources },
          codeVerification: {
               code: { type: String, default: "" },
               created: { type: Date, default: new Date() },
          },
          language: { type: String },
          currency: { type: String, enum: ["PEN", "USD"] },
          avatar: { type: String },
          first_lname: { type: String },
          second_lname: { type: String },
          birthdate: { type: String },
          sex: { type: Boolean },
          documents: {
               type: new Schema(
                    {
                         list: [
                              {
                                   type: new Schema(
                                        {
                                             doc_number: { type: String, required: true },
                                             doc_type: { type: String, required: true, enum: docs },
                                        },
                                        { _id: false }
                                   ),
                                   required: true,
                              },
                         ],
                         active: {
                              type: new Schema(
                                   {
                                        doc_number: { type: String, required: true },
                                        doc_type: { type: String, required: true, enum: docs },
                                   },
                                   { _id: false }
                              ),
                              required: true,
                         },
                    },
                    { _id: false }
               ),
               validate: [validateDocs, "Invalid documents schema"],
          },
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
               exact_address: { type: String, default: "" },
               zip_code: { type: String, default: "" },
          },
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
                         { _id: false }
                    ),
               },
          ],
          preferences: [{ type: String }],
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
          password: { type: String },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

CustomerSchema.methods.toJSON = function () {
     const customer = this.toObject();
     delete customer.password;
     delete customer.disabled;
     delete customer.billing;
    //  delete customer.source;
     delete customer.urlReset;
     delete customer.urlConfirm;
     delete customer.codeVerification;
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
