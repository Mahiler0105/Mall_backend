const { Router } = require("express");
const { AdminMiddleware } = require("../../middlewares");

module.exports = function ({ AdminController }) {
     const router = Router();
     //CUSTOMERS
     router.get("/customer", [AdminMiddleware], AdminController.getCustomers); // 😁
     router.get("/customer/:id", [AdminMiddleware], AdminController.getCustomer); // 😁
     router.post("/customer", [AdminMiddleware], AdminController.createCustomer); // 😁
     router.patch("/customer/:id", [AdminMiddleware], AdminController.updateCustomer); // 😁
     router.delete("/customer/:id", [AdminMiddleware], AdminController.deleteCustomer); // 😁
     //SETUP INTENTS
     router.get("/setup", [AdminMiddleware], AdminController.getSetupIntents); // 😁
     router.get("/setup/:id", [AdminMiddleware], AdminController.getSetupIntent); // 😁
     router.post("/setup", [AdminMiddleware], AdminController.createSetupIntent); // 😁
     router.post("/setup/confirm/:id", [AdminMiddleware], AdminController.confirmSetupIntent); // 😁
     router.patch("/setup/:id", [AdminMiddleware], AdminController.updateSetupIntent); // 😁
     router.delete("/setup/:id", [AdminMiddleware], AdminController.cancelSetupIntent); // 😁
     //PAYMENT INTENTS
     router.get("/payment", [AdminMiddleware], AdminController.getPaymentIntents); // 😁
     router.get("/payment/:id", [AdminMiddleware], AdminController.getPaymentIntent); // 😁
     router.post("/payment", [AdminMiddleware], AdminController.createPaymentIntent); // 😁
     router.post("/payment/confirm/:id", [AdminMiddleware], AdminController.confirmPaymentIntent); // 😁
     router.patch("/payment/:id", [AdminMiddleware], AdminController.updatePaymentIntent); // 😁
     router.delete("/payment/:id", [AdminMiddleware], AdminController.cancelPaymentIntent); // 😁
     //PAYMENT METHODS
     router.get("/method", [AdminMiddleware], AdminController.getPaymentMethods); // 😁
     router.get("/method/:id", [AdminMiddleware], AdminController.getPaymentMethod); // 😁
     router.post("/method", [AdminMiddleware], AdminController.createPaymentMethod); // 😁
     router.patch("/method/:id", [AdminMiddleware], AdminController.updatePaymentMethod); // 😁
     router.patch("/method/attach/:id", [AdminMiddleware], AdminController.attachPaymentMethod); // 😁
     router.delete("/method/:id", [AdminMiddleware], AdminController.detachPaymentMethod); // 😁
     //SUBSCRIPTIONS
     router.get("/subs", [AdminMiddleware], AdminController.getSubscriptions); // 😁
     router.get("/subs/:id", [AdminMiddleware], AdminController.getSubscription); // 😁
     router.post("/subs", [AdminMiddleware], AdminController.createSubscription); // 😁
     router.patch("/subs/:id", [AdminMiddleware], AdminController.updateSubscription); // 😁
     router.delete("/subs/:id", [AdminMiddleware], AdminController.deleteSubscription); // 😁
     //INVOICES
     router.get("/invoice", [AdminMiddleware], AdminController.getInvoices); // 😁
     router.get("/invoice/:id", [AdminMiddleware], AdminController.getInvoice); // 😁
     router.post("/invoice", [AdminMiddleware], AdminController.createInvoice); // 😁
     router.patch("/invoice/:id", [AdminMiddleware], AdminController.updateInvoice); // 😁
     router.delete("/invoice/:id", [AdminMiddleware], AdminController.deleteInvoice); // 😁
     router.post("/invoice/void/:id", [AdminMiddleware], AdminController.voidInvoice); // 😁
     router.post("/invoice/finalize/:id", [AdminMiddleware], AdminController.finalizeInvoice); // 😁
     router.post("/invoice/pay/:id", [AdminMiddleware], AdminController.payInvoice); // 😁
     router.post("/invoice/upcoming", [AdminMiddleware], AdminController.upcomingInvoice); // 😁
     return router;
};
