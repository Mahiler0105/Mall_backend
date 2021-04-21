import Stripe from 'stripe';
import mercadopago from 'mercadopago';

const { KEY_STRIPE } = require('../config');

mercadopago.configure({
    access_token: 'APP_USR-8398124184745252-041616-29814031a220e54f1bdc59dfdbfde955-744446817',
    // access_token: 'TEST-8398124184745252-041616-ddb78f859cd70097f67d201c3e567f3a-744446817',
});

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
            return await stripe.paymentMethods.list({ customer: idCustomer, type: 'card' });
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

    async mercadoPago(entity) {
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
                success: 'http://localhost:8091/',
                failure: 'http://localhost:8091/',
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_types: [
                    {
                        id: 'ticket',
                    },
                    {
                        id: 'atm',
                    },
                ],
                installments: 1,
            },
            statement_descriptor: 'Lerietmall',
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
            // const response = await mercadopago.customers.create({
            //     email: 'oleic.tefa@gmail.com',
            //     first_name: 'Fernando Mahiler',
            //     last_name: 'Chullo Mamani',
            //     phone: {
            //         area_code: '51',
            //         number: '945373476',
            //     },
            //     identification: {
            //         type: 'DNI',
            //         number: '72797033',
            //     },
            //     default_address: 'Home',
            //     default_card: '00389801314394792244',
            // });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
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
