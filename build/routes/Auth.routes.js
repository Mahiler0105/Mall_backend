"use strict";

const {
  Router
} = require('express');

module.exports = function ({
  AuthController
}) {
  const router = Router();
  router.post('/signup/business', AuthController.signUpBusiness); // 😁

  router.post('/signup/customer', AuthController.signUpCustomer); // 😁

  router.post('/oauth/signin', AuthController.signInOauth); // 😁

  router.post('/oauth/confirm', AuthController.confirmOauth); // 😁

  router.post('/validate/:emailUser', AuthController.validateUser);
  router.get('/dni/:dni', AuthController.getDni); // 😁   

  router.get('/ruc/:ruc', AuthController.getRuc); // 😁

  router.post('/forgotpassword/:email', AuthController.forgotPassword); // 😁

  router.get('/validatekey/:userId/:key/:rol', AuthController.validateKey); // 😁

  router.delete('/deletekeys', AuthController.deleteKeys); // 😁

  return router;
};