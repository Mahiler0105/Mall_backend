"use strict";

let _paymentService = null;

class PaymentController {
  constructor({
    PaymentService
  }) {
    _paymentService = PaymentService;
  } // async getCustomers(_, res) {
  //     const customers = await _paymentService.getCustomers();
  //     return res.status(200).send(customers);
  // }
  // async getCustomerById(req, res) {
  //     const { id } = req.params;
  //     const customer = await _paymentService.getCustomerById(id);
  //     return res.status(200).send(customer);
  // }
  // async createCustomer(req, res) {
  //     const { body } = req;
  //     const customerCreated = await _paymentService.createCustomer(body);
  //     return res.status(200).send(customerCreated);
  // }
  // async updateCustomer(req, res) {
  //     const {
  //         params: { id },
  //         body,
  //     } = req;
  //     const customerUpdated = await _paymentService.updateCustomer(id, body);
  //     return res.status(200).send(customerUpdated);
  // }
  // async deleteCustomer(req, res) {
  //     const { id } = req.params;
  //     const customerDeleted = await _paymentService.deleteCustomer(id);
  //     return res.status(200).send(customerDeleted);
  // }
  // async getSetUpIntent(req, res) {
  //     const { id } = req.params;
  //     const setUpIntent = await _paymentService.getSetUpIntent(id);
  //     return res.status(200).send(setUpIntent);
  // }
  // async getPaymentMethod(req, res) {
  //     const { id } = req.params;
  //     const paymentMethod = await _paymentService.getPaymentMethod(id);
  //     return res.status(200).send(paymentMethod);
  // }
  // async getPaymentMethods(req, res) {
  //     const { id } = req.params;
  //     const paymentMethods = await _paymentService.getPaymentMethods(id);
  //     return res.status(200).send(paymentMethods);
  // }
  // async createSubscription(req, res) {
  //     const { customer, price } = req.body;
  //     const suscription = await _paymentService.createSubscription(customer, price);
  //     return res.status(200).send(suscription);
  // }
  // async deletePaymentMethod(req, res) {
  //     const { id } = req.params;
  //     const paymentMethodsDeleted = await _paymentService.deletePaymentMethod(id);
  //     return res.status(200).send(paymentMethodsDeleted);
  // }
  // async deleteSubscription(req, res) {
  //     const { id } = req.params;
  //     const suscriptionDeleted = await _paymentService.deleteSubscription(id);
  //     return res.status(200).send(suscriptionDeleted);
  // }
  // async getInvoices(req, res) {
  //     const { id, qty } = req.params;
  //     const invoices = await _paymentService.getInvoices(id, qty);
  //     return res.status(200).send(invoices);
  // }
  // async getNextInvoices(req, res) {
  //     const { id } = req.params;
  //     const nextInvoices = await _paymentService.getNextInvoices(id);
  //     return res.status(200).send(nextInvoices);
  // }
  // async postPaymentIntent(req, res) {
  //     const { body } = req;
  //     const postPayment = await _paymentService.postPaymentIntent(body);
  //     return res.status(200).send(postPayment);
  // }
  // async getPaymentIntent(req, res) {
  //     const { id } = req.params;
  //     const getPayment = await _paymentService.getPaymentIntent(id);
  //     return res.status(200).send(getPayment);
  // }
  // async mercadoPago(req, res) {
  //     const { body } = req;
  //     const getPaymentMercadoPago = await _paymentService.mercadoPago(body);
  //     return res.status(200).send(getPaymentMercadoPago);
  // }


  async getAllCustomers(_, res) {
    const result = await _paymentService.getAllCustomers();
    return res.status(200).send(result);
  }

  async getCustomer(req, res) {
    const {
      id
    } = req.params;
    const result = await _paymentService.getCustomer(id);
    return res.status(200).send(result);
  }

  async searchCustomers(req, res) {
    const {
      body
    } = req;
    const result = await _paymentService.searchCustomers(body);
    return res.status(200).send(result);
  }

  async createCustomer(req, res) {
    const {
      body
    } = req;
    const result = await _paymentService.createCustomer(body);
    return res.status(200).send(result);
  }

  async updateCustomer(req, res) {
    const {
      body
    } = req;
    const result = await _paymentService.updateCustomer(body);
    return res.status(200).send(result);
  }

  async deleteCustomer(req, res) {
    const {
      id
    } = req.params;
    const result = await _paymentService.deleteCustomer(id);
    return res.status(200).send(result);
  }

  async getPreference(req, res) {
    const {
      id
    } = req.params;
    const result = await _paymentService.getPreference(id);
    return res.status(200).send(result);
  }

  async createPreference(req, res) {
    const {
      body
    } = req;
    const result = await _paymentService.createPreference(body);
    return res.status(200).send(result);
  }

  async updatePreference(req, res) {
    const {
      body,
      params: {
        id
      }
    } = req;
    const result = await _paymentService.updatePreference(id, body);
    return res.status(200).send(result);
  }

  async getOrder(req, res) {
    const {
      id
    } = req.params;
    const result = await _paymentService.getOrder(id);
    return res.status(200).send(result);
  } //  async createOrder(req, res) {
  //       const { id } = req.params;
  //       const result = await _paymentService.createOrder(id);
  //       return res.status(200).send(result);
  //  }


  async updateOrder(req, res) {
    const {
      body,
      params: {
        id
      }
    } = req;
    const result = await _paymentService.updateOrder(id, body);
    return res.status(200).send(result);
  }

  async getAllPayments(req, res) {
    const result = await _paymentService.getAllPayments();
    return res.status(200).send(result);
  }

  async getPayment(req, res) {
    const {
      id
    } = req.params;
    const result = await _paymentService.getPayment(id);
    return res.status(200).send(result);
  }

  async updatePayment(req, res) {
    const {
      body,
      params: {
        id
      }
    } = req;
    const result = await _paymentService.updatePayment(id, body);
    return res.status(200).send(result);
  }

  async runPay(req, res) {
    const {
      body
    } = req;
    const result = await _paymentService.runPay(body);
    return res.status(200).send(result);
  }

  async ipnSend(req, res) {
    const {
      body
    } = req; //   const getResult = await _paymentService.test(body);

    return res.status(200).send(body);
  }

  async test(req, res) {
    const {
      body
    } = req;
    const getResult = await _paymentService.test(body);
    return res.status(200).send(getResult);
  } // async createUserMP(req, res) {
  //     const userMp = await _paymentService.createUserMP();
  //     return res.status(200).send(userMp);
  // }


}

module.exports = PaymentController;