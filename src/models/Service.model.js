const mongoose = require("mongoose");

const { Schema } = mongoose;

const ServiceSchema = new Schema(
     {
          name: { type: String },
          counter: { type: Number, default: 0 },
          price: { type: Number },
          images: [{ type: String }],
          description: { type: String },
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
               enum: ["services"],
               default: "services",
          },
          subCategory: { type: String },
          businessId: {
               type: Schema.Types.ObjectId,
               ref: "business",
               required: false,
               autopopulate: false,
          },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model("Service", ServiceSchema);
