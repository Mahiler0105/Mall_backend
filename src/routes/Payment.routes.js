const { Router } = require("express");

module.exports = function ({ PaymentController }) {
  const router = Router();
  router.get("/customers", PaymentController.getCustomers); // 😁
  router.get("/customer/:id", PaymentController.getCustomerById); // 😁
  router.post("/customer", PaymentController.createCustomer);
  router.patch("/customer/:id", PaymentController.updateCustomer);
  router.delete("/customer/:id", PaymentController.deleteCustomer);

  router.get("/setupintent/:id", PaymentController.getSetUpIntent); // 😁
  router.get("/paymentmethod/:id", PaymentController.getPaymentMethod); // 😁
  router.get("/paymentmethods/:id", PaymentController.getPaymentMethods); // 😁
  router.post("/subscription", PaymentController.createSubscription);
  router.delete("/paymentmethod/:id", PaymentController.deletePaymentMethod);
  router.delete("/subscription/:id", PaymentController.deleteSubscription);

  router.get("/invoices/:id/:qty", PaymentController.getInvoices);
  router.get("/next/invoices/:id", PaymentController.getNextInvoices);

  router.post("/paymentintent", PaymentController.postPaymentIntent);
  router.get("/paymentintent/:id", PaymentController.getPaymentIntent);

  return router;
};
