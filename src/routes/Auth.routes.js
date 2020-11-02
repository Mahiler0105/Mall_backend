const { Router } = require("express");

module.exports = function ({ AuthController }) {
  const router = Router();
  router.post("/signup/business", AuthController.signUpBusiness);
  router.post("/signin/business", AuthController.signInBusiness);
  router.post("/signup/customer", AuthController.signUpCustomer);
  router.post("/signin/customer", AuthController.signInCustomer);
  router.get("/dni/:dni", AuthController.getDni);
  return router;
};
