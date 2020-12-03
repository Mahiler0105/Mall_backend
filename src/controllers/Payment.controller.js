let _paymentService = null;

class PaymentController {
  constructor({ PaymentService }) {
    _paymentService = PaymentService;
  }

  async getCustomers(req, res) {
    const customers = await _paymentService.getCustomers();
    return res.status(200).send(customers);
  }

  async getCustomerById(req, res) {
    const { id } = req.params;
    const customer = await _paymentService.getCustomerById(id);
    return res.status(200).send(customer);
  }

  async createCustomer(req, res) {
    const { body } = req;
    const customerCreated = await _paymentService.createCustomer(body);
    return res.status(200).send(customerCreated);
  }

  async updateCustomer(req, res) {
    const {
      params: { id },
      body,
    } = req;
    const customerUpdated = await _paymentService.updateCustomer(id, body);
    return res.status(200).send(customerUpdated);
  }

  async deleteCustomer(req, res) {
    const { id } = req.params;
    const customerDeleted = await _paymentService.deleteCustomer(id);
    return res.status(200).send(customerDeleted);
  }

  async getSetUpIntent(req, res) {
    const { id } = req.params;
    const setUpIntent = await _paymentService.getSetUpIntent(id);
    return res.status(200).send(setUpIntent);
  }

  async getPaymentMethod(req, res) {
    const { id } = req.params;
    const paymentMethod = await _paymentService.getPaymentMethod(id);
    return res.status(200).send(paymentMethod);
  }

  async getPaymentMethods(req, res) {
    const { id } = req.params;
    const paymentMethods = await _paymentService.getPaymentMethods(id);
    return res.status(200).send(paymentMethods);
  }

  async createSubscription(req, res) {
    const { customer, price } = req.body;
    const suscription = await _paymentService.createSubscription(customer, price);
    return res.status(200).send(suscription);
  }

  async deletePaymentMethod(req, res) {
    const { id } = req.params;
    const paymentMethodsDeleted = await _paymentService.deletePaymentMethod(id);
    return res.status(200).send(paymentMethodsDeleted);
  }

  async deleteSubscription(req, res) {
    const { subscription } = req.body;
    const suscriptionDeleted = await _paymentService.createSubscription(subscription);
    return res.status(200).send(suscriptionDeleted);
  }

  async getInvoices(req, res) {
    const { id, qty } = req.params;
    const invoices = await _paymentService.getInvoices(id, qty);
    return res.status(200).send(invoices);
  }

  async getNextInvoices(req, res) {
    const { id } = req.params;
    const nextInvoices = await _paymentService.getNextInvoices(id);
    return res.status(200).send(nextInvoices);
  }
}

module.exports = PaymentController;
