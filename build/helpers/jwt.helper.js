"use strict";

const {
  sign
} = require('jsonwebtoken');

const {
  JWT_SECRET
} = require('../config');

module.exports.generateToken = function (user) {
  return sign({
    user
  }, JWT_SECRET, {
    expiresIn: '4h'
  });
};

module.exports.decodeToken = function (token) {
  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload.toString());
};