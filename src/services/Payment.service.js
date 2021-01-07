const Stripe = require("stripe");
const { KEY_STRIPE } = require("../config");

const stripe = new Stripe(KEY_STRIPE);

class PaymentService {
  async getCustomers() {
    try {
      const customers = await stripe.customers.list();
      return customers.data;
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getCustomerById(idCustomer) {
    try {
      return await stripe.customers.retrieve(idCustomer);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async createCustomer(entity) {
    try {
      return await stripe.customers.create({ ...entity });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async updateCustomer(idCustomer, entity) {
    try {
      return await stripe.customers.update(idCustomer, entity);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async deleteCustomer(idCustomer) {
    try {
      return await stripe.customers.del(idCustomer);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getSetUpIntent(idCustomer) {
    try {
      const setUpIntent = await stripe.setupIntents.create({ customer: idCustomer });
      return { client_secret: setUpIntent.client_secret };
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getPaymentMethod(idCustomer) {
    try {
      return await stripe.paymentMethods.retrieve(idCustomer);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getPaymentMethods(idCustomer) {
    try {
      return await stripe.paymentMethods.list({ customer: idCustomer, type: "card" });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async createSubscription(entityCustomer, price) {
    try {
      return await stripe.subscriptions.create({ customer: entityCustomer, items: [{ price }] });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async deletePaymentMethod(idPayment) {
    try {
      return await stripe.paymentMethods.detach(idPayment);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async deleteSubscription(idSubscription) {
    try {
      return await stripe.subscriptions.del(idSubscription);
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getInvoices(id, qty) {
    try {
      return await stripe.invoices.list({ customerId: id, limit: qty });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getNextInvoices(id) {
    try {
      return await stripe.invoices.retrieveUpcoming({ customer: id });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async postPaymentIntent(entity) {
    try {
      return await stripe.paymentIntents.create({ off_session: true, confirm: true, ...entity });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }

  async getPaymentIntent(idPayment) {
    try {
      return await stripe.paymentIntents.list({ customer: idPayment });
    } catch (err) {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }
}

module.exports = PaymentService;
