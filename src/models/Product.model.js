const mongoose = require("mongoose");

const { Schema } = mongoose;

import subcategories from "../lib/categories/subcategories.json";
import categories from "../lib/categories/categories.json";

const ProductSchema = new Schema(
     {
          name: { type: String },
          counter: { type: Number, default: 0 },
          price: { type: Number },
          images: [{ type: String }],
          description: { type: String },
          stock: { type: Number },
          available: { type: Boolean },
          promotion: {
               type: new Schema(
                    {
                         type: { type: Boolean },
                         dates: {
                              type: new Schema(
                                   {
                                        start: { type: Date },
                                        end: { type: Date },
                                   },
                                   { _id: false }
                              ),
                         },
                         value: { type: Number },
                    },
                    { _id: false }
               ),
          },
          category: {
               type: String,
               enum: categories,
          },
          subCategory: { type: String, enum: subcategories },
          specification: {
               type: new Schema(
                    {
                         color: [{ type: String }],
                         size: [{ type: String }],
                    },
                    { _id: false }
               ),
          },
          delivery: {
               enabled: { type: Boolean },
               options: [
                    {
                         type: new Schema(
                              {
                                   name: { type: String },
                                   type: { type: String, enum: ["own", "third_party"] },
                                   places: [{ type: String, maxlength: 4, minlength: 4 }],
                                   price: { type: Number },
                              },
                              { _id: false }
                         ),
                    },
               ],
          },
          businessId: {
               type: Schema.Types.ObjectId,
               ref: "business",
               required: false,
               autopopulate: false,
          },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

ProductSchema.methods.getHome = function () {
     const product = this.toObject();
     delete product.counter;
     delete product.updatedAt;
     delete product.createdAt;
     delete product.__v;
     return product;
};

module.exports = mongoose.model("Product", ProductSchema);
