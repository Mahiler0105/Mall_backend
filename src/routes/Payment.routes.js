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
    // router.get('/order-c/:id', PaymentController.createOrder); //😁
    router.patch('/order/:id', PaymentController.updateOrder); //😁
    
    router.get('', PaymentController.getAllPayments); //😁
    router.get('/checkout/:id', PaymentController.getPayment); //😁
    router.patch('/checkout/:id', PaymentController.updatePayment); //😁

    router.post('/run/pay', PaymentController.runPay);
    router.post('/run/orders', PaymentController.runOrder);
    // router.get('/run/confirm', Pay   mentController.runConfirm);
    // router.post('/run/payments', PaymentController.runPayments);

    // router.get('/test', PaymentController.test);
    router.post('/ipn', PaymentController.ipnSend);
    router.post('/deleteKeys', PaymentController.deleteKeys);

    return router;
};
