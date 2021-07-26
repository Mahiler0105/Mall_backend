const { Router } = require("express");
const { AdminMiddleware } = require("../../middlewares");

module.exports = function ({ AdminController }) {
     const router = Router();
     //CUSTOMERS
     router.post("/customers", [AdminMiddleware], AdminController.getCustomers); // 😁
     router.get("/customer/:id", [AdminMiddleware], AdminController.getCustomer); // 😁
     router.post("/customer", [AdminMiddleware], AdminController.createCustomer); // 😁
     router.patch("/customer/:id", [AdminMiddleware], AdminController.updateCustomer); // 😁
     router.delete("/customer/:id", [AdminMiddleware], AdminController.deleteCustomer); // 😁
     //SETUP INTENTS
     router.post("/setups", [AdminMiddleware], AdminController.getSetupIntents); // 😁
     router.get("/setup/:id", [AdminMiddleware], AdminController.getSetupIntent); // 😁
     router.post("/setup", [AdminMiddleware], AdminController.createSetupIntent); // 😁
     router.post("/setup/confirm/:id", [AdminMiddleware], AdminController.confirmSetupIntent); // 😁
     router.patch("/setup/:id", [AdminMiddleware], AdminController.updateSetupIntent); // 😁
     router.delete("/setup/:id", [AdminMiddleware], AdminController.cancelSetupIntent); // 😁
     //PAYMENT INTENTS
     router.post("/payments", [AdminMiddleware], AdminController.getPaymentIntents); // 😁
     router.get("/payment/:id", [AdminMiddleware], AdminController.getPaymentIntent); // 😁
     router.post("/payment", [AdminMiddleware], AdminController.createPaymentIntent); // 😁
     router.post("/payment/confirm/:id", [AdminMiddleware], AdminController.confirmPaymentIntent); // 😁
     router.patch("/payment/:id", [AdminMiddleware], AdminController.updatePaymentIntent); // 😁
     router.delete("/payment/:id", [AdminMiddleware], AdminController.cancelPaymentIntent); // 😁
     //PAYMENT METHODS
     router.post("/methods", [AdminMiddleware], AdminController.getPaymentMethods); // 😁
     router.get("/method/:id", [AdminMiddleware], AdminController.getPaymentMethod); // 😁
     router.post("/method", [AdminMiddleware], AdminController.createPaymentMethod); // 😁
     router.patch("/method/:id", [AdminMiddleware], AdminController.updatePaymentMethod); // 😁
     router.patch("/method/attach/:id", [AdminMiddleware], AdminController.attachPaymentMethod); // 😁
     router.delete("/method/:id", [AdminMiddleware], AdminController.detachPaymentMethod); // 😁
     //SUBSCRIPTIONS
     router.post("/subscriptions", [AdminMiddleware], AdminController.getSubscriptions); // 😁
     router.get("/subscription/:id", [AdminMiddleware], AdminController.getSubscription); // 😁
     router.post("/subscription", [AdminMiddleware], AdminController.createSubscription); // 😁
     router.patch("/subscription/:id", [AdminMiddleware], AdminController.updateSubscription); // 😁
     router.delete("/subscription/:id", [AdminMiddleware], AdminController.deleteSubscription); // 😁
     //INVOICES
     router.post("/invoices", [AdminMiddleware], AdminController.getInvoices); // 😁
     router.get("/invoice/:id", [AdminMiddleware], AdminController.getInvoice); // 😁
     router.post("/invoice", [AdminMiddleware], AdminController.createInvoice); // 😁
     router.patch("/invoice/:id", [AdminMiddleware], AdminController.updateInvoice); // 😁
     router.delete("/invoice/:id", [AdminMiddleware], AdminController.deleteInvoice); // 😁
     router.post("/invoice/void/:id", [AdminMiddleware], AdminController.voidInvoice); // 😁
     router.post("/invoice/finalize/:id", [AdminMiddleware], AdminController.finalizeInvoice); // 😁
     router.post("/invoice/pay/:id", [AdminMiddleware], AdminController.payInvoice); // 😁
     router.post("/invoice/upcoming", [AdminMiddleware], AdminController.upcomingInvoice); // 😁
     //TAXES
     router.post("/taxes", [AdminMiddleware], AdminController.getTaxes); // 😁
     router.get("/tax/:id", [AdminMiddleware], AdminController.getTax); // 😁
     router.post("/tax", [AdminMiddleware], AdminController.createTax); // 😁
     router.patch("/tax/:id", [AdminMiddleware], AdminController.updateTax); // 😁
     //PRODUCTS
     router.post("/products", [AdminMiddleware], AdminController.getProducts); // 😁
     router.get("/product/:id", [AdminMiddleware], AdminController.getProduct); // 😁
     router.post("/product", [AdminMiddleware], AdminController.createProduct); // 😁
     router.patch("/product/:id", [AdminMiddleware], AdminController.updateProduct); // 😁
     router.delete("/product/:id", [AdminMiddleware], AdminController.deleteProduct); // 😁
     //PRICES
     router.post("/prices", [AdminMiddleware], AdminController.getPrices); // 😁
     router.get("/price/:id", [AdminMiddleware], AdminController.getPrice); // 😁
     router.post("/price", [AdminMiddleware], AdminController.createPrice); // 😁
     router.patch("/price/:id", [AdminMiddleware], AdminController.updatePrice); // 😁
     //COUPONS
     router.post("/coupons", [AdminMiddleware], AdminController.getCoupons); // 😁
     router.get("/coupon/:id", [AdminMiddleware], AdminController.getCoupon); // 😁
     router.post("/coupon", [AdminMiddleware], AdminController.createCoupon); // 😁
     router.patch("/coupon/:id", [AdminMiddleware], AdminController.updateCoupon); // 😁
     router.delete("/coupon/:id", [AdminMiddleware], AdminController.deleteCoupon); // 😁
     //PROMOTION CODES
     router.post("/codes", [AdminMiddleware], AdminController.getCodes); // 😁
     router.get("/code/:id", [AdminMiddleware], AdminController.getCode); // 😁
     router.post("/code", [AdminMiddleware], AdminController.createCode); // 😁
     router.patch("/code/:id", [AdminMiddleware], AdminController.updateCode); // 😁
     //DISCOUNTS
     router.delete("/discount/customer/:id", [AdminMiddleware], AdminController.deleteDiscountC); // 😁
     router.delete("/discount/subscription/:id", [AdminMiddleware], AdminController.deleteDiscountS); // 😁
     
     //SPECS
     router.post("/specs", [AdminMiddleware], AdminController.getSpecs); // 😁
     return router;
};
