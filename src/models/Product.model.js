const mongoose = require("mongoose");

const { Schema } = mongoose;

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
              { _id: false },
            ),
          },
          value: { type: Number },
        },
        { _id: false },
      ),
    },
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
    subCategory: { type: String },
    specification: {
      type: new Schema(
        {
          color: [{ type: String }],
          size: [{ type: String }],
        },
        { _id: false },
      ),
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
      required: false,
      autopopulate: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
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
