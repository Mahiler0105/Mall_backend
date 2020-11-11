const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String },
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
    category: { type: String },
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
      ref: 'business',
      required: false,
      autopopulate: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

module.exports = mongoose.model('Product', ProductSchema);
