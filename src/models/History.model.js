const mongoose = require("mongoose");
const { Schema } = mongoose;
const stypes = ["google", "facebook", "microsoft", "email"];
const ctypes = [
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
     "none",
];
const modeltypes = ["customer", "business", "product", "customer-not-confirmed", "business-not-confirmed"];
const docs = ["DNI", "RUC", "C.E", "Otro"];

const HistorySchema = new Schema(
     {
          //MAIN BUSINESS ATTRIBUTES
          name: { type: String },
          description: { type: String },
          counter: { type: Number, default: 0 },
          source: { type: String, enum: stypes },
          location: {
               latitude: { type: String, default: "" },
               longitude: { type: String, default: "" },
          },
          email: {
               type: String,
          },
          phone: { type: String, maxlength: 9, minlength: 9 },
          telephone: { type: String, maxlength: 9, minlength: 9 },
          category: {
               type: String,
               enum: ctypes,
               required: false,
          },
          owner: {
               name: { type: String },
               first_lname: { type: String },
               second_lname: { type: String },
               dni: {
                    type: String,
                    maxlength: 8,
                    minlength: 8,
               },
          },
          plan: { type: Boolean },
          businessType: { type: Number, enum: [1, 2] }, // RUC10, RUC20
          ruc: { type: Number, maxlength: 11, minlength: 11 }, // LENGTH 11
          //MAIN CUSTOMER ATTRIBUTES
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
          },
          address: {
               type: new Schema(
                    {
                         latitude: { type: String, default: "" },
                         longitude: { type: String, default: "" },
                         department: { type: String, default: "" },
                         province: { type: String, default: "" },
                         district: { type: String, default: "" },
                         exact_address: { type: String, default: "" },
                         zip_code: { type: String, default: "" },
                    },
                    { _id: false }
               ),
          },
          preferences: [{ type: String }],
          //MAIN PRODUCTS ATTRIBUTES
          price: { type: Number },
          stock: { type: Number },
          subCategory: { type: String },
          specification: {
               type: new Schema(
                    {
                         color: [{ type: String }],
                         size: [{ type: String }],
                    },
                    { _id: false }
               ),
          },
          //COMMON
          type: { type: String, enum: modeltypes, required: true },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

HistorySchema.methods.toJSON = function () {
     const history = this.toObject();
     return history;
};
module.exports = mongoose.model("History", HistorySchema);
