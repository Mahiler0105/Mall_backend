let _stripeService = null;
let _authService = null;

class AdminController {
     constructor({ StripeService, AuthService }) {
          _stripeService = StripeService;
          _authService = AuthService;
     }
     //KEY
     async key(req, res) {
          const { body } = req;
          const result = await _authService.key(body);
          return res.send(result);
     }
     //STRIPE
     async getCustomers(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getCustomers();
          return res.send(result);
     }
     async getCustomers(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getCustomers();
          return res.send(result);
     }
     async getCustomer(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getCustomer(params.id);
          return res.send(result);
     }
     async createCustomer(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createCustomer(body);
          return res.send(result);
     }
     async updateCustomer(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updateCustomer(params.id, body);
          return res.send(result);
     }
     async deleteCustomer(req, res) {
          const { body, params } = req;
          const result = await _stripeService.deleteCustomer(params.id);
          return res.send(result);
     }
     async getSetupIntents(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getSetupIntents();
          return res.send(result);
     }
     async getSetupIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getSetupIntent(params.id);
          return res.send(result);
     }
     async createSetupIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createSetupIntent(body);
          return res.send(result);
     }
     async confirmSetupIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.confirmSetupIntent(params.id);
          return res.send(result);
     }
     async updateSetupIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updateSetupIntent(params.id, body);
          return res.send(result);
     }
     async cancelSetupIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.cancelSetupIntent(params.id);
          return res.send(result);
     }
     async getPaymentIntents(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getPaymentIntents();
          return res.send(result);
     }
     async getPaymentIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getPaymentIntent(params.id);
          return res.send(result);
     }
     async createPaymentIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createPaymentIntent(body);
          return res.send(result);
     }
     async confirmPaymentIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.confirmPaymentIntent(params.id);
          return res.send(result);
     }
     async updatePaymentIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updatePaymentIntent(params.id, body);
          return res.send(result);
     }
     async cancelPaymentIntent(req, res) {
          const { body, params } = req;
          const result = await _stripeService.cancelPaymentIntent(params.id);
          return res.send(result);
     }
     async getPaymentMethods(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getPaymentMethods();
          return res.send(result);
     }
     async getPaymentMethod(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getPaymentMethod(params.id);
          return res.send(result);
     }
     async createPaymentMethod(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createPaymentMethod(body);
          return res.send(result);
     }
     async updatePaymentMethod(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updatePaymentMethod(params.id, body);
          return res.send(result);
     }
     async attachPaymentMethod(req, res) {
          const { body, params } = req;
          const result = await _stripeService.attachPaymentMethod(params.id, body);
          return res.send(result);
     }
     async detachPaymentMethod(req, res) {
          const { body, params } = req;
          const result = await _stripeService.detachPaymentMethod(params.id);
          return res.send(result);
     }
     async getSubscriptions(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getSubscriptions();
          return res.send(result);
     }
     async getSubscription(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getSubscription(params.id);
          return res.send(result);
     }
     async createSubscription(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createSubscription(body);
          return res.send(result);
     }
     async updateSubscription(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updateSubscription(params.id, body);
          return res.send(result);
     }
     async deleteSubscription(req, res) {
          const { body, params } = req;
          const result = await _stripeService.deleteSubscription(params.id);
          return res.send(result);
     }
     async getInvoices(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getInvoices();
          return res.send(result);
     }
     async getInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.getInvoice(params.id);
          return res.send(result);
     }
     async createInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.createInvoice(body);
          return res.send(result);
     }
     async updateInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.updateInvoice(params.id, body);
          return res.send(result);
     }
     async deleteInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.deleteInvoice(params.id);
          return res.send(result);
     }
     async voidInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.voidInvoice(params.id);
          return res.send(result);
     }
     async finalizeInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.finalizeInvoice(params.id);
          return res.send(result);
     }
     async payInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.payInvoice(params.id);
          return res.send(result);
     }
     async upcomingInvoice(req, res) {
          const { body, params } = req;
          const result = await _stripeService.upcomingInvoice(body);
          return res.send(result);
     }
}

module.exports = AdminController;
