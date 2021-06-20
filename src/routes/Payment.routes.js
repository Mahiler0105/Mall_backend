const { Router } = require('express');

module.exports = function ({ PaymentController }) {
    const router = Router();
    // router.get('/customers', PaymentController.getCustomers); // 😁
    // router.get('/customer/:id', PaymentController.getCustomerById); // 😁
    // router.post('/customer', PaymentController.createCustomer);
    // router.patch('/customer/:id', PaymentController.updateCustomer);
    // router.delete('/customer/:id', PaymentController.deleteCustomer);

    // router.get('/setupintent/:id', PaymentController.getSetUpIntent); // 😁
    // router.get('/paymentmethod/:id', PaymentController.getPaymentMethod); // 😁
    // router.get('/paymentmethods/:id', PaymentController.getPaymentMethods); // 😁
    // router.post('/subscription', PaymentController.createSubscription);
    // router.delete('/paymentmethod/:id', PaymentController.deletePaymentMethod);
    // router.delete('/subscription/:id', PaymentController.deleteSubscription);

    // router.get('/invoices/:id/:qty', PaymentController.getInvoices);
    // router.get('/next/invoices/:id', PaymentController.getNextInvoices);

    // router.post('/paymentintent', PaymentController.postPaymentIntent);
    // router.get('/paymentintent/:id', PaymentController.getPaymentIntent);
    // router.get('/connected/', PaymentController.createConnected);
    // router.get('/link/', PaymentController.createOboard);

    router.get('/customers', PaymentController.getAllCustomers); //😁
    router.get('/customer/:id', PaymentController.getCustomer); //😁
    router.post('/customers/search', PaymentController.searchCustomers); // 😁
    router.post('/customer', PaymentController.createCustomer); // 😁
    router.patch('/customer/:id', PaymentController.updateCustomer); //😁
    router.delete('/customer/:id', PaymentController.deleteCustomer); //😁

    router.get('/preference/:id', PaymentController.getPreference); //😁
    router.get('/preference', PaymentController.createPreference); //😁
    router.patch('/preference/:id', PaymentController.updatePreference); //😁
    
    router.get('/order/:id', PaymentController.getOrder); //😁
    router.patch('/order/:id', PaymentController.updateOrder); //😁
    
    router.get('', PaymentController.getAllPayments); //😁
    router.get('/checkout/:id', PaymentController.getPayment); //😁
    router.patch('/checkout/:id', PaymentController.updatePayment); //😁

    router.post('/run/pay', PaymentController.runPay);
    router.post('/run/orders', PaymentController.runOrder);
    router.post('/run/payments', PaymentController.runPayment);
    
    router.post('/instant-lerit', PaymentController.ipnSend);
    router.delete('/deletekeys', PaymentController.deleteKeys);
    
    router.get('/test', PaymentController.test);
    router.post('/after', PaymentController.afterPay);
    router.post('/coupon', PaymentController.applyCoupon);
    // Subscriptions are not available for this country yet
    // router.get('/subscription', PaymentController.createSubscription); //😁
    // router.get('/subscription/:id', PaymentController.getSubscription); //😁

    return router;
};
