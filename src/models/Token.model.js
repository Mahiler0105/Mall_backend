const mongoose = require("mongoose");

const { Schema } = mongoose;

const TokenSchema = new Schema(
     {
          token: { type: String },
          document: { type: String },
          type: { type: String, enum: ["ruc", "dni", "currency"], required: true },
     },
     { timestamps: { createdAt: true, updatedAt: true } }
);

TokenSchema.methods.toJSON = function () {
     const model = this.toObject();
     return model;
};

module.exports = mongoose.model("Token", TokenSchema);
