import Stripe from "stripe";
import { KEY_STRIPE } from "../config";

const stripe = new Stripe(KEY_STRIPE);

class StripeService {
     constructor(params) {}

     async err(err) {
          var msg;
          if (err.response) msg = err.response.data.message;
          else if (err.request) msg = "Internet Failed Connection";
          else msg = err.message;
          const error = new Error(msg);
          error.status = err.status;
          throw error;
     }
     //ALL CUSTOMERS
     async getCustomers(entity) {
          return await stripe.customers.list(entity).catch(this.err);
     }
     //CUSTOMER BY ID
     async getCustomer(idCustomer) {
          return await stripe.customers.retrieve(idCustomer).catch(this.err);
     }
     //CREATE CUSTOMER
     async createCustomer(entity) {
          return await stripe.customers.create(entity).catch(this.err);
     }
     //UPDATE CUSTOMER
     async updateCustomer(idCustomer, entity) {
          return await stripe.customers.update(idCustomer, entity).catch(this.err);
     }
     //DELETE CUSTOMER
     async deleteCustomer(idCustomer) {
          return await stripe.customers.del(idCustomer).catch(this.err);
     }

     //ALL SETUP INTENTS
     async getSetupIntents(entity = {}) {
          return await stripe.setupIntents.list(entity).catch(this.err);
     }
     //SETUP INTENT BY ID
     async getSetupIntent(idSetti) {
          return await stripe.setupIntents.retrieve(idSetti).catch(this.err);
     }
     //CREATE SETUP INTENT
     async createSetupIntent(entity) {
          //{ customer: idCustomer }
          return await stripe.setupIntents.create(entity).catch(this.err);
     }
     //UPDATE SETUP INTENT
     async updateSetupIntent(idSetti, entity) {
          return await stripe.setupIntents.update(idSetti, entity).catch(this.err);
     }
     //CONFIRM SETUP INTENT
     async confirmSetupIntent(idSetti, entity) {
          return await stripe.setupIntents.confirm(idSetti, entity).catch(this.err);
     }
     //CANCEL SETUP INTENT
     async cancelSetupIntent(idSetti) {
          return await stripe.setupIntents.cancel(idSetti).catch(this.err);
     }

     //ALL PAYMENT INTENTS
     async getPaymentIntents(entity = {}) {
          return await stripe.paymentIntents.list(entity).catch(this.err);
     }
     //PAYMENTS INTENT BY ID
     async getPaymentIntent(idPay) {
          return await stripe.paymentIntents.retrieve(idPay).catch(this.err);
     }
     //CREATE PAYMENT INTENT
     async createPaymentIntent(entity) {
          // { off_session: true, confirm: true, ...entity }
          return await stripe.paymentIntents.create(entity).catch(this.err);
     }
     //UPDATE PAYMENT INTENT
     async updatePaymentIntent(idPay, entity) {
          return await stripe.paymentIntents.update(idPay, entity).catch(this.err);
     }
     //CONFIRM PAYMENT INTENT
     async confirmPaymentIntent(idPay) {
          return await stripe.paymentIntents.confirm(idPay).catch(this.err);
     }
     //CANCEL PAYMENT INTENT
     async cancelPaymentIntent(idPay) {
          return await stripe.paymentIntents.cancel(idPay).catch(this.err);
     }

     //ALL PAYMENT METHODS
     async getPaymentMethods(entity = {}) {
          return await stripe.paymentMethods.list(entity).catch(this.err);
     }
     //PAYMENT METHOD BY ID
     async getPaymentMethod(idPay) {
          return await stripe.paymentMethods.retrieve(idPay).catch(this.err);
     }
     //CREATE PAYMENT METHOD
     async createPaymentMethod(entity) {
          return await stripe.paymentMethods.create(entity).catch(this.err);
     }
     //UPDATE PAYMENT METHODS
     async updatePaymentMethod(idPay, entity) {
          return await stripe.paymentMethods.update(idPay, entity).catch(this.err);
     }
     //ATTACH PAYMENT METHODS
     async attachPaymentMethod(idPay, entity) {
          return await stripe.paymentMethods.attach(idPay, entity).catch(this.err);
     }
     //DETACH PAYMENT METHODS
     async detachPaymentMethod(idPay) {
          return await stripe.paymentMethods.detach(idPay).catch(this.err);
     }

     //ALL SUBSCRIPTIONS
     async getSubscriptions(entity = {}) {
          return await stripe.subscriptions.list(entity).catch(this.err);
     }
     //SUBSCRIPTION BY ID
     async getSubscription(idSubs) {
          return await stripe.subscriptions.retrieve(idSubs).catch(this.err);
     }
     //CREATE SUBSCRIPTION
     async createSubscription(entity) {
          return await stripe.subscriptions.create(entity).catch(this.err);
     }
     //UPDATE SUBSCRIPTION
     async updateSubscription(idSubs, entity) {
          return await stripe.subscriptions.update(idSubs, entity).catch(this.err);
     }
     //DELETE SUBSCRIPTION
     async deleteSubscription(idSubs) {
          return await stripe.subscriptions.del(idSubs).catch(this.err);
     }

     //ALL INVOICES
     async getInvoices(entity = {}) {
          return await stripe.invoices.list(entity).catch(this.err);
     }
     //INVOICE BY ID
     async getInvoice(idInvo) {
          return await stripe.invoices.retrieve(idInvo).catch(this.err);
     }
     //CREATE INVOICE
     async createInvoice(entity) {
          return await stripe.invoices.create(entity).catch(this.err);
     }
     //UPDATE INVOICE
     async updateInvoice(idInvo, entity) {
          return await stripe.invoices.update(idInvo, entity).catch(this.err);
     }
     //DELETE INVOICE
     async deleteInvoice(idInvo) {
          return await stripe.invoices.del(idInvo).catch(this.err);
     }
     //VOID INVOICE
     async voidInvoice(idInvo) {
          return await stripe.invoices.voidInvoice(idInvo).catch(this.err);
     }
     //FINALIZE INVOICE
     async finalizeInvoice(idInvo) {
          return await stripe.invoices.finalizeInvoice(idInvo).catch(this.err);
     }
     //PAY INVOICE
     async payInvoice(idInvo) {
          return await stripe.invoices.pay(idInvo).catch(this.err);
     }
     //UPCOMING INVOICES
     async upcomingInvoice(entity = {}) {
          return await stripe.invoices.retrieveUpcoming(entity).catch(this.err);
     }

     //ALL TAXES
     async getTaxes(entity = {}) {
          return await stripe.taxRates.list(entity).catch(this.err);
     }
     //TAXES BY ID
     async getTax(idTax) {
          return await stripe.taxRates.retrieve(idTax).catch(this.err);
     }
     //CREATE TAX
     async createTax(entity) {
          return await stripe.taxRates.create(entity).catch(this.err);
     }
     //UPDATE TAX
     async updateTax(idTax, entity) {
          return await stripe.taxRates.update(idTax, entity).catch(this.err);
     }

     //ALL PRODUCTS
     async getProducts(entity) {
          return await stripe.products.list(entity).catch(this.err);
     }
     //PRODUCT BY ID
     async getProduct(idProd) {
          return await stripe.products.retrieve(idProd).catch(this.err);
     }
     //CREATE PRODUCT
     async createProduct(entity) {
          return await stripe.products.create(entity).catch(this.err);
     }
     //UPDATE PRODUCT
     async updateProduct(idProd, entity) {
          return await stripe.products.update(idProd, entity).catch(this.err);
     }
     //DELETE PRODUCT
     async deleteProduct(idProd) {
          return await stripe.products.del(idProd).catch(this.err);
     }

     //ALL PRICES
     async getPrices(entity) {
          return await stripe.prices.list(entity).catch(this.err);
     }
     //PRICE BY ID
     async getPrice(idPrice) {
          return await stripe.prices.retrieve(idPrice).catch(this.err);
     }
     //CREATE PRICE
     async createPrice(entity) {
          return await stripe.prices.create(entity).catch(this.err);
     }
     //UPDATE PRICE
     async updatePrice(idPrice, entity) {
          return await stripe.prices.update(idPrice, entity).catch(this.err);
     }

     //ALL COUPONS
     async getCoupons(entity) {
          return await stripe.coupons.list(entity).catch(this.err);
     }
     //COUPON BY ID
     async getCoupon(idCou) {
          return await stripe.coupons.retrieve(idCou).catch(this.err);
     }
     //CREATE COUPON
     async createCoupon(entity) {
          return await stripe.coupons.create(entity).catch(this.err);
     }
     //UPDATE COUPON
     async updateCoupon(idCou, entity) {
          return await stripe.coupons.update(idCou, entity).catch(this.err);
     }
     //DELETE COUPON
     async deleteCoupon(idCou) {
          return await stripe.coupons.del(idCou).catch(this.err);
     }

     //ALL PROMOTION CODES
     async getCodes(entity) {
          return await stripe.promotionCodes.list(entity).catch(this.err);
     }
     //PROMOTION CODE BY ID
     async getCode(idPromo) {
          return await stripe.promotionCodes.retrieve(idPromo).catch(this.err);
     }
     //CREATE PROMOTION CODE
     async createCode(entity) {
          return await stripe.promotionCodes.create(entity).catch(this.err);
     }
     //UPDATE PROMOTION CODE
     async updateCode(idPromo, entity) {
          return await stripe.promotionCodes.update(idPromo, entity).catch(this.err);
     }

     //DELETE DISCOUNT CUSTOMER
     async deleteDiscountC(idCus) {
          return await stripe.customers.deleteDiscount(idCus).catch(this.err);
     }
     //DELETE DISCOUNT SUBSCRIPTION
     async deleteDiscountS(idSubs) {
          return await stripe.subscriptions.deleteDiscount(idSubs).catch(this.err);
     }

     //SPECS
     async getSpecs(entity) {
          return await stripe.countrySpecs.retrieve(entity.country).catch(this.err);
     }


}

module.exports = StripeService;
