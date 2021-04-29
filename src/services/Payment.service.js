import Stripe from "stripe";
import mercadopago from "mercadopago";
import { Payment } from "../helpers";
import moment from "moment";
// const { KEY_STRIPE } = require("../config");

mercadopago.configure({
     // access_token: "APP_USR-8398124184745252-041616-29814031a220e54f1bdc59dfdbfde955-744446817",
     access_token: "TEST-8398124184745252-041616-ddb78f859cd70097f67d201c3e567f3a-744446817",
});

// const stripe = new Stripe(KEY_STRIPE);
const entity = {
     cart: {
          details: {
               currency: "USD",
          },
          items: [
               {
                    id: "5fc8789498a6164095b22def",
                    imagen: "600cb509428833000ebd7a37/products/5fc8789498a6164095b22def/10a925bd-1b31-4de0-8352-4966b61de870.jpeg",
                    article: "RGB KEYBOARD",
                    description: "Teclado Gamer",
                    price: 10.0,
                    quantity: 1,
                    category: "computer_technology",
               },
          ],
     },
     user: {
          email: "oleic.tefa@gmail.com",
          name: "Benjamin Andre",
          surname: "Valdivia Navarrete",
          phone: {
               area_code: "51",
               number: 999999999,
               // extension:""
          },
          identification: {
               type: "DNI",
               number: "71116845",
          },
          address: {
               zip_code: "04013",
               street_name: "Tahuaycani",
               street_number: 33,
               // id: "",
          },
          date_created: "2020-01-01",
     },
};
const items = entity.cart.items.reduce((obj, item) => {
     const { id, imagen, article, price, quantity, description, category } = item;
     const itm = {
          id,
          quantity,
          description,
          picture_url: `https://storage.googleapis.com/lerietmall-302923/${imagen}`,
          title: article,
          unit_price: price,
          category_id: category,
          currency_id: entity.cart.details.currency,
     };
     return obj.concat([itm]);
}, []);

let _businessRepository = null;
let _customerRepository = null;
let _purchaseRepository = null;
let _orderRepository = null;
let _productService = null;
class PaymentService {
     constructor({ BusinessRepository, CustomerRepository, ProductService, OrderRepository, PurchaseRepository }) {
          _businessRepository = BusinessRepository;
          _customerRepository = CustomerRepository;
          _productService = ProductService;
          _purchaseRepository = PurchaseRepository;
          _orderRepository = OrderRepository;
     }

     // async getCustomers() {
     //      try {
     //           const customers = await stripe.customers.list();
     //           return customers.data;
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getCustomerById(idCustomer) {
     //      try {
     //           return await stripe.customers.retrieve(idCustomer);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // // async createCustomer(entity) {
     // //      try {
     // //           return await stripe.customers.create({ ...entity });
     // //      } catch (err) {
     // //           const error = new Error(err.message);
     // //           error.status = 500;
     // //           throw error;
     // //      }
     // // }

     // async updateCustomer(idCustomer, entity) {
     //      try {
     //           return await stripe.customers.update(idCustomer, entity);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async deleteCustomer(idCustomer) {
     //      try {
     //           return await stripe.customers.del(idCustomer);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getSetUpIntent(idCustomer) {
     //      try {
     //           const setUpIntent = await stripe.setupIntents.create({ customer: idCustomer });
     //           return { client_secret: setUpIntent.client_secret };
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getPaymentMethod(idCustomer) {
     //      try {
     //           return await stripe.paymentMethods.retrieve(idCustomer);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getPaymentMethods(idCustomer) {
     //      try {
     //           return await stripe.paymentMethods.list({ customer: idCustomer, type: "card" });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async createSubscription(entityCustomer, price) {
     //      try {
     //           return await stripe.subscriptions.create({ customer: entityCustomer, items: [{ price }] });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async deletePaymentMethod(idPayment) {
     //      try {
     //           return await stripe.paymentMethods.detach(idPayment);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async deleteSubscription(idSubscription) {
     //      try {
     //           return await stripe.subscriptions.del(idSubscription);
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getInvoices(id, qty) {
     //      try {
     //           return await stripe.invoices.list({ customerId: id, limit: qty });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getNextInvoices(id) {
     //      try {
     //           return await stripe.invoices.retrieveUpcoming({ customer: id });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async postPaymentIntent(entity) {
     //      try {
     //           return await stripe.paymentIntents.create({ off_session: true, confirm: true, ...entity });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     // async getPaymentIntent(idPayment) {
     //      try {
     //           return await stripe.paymentIntents.list({ customer: idPayment });
     //      } catch (err) {
     //           const error = new Error(err.message);
     //           error.status = 500;
     //           throw error;
     //      }
     // }

     async mercadoPago(entity) {
          // {
          //      "access_token": "TEST-8398124184745252-042320-7de045556d0597ecb4d65966b6f6a244-378130203",
          //      "token_type": "bearer",
          //      "expires_in": 15552000,
          //      "scope": "offline_access payments read write",
          //      "user_id": 378130203,
          //      "refresh_token": "TG-6083316318886000075723de-378130203",
          //      "public_key": "TEST-8eba132c-4bb6-43ce-947a-38dd088f670b",
          //      "live_mode": false
          //  }

          // {"access_token":"TEST-1063804438479518-040401-e9d75cb6094774e9d932fc874d137a22-738204784","token_type":"bearer","expires_in":15552000,"scope":"offline_access read write","user_id":738204784,"refresh_token":"TG-60691bf952841f00070fbeec-738204784","public_key":"TEST-384be34a-8435-4429-b164-df44ec3e62b8","live_mode":false}%
          // MARKETPLACE
          // {"id":738226137,"nickname":"TEST3SAEPQV5","password":"qatest2880","site_status":"active","email":"test_user_27827270@testuser.com"}%
          // COMPRADOR
          // {"id":738220650,"nickname":"TESTCXL0TXFS","password":"qatest9173","site_status":"active","email":"test_user_35496531@testuser.com"}
          // NEGOCIO
          // { id: 738204784, nickname: 'TESTYNJIDQAS', password: 'qatest5128', site_status: 'active', email: 'test_user_50527167@testuser.com' };

          // console.log(entity.cart);

          // console.log(entity.user);

          const items = entity.cart.reduce((obj, item) => {
               // const {
               //     details: { imagen, article },
               // } = item;
               // const itm = {
               //     title: article,
               //     picture_url: `https://storage.googleapis.com/lerietmall-302923/${imagen}`,
               //     quantity: 1,
               //     unit_price: 0.5,
               // };
               const {
                    details: { imagen, article, price, quantity },
               } = item;
               const itm = {
                    title: article,
                    picture_url: `https://storage.googleapis.com/lerietmall-302923/${imagen}`,
                    quantity,
                    unit_price: price,
               };
               return obj.concat([itm]);
          }, []);

          // "payer": {
          //     "phone": {},
          //     "identification": {},
          //     "address": {}
          //   },

          // success

          // return true;
          const preference = {
               items,
               payer: {
                    email: entity.user.email,
               },
               back_urls: {
                    success: "http://localhost:8091/",
                    failure: "http://localhost:8091/",
               },
               auto_return: "approved",
               payment_methods: {
                    excluded_payment_types: [
                         {
                              id: "ticket",
                         },
                         {
                              id: "atm",
                         },
                    ],
                    installments: 1,
               },
               statement_descriptor: "Lerietmall",
          };
          try {
               const response = await mercadopago.preferences.create(preference);
               console.log(response);
               return response;
          } catch (err) {
               console.log(err);
          }
     }
     async createUserMP() {
          // 745714048-lYWJlNzGnqtbY8
          try {
               // const response = await mercadopago.customers.update({id:"745714048-lYWJlNzGnqtbY8",def
               //     default_card: '00389801314394792244',
               // });
               const response = await mercadopago.customers.create({
                    email: "oleic.tefa@gmail.com",
                    first_name: "Benjamin Andre",
                    last_name: "Valdivia Navarrete",
                    phone: {
                         area_code: "51",
                         number: "999999999",
                    },
                    identification: {
                         type: "DNI",
                         number: "71116845",
                    },
                    default_address: "Home",
                    //     default_card: '00389801314394792244',
               });
               console.log(response);
               return response;
          } catch (error) {
               console.log(error);
          }
     }

     // async test() {
     //      const {
     //           response: { id },
     //      } = await this.createPreference();
     //      console.log(id);
     //      return this.createOrder(id);
     // }
     async test() {
          return this.getOrder();
          // return this.createPreference()
     }
     async handleError(err, retries, next) {
          if (err.status === 429 && retries < 10) return next();
          const error = new Error(err.message);
          error.status = err.status;
          throw error;
     }
     //CUSTOMERS
     async createCustomer(entity, retries = 0) {
          // 378130203-4nj24WPLXsnOUK
          entity = {
               email: "oleic.tefa@gmail.com",
               first_name: "Benjamin Andre",
               last_name: "Valdivia Navarrete",
               phone: {
                    area_code: "51",
                    number: "999999999",
                    // extension:""
               },
               identification: {
                    type: "DNI",
                    number: "71116845",
               },
               default_address: "Home",
               description: "LerietMall-customer",
               //     default_card: '00389801314394792244',
               // address: {
               //      zip_code: "",
               //      street_name: "",
               //      street_number: "",
               //      id: "",
               // },
               // date_registered: "",
               // metadata: {},
          };
          try {
               return await mercadopago.customers.create(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.createCustomer(entity, retries++));
          }
     }
     async searchCustomers(entity, retries = 0) {
          entity = {
               email: "oleic.tefa@gmail.com",
               // first_name: "Benjamin Andre",
               // last_name: "Valdivia Navarrete",
               // identification: "",
               // description: "",
          };
          try {
               return await mercadopago.customers.search(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.searchCustomers(entity, retries++));
          }
     }
     async getAllCustomers(retries = 0) {
          let entity = {
               description: "LerietMall-customer",
          };
          try {
               return await mercadopago.customers.search(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.getAllCustomers(retries++));
          }
     }
     async getCustomer(entity, retries = 0) {
          entity = "745714048-nLB8grHpnOXKSo";
          try {
               return await mercadopago.customers.get(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.getCustomer(entity, retries++));
          }
     }
     async updateCustomer(entity, retries = 0) {
          entity = {
               id: "745714048-nLB8grHpnOXKSo",
               first_name: "Benja",
               // last_name: "",
               // phone: "",
               // identification: {
               //      type: "DNI",
               //      number: "71116845",
               // },
               // default_address: "",
               // address: {
               //      zip_code: "",
               //      street_name: "",
               //      street_number: "",
               //      id: "",
               // },
               // date_registered: "",
               description: "LerietMall-customer",
               // metadata: {},
               // default_card: "",
          };
          try {
               return await mercadopago.customers.update(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.updateCustomer(entity, retries++));
          }
     }
     async deleteCustomer(entity, retries = 0) {
          // 378130203-4nj24WPLXsnOUK
          entity = "745714048-nLB8grHpnOXKSo";
          try {
               return await mercadopago.customers.remove(entity);
          } catch (err) {
               return this.handleError(err, retries, async () => await this.deleteCustomer(entity, retries++));
          }
     }
     //PREFERENCES
     async createPreference(preference) {
          // const preference = {
          //      items,
          //      payer: entity.user,
          //      payment_methods: {
          //           excluded_payment_methods: [], //"visa","debvisa","pagoefectivo_atm","amex","master","debmaster","diners","medioTest",
          //           excluded_payment_types: [
          //                // {
          //                //      id: "ticket",  //pago efectivo en agentes
          //                // },
          //                // {
          //                //      id: "atm", //banca por internet
          //                //debit_card, credit_card
          //                // },
          //           ],
          //           // default_payment_method_id: "visa",
          //           installments: 1, //cuotas
          //           default_installments: 1, //defecto cuotas
          //      },
          //      shipments: {
          //           mode: "not_specified",
          //           cost: 15.0,
          //           free_shipping: false,
          //           receiver_address: {
          //                city_name: "Arequipa", //province
          //                state_name: "Arequipa", //department
          //                zip_code: "04013",
          //                street_name: "Tahuaycani", //exact address
          //                street_number: 33, //
          //                //   floor?: "",
          //                //   apartment?: "",
          //           },
          //      },
          //      back_urls: {
          //           success: "http://localhost:9080/",
          //           pending: "http://localhost:9080/",
          //           failure: "http://localhost:9080/",
          //      },
          //      statement_descriptor: "LERIT",
          //      // notification_url: "http://localhost:9080/v1/api/payment/ipn",
          //      // additional_info: "",
          //      // external_reference: "",
          //      auto_return: "approved", //or "all"
          //      expires: true,
          //      date_of_expiration: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          //      expiration_date_from: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          //      expiration_date_to: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          //      // marketplace: "MP-MKT-8398124184745252",
          //      marketplace_fee: 1.0,
          //      // tracks: [],
          //      // purpose: "",
          // };
          try {
               return await mercadopago.preferences.create(preference);
          } catch (err) {
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async getPreference(entity) {
          // let entity = "744446817-8c98d379-8c54-4a71-9a8c-238441d04cd7";
          try {
               return await mercadopago.preferences.get(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async updatePreference() {
          let entity = { id: "744446817-8c98d379-8c54-4a71-9a8c-238441d04cd7" };
          try {
               return await mercadopago.preferences.update(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     //MERCHANT_ORDERS
     async createOrder(preference) {
          const order = {
               // preference_id: "744446817-8c98d379-8c54-4a71-9a8c-238441d04cd7",
               preference_id: preference,
               application_id: "8398124184745252",
               site_id: "MLA",
               // payer: { id: "745714048-nLB8grHpnOXKSo", email: "oleic.tefa@gmail.com", nickname: "Benja" },
               payer: entity.user,
               // sponsor_id: 1,
               items,
               // notification_url: "",
               // additional_info: "",
               external_reference: "default",
               marketplace: "MP-MKT-8398124184745252",
          };
          try {
               return await mercadopago.merchant_orders.create(order);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async getOrder(entity) {
          // const id = "2589485666";
          try {
               return await mercadopago.merchant_orders.get(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async updateOrder() {
          let entity = { id: "2589463570", additional_info: "" };
          try {
               return await mercadopago.merchant_orders.update(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     //PAYMENT
     async getAllPayments(entity) {
          entity = {
               description: "LerietMall-payment",
          };
          try {
               return await mercadopago.payment.search(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async getPayment(entity) {
          try {
               return await mercadopago.payment.get(entity);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }
     async updatePayment(payment, entity) {
          const body = {
               id: payment,
               description: "LerietMall-payment",
          };
          try {
               return await mercadopago.payment.update(body);
          } catch (err) {
               console.log(err);
               const error = new Error(err.message);
               error.status = 500;
               throw error;
          }
     }

     //GENERAL PAY, ORDER, PAYMENT
     async runPay(entity) {
          const error = new Error();
          const { id } = entity;
          if (!id) {
               error.status = 400;
               error.message = "ID must be sent";
               throw error;
          }
          delete entity.id;
          if (Object.keys(entity).length > 0) {
               error.status = 400;
               error.message = "Too many parameters";
               throw error;
          }
          const businessExists = await _businessRepository.get(id);
          const customerExists = await _customerRepository.get(id);
          if (!businessExists && !customerExists) {
               error.status = 403;
               error.message = "User does not found";
               throw error;
          }
          if (businessExists) {
               //businesslogic
               return businessExists;
          }
          const { cart, currency: currency_id, _id: idClient } = customerExists;
          if (!cart) {
               error.status = 402;
               error.message = "Invalid cart";
               throw error;
          }
          // const ids = cart.reduce((obj, item) => obj.concat(item.productId), []);
          const { products: ids, details: _d } = cart.reduce(
               (obj, { productId: _pId, quantity, specifications }) => {
                    obj.products.push(_pId);
                    obj.details[_pId] = { quantity, specifications };
                    return obj;
               },
               { products: [], details: {} }
          );
          const _products = await _productService.getProductsById({ ids });
          const { business: orders, items: _items } = Object.keys(_products).reduce(
               (obj, item) => {
                    const {
                         _id: id,
                         name: title,
                         price: unit_price,
                         images,
                         description,
                         category: category_id,
                         available,
                         stock,
                         businessId: business,
                    } = _products[item];
                    if (!available || stock === 0) {
                         error.status = 500;
                         error.message = "Invalid cart by insufficient stock";
                         throw error;
                    }
                    const quantity = _d[id].quantity;
                    const itm = {
                         id,
                         quantity,
                         description,
                         picture_url: `https://storage.googleapis.com/lerietmall-302923/${images[0]}`,
                         title,
                         unit_price,
                         category_id,
                         currency_id,
                    };
                    const specs = _d[id].specifications;
                    var _bus = obj.business[business];
                    if (_bus) _bus.items.push({ ...itm, specification: specs });
                    else
                         _bus = {
                              idClient,
                              idBusiness: business,
                              status: "opened",
                              items: [{ ...itm, specification: specs }],
                         };

                    obj.items.push(itm);
                    obj.business[business] = _bus;
                    return obj;
               },
               { business: {}, items: [] }
          );
          const _preference = await this.createPreference(Payment.createPreference({ items: _items, user: customerExists }));
          const _borders = await Object.keys(orders).reduce(async (obj, item) => {
               const _order = await _orderRepository.create({ ...orders[item], preference_id: _preference.body.id });
               return {
                    ...(await obj),
                    [item]: _order,
               };
          }, {});
          return _preference;
     }
     async runOrder(entity) {
          const error = new Error();
          const { id } = entity;
          if (!id) {
               error.status = 400;
               error.message = "ID must be sent";
               throw error;
          }
          delete entity.id;
          if (Object.keys(entity).length > 0) {
               error.status = 400;
               error.message = "Too many parameters";
               throw error;
          }
          const businessExists = await _businessRepository.get(id);
          const customerExists = await _customerRepository.get(id);
          if (!businessExists && !customerExists) {
               error.status = 403;
               error.message = "User does not found";
               throw error;
          }
          if (businessExists) {
               return _orderRepository.getOrdersByBusinessId(id);
          }
          return _orderRepository.getOrdersByCustomerId(id);
     }
     async ipnSend({ topic, id }) {
          const error = new Error();
          if (!topic || !id) {
               error.status = 400;
               error.message = "Invalid arguments";
               throw error;
          }
          var _mp_payment, _mp_merchant;
          if (topic === "payment") _mp_payment = await this.getPayment(id);
          else if (topic === "merchant_order") _mp_merchant = await this.getOrder(id);
          console.log(_mp_payment);
          console.log(_mp_merchant);

          return true;
          // const _orders = await _orderRepository.getOrdersByPreferenceId(pref);

          // return {
          //      payment: _mp_payment.body,
          //      merchant: _mp_merchant.body,
          //      orders: _orders,
          // };
     }

     // async mercadoPago() {
     //     // {"access_token":"TEST-1063804438479518-040401-e9d75cb6094774e9d932fc874d137a22-738204784","token_type":"bearer","expires_in":15552000,"scope":"offline_access read write","user_id":738204784,"refresh_token":"TG-60691bf952841f00070fbeec-738204784","public_key":"TEST-384be34a-8435-4429-b164-df44ec3e62b8","live_mode":false}%
     //     // MARKETPLACE
     //     // {"id":738226137,"nickname":"TEST3SAEPQV5","password":"qatest2880","site_status":"active","email":"test_user_27827270@testuser.com"}%
     //     // COMPRADOR
     //     // {"id":738220650,"nickname":"TESTCXL0TXFS","password":"qatest9173","site_status":"active","email":"test_user_35496531@testuser.com"}
     //     // NEGOCIO
     //     // { id: 738204784, nickname: 'TESTYNJIDQAS', password: 'qatest5128', site_status: 'active', email: 'test_user_50527167@testuser.com' };

     //     // console.log(entity.cart);

     //     // console.log(entity.user);

     //     // success
     //     const item = {
     //         title: 'EJEMPLO',
     //         quantity: 1,
     //         unit_price: 1,
     //     };
     //     const preference = {
     //         items: [item],
     //         payer: {
     //             email: 'fernando.chullo@ucsm.edu.pe',
     //         },
     //         back_urls: {
     //             success: 'https://www.lerietmall.net',
     //             failure: 'https://www.lerietmall.net',
     //         },
     //         auto_return: 'approved',
     //     };
     //     try {
     //         const response = await mercadopago.preferences.create(preference);
     //         console.log(response);
     //         // mercadopago.customers.create(card)
     //         return response;
     //     } catch (err) {
     //         console.log(err);
     //     }
     // }
}

module.exports = PaymentService;

let a = `http://localhost:9080/?collection_id=1236157008
&collection_status=approved
&payment_id=1236157008
&status=approved
&external_reference=null
&payment_type=credit_card
&merchant_order_id=2589636884
&preference_id=744446817-c21bf717-6b18-4b76-9d68-353060838ad9
&site_id=MPE
&processing_mode=aggregator
&merchant_account_id=null`;

let preference = {
     body: {
          additional_info: "",
          auto_return: "approved",
          back_urls: {
               failure: "http://localhost:8091/",
               pending: "",
               success: "http://localhost:8091/",
          },
          binary_mode: false,
          client_id: "8398124184745252",
          collector_id: 744446817,
          coupon_code: null,
          coupon_labels: null,
          date_created: "2021-04-23T07:44:02.065+00:00",
          date_of_expiration: null,
          expiration_date_from: null,
          expiration_date_to: null,
          expires: false,
          external_reference: "",
          id: "744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          internal_metadata: null,
          items: [
               {
                    id: "",
                    category_id: "",
                    currency_id: "PEN",
                    description: "",
                    picture_url:
                         "https://storage.googleapis.com/lerietmall-302923/https://storage.googleapis.com/lerietmall-302923/600cb509428833000ebd7a37/products/5fc8789498a6164095b22def/10a925bd-1b31-4de0-8352-4966b61de870.jpeg",
                    title: "RGB",
                    quantity: 1,
                    unit_price: 10,
               },
          ],
          marketplace: "MP-MKT-8398124184745252",
          marketplace_fee: 0,
          metadata: {},
          notification_url: null,
          operation_type: "regular_payment",
          payer: {
               phone: {
                    area_code: "",
                    number: "",
               },
               address: {
                    zip_code: "",
                    street_name: "",
                    street_number: null,
               },
               email: "benjy0127@gmail.com",
               identification: {
                    number: "",
                    type: "",
               },
               name: "",
               surname: "",
               date_created: null,
               last_purchase: null,
          },
          payment_methods: {
               default_card_id: null,
               default_payment_method_id: null,
               excluded_payment_methods: [
                    {
                         id: "",
                    },
               ],
               excluded_payment_types: [
                    {
                         id: "ticket",
                    },
                    {
                         id: "atm",
                    },
               ],
               installments: 1,
               default_installments: null,
          },
          processing_modes: null,
          product_id: null,
          redirect_urls: {
               failure: "",
               pending: "",
               success: "",
          },
          sandbox_init_point: "https://sandbox.mercadopago.com.pe/checkout/v1/redirect?pref_id=744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          site_id: "MPE",
          shipments: {
               default_shipping_method: null,
               receiver_address: {
                    zip_code: "",
                    street_name: "",
                    street_number: null,
                    floor: "",
                    apartment: "",
                    city_name: null,
                    state_name: null,
                    country_name: null,
               },
          },
          statement_descriptor: "Lerietmall",
          total_amount: null,
          last_updated: null,
     },
     response: {
          additional_info: "",
          auto_return: "approved",
          back_urls: {
               failure: "http://localhost:8091/",
               pending: "",
               success: "http://localhost:8091/",
          },
          binary_mode: false,
          client_id: "8398124184745252",
          collector_id: 744446817,
          coupon_code: null,
          coupon_labels: null,
          date_created: "2021-04-23T07:44:02.065+00:00",
          date_of_expiration: null,
          expiration_date_from: null,
          expiration_date_to: null,
          expires: false,
          external_reference: "",
          id: "744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          init_point: "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          internal_metadata: null,
          items: [
               {
                    id: "",
                    category_id: "",
                    currency_id: "PEN",
                    description: "",
                    picture_url:
                         "https://storage.googleapis.com/lerietmall-302923/https://storage.googleapis.com/lerietmall-302923/600cb509428833000ebd7a37/products/5fc8789498a6164095b22def/10a925bd-1b31-4de0-8352-4966b61de870.jpeg",
                    title: "RGB",
                    quantity: 1,
                    unit_price: 10,
               },
          ],
          marketplace: "MP-MKT-8398124184745252",
          marketplace_fee: 0,
          metadata: {},
          notification_url: null,
          operation_type: "regular_payment",
          payer: {
               phone: {
                    area_code: "",
                    number: "",
               },
               address: {
                    zip_code: "",
                    street_name: "",
                    street_number: null,
               },
               email: "benjy0127@gmail.com",
               identification: {
                    number: "",
                    type: "",
               },
               name: "",
               surname: "",
               date_created: null,
               last_purchase: null,
          },
          payment_methods: {
               default_card_id: null,
               default_payment_method_id: null,
               excluded_payment_methods: [
                    {
                         id: "",
                    },
               ],
               excluded_payment_types: [
                    {
                         id: "ticket",
                    },
                    {
                         id: "atm",
                    },
               ],
               installments: 1,
               default_installments: null,
          },
          processing_modes: null,
          product_id: null,
          redirect_urls: {
               failure: "",
               pending: "",
               success: "",
          },
          sandbox_init_point: "https://sandbox.mercadopago.com.pe/checkout/v1/redirect?pref_id=744446817-31782985-c747-4a01-8bb0-cc1cdbf00e37",
          site_id: "MPE",
          shipments: {
               default_shipping_method: null,
               receiver_address: {
                    zip_code: "",
                    street_name: "",
                    street_number: null,
                    floor: "",
                    apartment: "",
                    city_name: null,
                    state_name: null,
                    country_name: null,
               },
          },
          statement_descriptor: "Lerietmall",
          total_amount: null,
          last_updated: null,
     },
     status: 201,
};

let customer = {
     body: {
          id: "745714048-nLB8grHpnOXKSo",
          email: "oleic.tefa@gmail.com",
          first_name: "Benjamin Andre",
          last_name: "Valdivia Navarrete",
          phone: {
               area_code: "51",
               number: "999999999",
          },
          identification: {
               type: "DNI",
               number: "71116845",
          },
          address: {
               id: null,
               zip_code: null,
               street_name: null,
               street_number: null,
          },
          date_registered: null,
          description: null,
          date_created: "2021-04-23T12:36:35.131-04:00",
          date_last_updated: null,
          metadata: {
               source_sync: "source_ws",
          },
          default_card: null,
          default_address: null,
          cards: [],
          addresses: [],
          live_mode: false,
     },
     response: {
          id: "745714048-nLB8grHpnOXKSo",
          email: "oleic.tefa@gmail.com",
          first_name: "Benjamin Andre",
          last_name: "Valdivia Navarrete",
          phone: {
               area_code: "51",
               number: "999999999",
          },
          identification: {
               type: "DNI",
               number: "71116845",
          },
          address: {
               id: null,
               zip_code: null,
               street_name: null,
               street_number: null,
          },
          date_registered: null,
          description: null,
          date_created: "2021-04-23T12:36:35.131-04:00",
          date_last_updated: null,
          metadata: {
               source_sync: "source_ws",
          },
          default_card: null,
          default_address: null,
          cards: [],
          addresses: [],
          live_mode: false,
     },
};

let c = {
     id: "visa",
     id: "debvisa",
     id: "pagoefectivo_atm",
     id: "amex",
     id: "master",
     id: "debmaster",
     id: "diners",
     id: "medioTest",
};
// payment_type_id: "credit_card",
// payment_type_id: "debit_card",
// payment_type_id: "atm",
