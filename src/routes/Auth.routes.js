const { Router } = require('express');

module.exports = function ({ AuthController }) {
  const router = Router();
  router.post('/signup/business', AuthController.signUpBusiness);
  router.post('/signin/business', AuthController.signInBusiness);
  router.post('/signup/customer', AuthController.signUpCustomer);
  router.post('/signin/customer', AuthController.signInCustomer);
  router.post('/validate/:emailUser', AuthController.validateUser);
  router.get('/dni/:dni', AuthController.getDni);
  router.post('/forgotpassword/:email', AuthController.forgotPassword);
  router.get('/validatekey/:userId/:key', AuthController.validateKey);
  router.delete('/deletekeys', AuthController.deleteKeys);
  return router;
};
