const { Router } = require('express');
const { AuthMiddleware } = require('../middlewares');

module.exports = function ({ AuthController }) {
    const router = Router();
    router.post('/signup/business', AuthController.signUpBusiness); // 😁
    router.post('/signup/customer', AuthController.signUpCustomer); // 😁
    router.post('/oauth/signin', AuthController.signInOauth); // 😁
    router.post('/oauth/confirm', AuthController.confirmOauth); // 😁
    router.post('/validate/:emailUser', AuthController.validateUser);
    router.get('/dni/:dni', AuthController.getDni); // 😁
    router.get('/ruc/:ruc', AuthController.getRuc); // 😁
    router.get('/currency', AuthController.getCurrency); // 😁
    // router.get('/currencys', AuthController.updateCurrency); // 😁
    router.post('/forgotpassword/:email', AuthController.forgotPassword); // 😁
    router.post('/verifypasswords/:id', AuthController.verifyPassword); // 😁
    router.post('/changeemail', AuthController.changeEmail); // 😁
    router.post('/verifycodeemail', AuthController.verifyCodeEmail); // 😁
    router.get('/validatekey/:userId/:key/:rol', AuthController.validateKey); // 😁
    router.delete('/deletekeys', AuthController.deleteKeys); // 😁
    router.post('/deactivate/:idUser', [AuthMiddleware], AuthController.deactivate); // 😁
    router.post('/reactivate/:email', AuthController.reactivate); // 😁
    return router;
};
