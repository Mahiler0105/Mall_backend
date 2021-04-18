"use strict";

const mongoose = require('mongoose');

const {
  Schema
} = mongoose;
const OrderSchema = new Schema({
  idPurchase: {
    type: Schema.Types.ObjectId,
    ref: 'purchase',
    required: false,
    autopopulate: false
  },
  delivered: {
    typse: Boolean
  },
  date: {
    type: Date
  },
  deliveredPersonName: {
    type: String
  },
  phone: {
    type: String
  },
  dni: {
    type: String
  },
  status: {
    type: String,
    enum: ['0', '1', '2']
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
});
module.exports = mongoose.model('Order', OrderSchema);