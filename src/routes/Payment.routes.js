const { Router } = require("express");

module.exports = function ({ PaymentController }) {
  const router = Router();
  router.get("/customers", PaymentController.getCustomers); // 😁
  router.get("/customer/:id", PaymentController.getCustomerById); // 😁
  router.post("/customer", PaymentController.createCustomer);
  router.patch("/customer/:id", PaymentController.updateCustomer);
  router.delete("/customer/:id", PaymentController.deleteCustomer);

  router.get("/setupintent/:id", PaymentController.getSetUpIntent);
  router.get("/paymentmethod/:id", PaymentController.getPaymentMethod);
  router.get("/paymentmethods/:id", PaymentController.getPaymentMethods); // 😁
  router.post("/subscription", PaymentController.createSubscription);
  router.delete("/paymentmethod/:id", PaymentController.deletePaymentMethod);
  router.delete("/subscription", PaymentController.deleteSubscription);
  return router;
};
