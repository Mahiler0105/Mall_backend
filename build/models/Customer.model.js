"use strict";

const mongoose = require('mongoose');

const {
  compareSync,
  genSaltSync,
  hashSync
} = require('bcryptjs');

const {
  Schema
} = mongoose;

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const CustomerSchema = new Schema({
  name: {
    type: String
  },
  urlReset: {
    url: {
      type: String,
      default: ''
    },
    created: {
      type: Date,
      default: new Date()
    }
  },
  codeVerification: {
    code: {
      type: String,
      default: ''
    },
    created: {
      type: Date,
      default: new Date()
    }
  },
  language: {
    type: String
  },
  currency: {
    type: String,
    enum: ['PEN', 'USD']
  },
  avatar: {
    type: String
  },
  first_lname: {
    type: String
  },
  second_lname: {
    type: String
  },
  birthdate: {
    type: String
  },
  sex: {
    type: Boolean
  },
  phone: {
    type: String,
    maxlength: 9,
    minlength: 9
  },
  email: {
    type: String,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  address: {
    latitude: {
      type: String,
      default: ''
    },
    longitude: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    },
    province: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    exact_address: {
      type: String,
      default: ''
    }
  },
  stripeId: {
    type: String
  },
  cards: [{
    _id: false,
    last4: {
      type: String,
      maxlength: 4,
      minlength: 4
    },
    brand: {
      type: String
    },
    paymentMethodId: {
      type: String
    },
    default: {
      type: Boolean
    }
  }],
  cart: [{
    type: new Schema({
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: false,
        autopopulate: false
      },
      quantity: {
        type: Number
      },
      specifications: {
        color: {
          type: String
        },
        size: {
          type: String
        }
      }
    }, {
      _id: false
    })
  }],
  preferences: [{
    type: String
  }],
  disabled: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
});

CustomerSchema.methods.toJSON = function () {
  const customer = this.toObject();
  delete customer.password;
  delete customer.disabled;
  delete customer.billing;
  return customer;
};

CustomerSchema.methods.comparePasswords = function (pass) {
  return compareSync(pass, this.password);
};

CustomerSchema.pre('findOneAndUpdate', async function (next) {
  const customer = this;

  if (customer._update && customer._update.password) {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(customer._update.password, salt);
    customer._update.password = hashedPassword;
    next();
  }

  next();
});
module.exports = mongoose.model('Customer', CustomerSchema);