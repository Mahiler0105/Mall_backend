const moment = require("moment-timezone");
const departments = require("../lib/ubigeos/departamentos.json");
const provinces = require("../lib/ubigeos/provincias.json");

const plans = {
     basic10: {
          description: "BUSINESS RUC 10 BASIC PREMIUM",
          picture_url: "600cb509428833000ebd7a37/products/5fee02e083a3ef000e10ba37/323b7c5d-7f97-4dfe-a357-8244dafebddb.jpeg",
          title: "BASIC10",
          // unit_price: 9.99,
          unit_price: 0.99,
     },
     basic20: {
          description: "BUSINESS RUC 20 BASIC PREMIUM",
          picture_url: "600cb509428833000ebd7a37/products/5fee02e083a3ef000e10ba37/323b7c5d-7f97-4dfe-a357-8244dafebddb.jpeg",
          title: "BASIC20",
          unit_price: 0.99,
          // unit_price: 14.99,
     },
     platinum10: {
          description: "BUSINESS RUC 10 PLATINUM PREMIUM",
          picture_url: "600cb509428833000ebd7a37/products/5fee02e083a3ef000e10ba37/323b7c5d-7f97-4dfe-a357-8244dafebddb.jpeg",
          title: "PLATINUM10",
          unit_price: 0.99,
          // unit_price: 14.99,
     },
     platinum20: {
          description: "BUSINESS RUC 20 PLATINUM PREMIUM",
          picture_url: "600cb509428833000ebd7a37/products/5fee02e083a3ef000e10ba37/323b7c5d-7f97-4dfe-a357-8244dafebddb.jpeg",
          title: "PLATINUM20",
          unit_price: 0.99,
          // unit_price: 19.99,
     },
     // basic10: 9.99,
     // basic20: 14.99,
     // platinum10: 14.99,
     // platinum20: 19.99,
};

module.exports.createPreference = function ({ items, user }, shipment) {
     const {
          first_lname: fname,
          second_lname: sname,
          name,
          phone,
          email,
          documents: {
               active: { doc_number, doc_type },
          },
          address: { department, province, exact_address, zip_code },
     } = user;
     var _ship = {};
     if (shipment)
          _ship = {
               shipments: {
                    mode: "not_specified",
                    cost: 1.0,
                    free_shipping: false,
                    receiver_address: {
                         city_name: provinces[department][province].nombre_ubigeo, //province
                         state_name: departments[department].nombre_ubigeo, //department
                         zip_code: zip_code,
                         street_name: exact_address, //exact address
                         // street_number: 33, //
                    },
               },
          };

     return {
          items,
          payer: {
               email,
               name,
               surname: "".concat(fname, " ", sname),
               phone: {
                    area_code: "51",
                    number: Number(phone),
               },
               identification: {
                    type: doc_type,
                    number: doc_number,
               },
               address: {
                    zip_code: zip_code,
                    street_name: exact_address,
               },
               // date_created: "2020-01-01",
          },
          payment_methods: {
               excluded_payment_methods: [],
               excluded_payment_types: [],
               installments: 1, //cuotas
               default_installments: 1, //defecto cuotas
          },
          ..._ship,
          back_urls: {
               success: "https://www.lerietmall.net/",
               // pending: "http://localhost:9080/",
               // failure: "http://localhost:9080/",
          },
          statement_descriptor: "LERIT",
          auto_return: "approved",
          expires: true,
          date_of_expiration: moment().tz("America/Lima").add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_from: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_to: moment().tz("America/Lima").add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          // marketplace_fee: 2.0,
     };
};

module.exports.createPayment = function (body) {
     const {
          order: { id: merchant_order_id },
          id: payment_id,
          issuer_id,
          currency_id,
          operation_type,
          payment_type_id,
          payment_method_id,
          description,
          statement_descriptor,
          card: {
               cardholder: { name, identification },
               expiration_month,
               expiration_year,
               first_six_digits,
               last_four_digits,
          },
          date_approved,
          date_created,
          date_last_updated,
          refunds,
          installments,
          coupon_amount,
          shipping_amount,
          taxes_amount,
          transaction_amount,
          transaction_amount_refunded,
          transaction_details: { installment_amount, net_received_amount, overpaid_amount, total_paid_amount },
          status: mp_status,
          additional_info: { ip_address },
          payer: { id: payer_id, type: payer_type },
     } = body;

     if (!merchant_order_id) {
          const error = new Error();
          error.status = 400;
          error.message = "Payment without order emmited";
          throw error;
     }
     return {
          merchant_order_id,
          payment: {
               payment_id,
               merchant_order_id,
               issuer_id,
               currency_id,
               operation_type,
               payment_type_id,
               payment_method_id,
               description,
               statement_descriptor,
               card: {
                    identification,
                    name,
                    expiration_month,
                    expiration_year,
                    first_six_digits,
                    last_four_digits,
               },
               date: { date_approved, date_created, date_last_updated },
               refunds,
               amounts: {
                    installments,
                    coupon_amount,
                    shipping_amount,
                    taxes_amount,
                    transaction_amount,
                    transaction_amount_refunded,
                    // fee_amount,
                    installment_amount,
                    net_received_amount,
                    overpaid_amount,
                    total_paid_amount,
               },
               status: {
                    lerit_status: "offered",
                    mp_status,
               },
               additional_info: {
                    ip_address,
                    payer: {
                         id: payer_id,
                         type: !!payer_type ? payer_type : "guest",
                    },
               },
          },
     };
};

module.exports.businessToCustomer = function (business) {
     const { name, phone, email, ruc: doc_number, businessType } = business;
     return {
          first_lname: `RUC_${businessType}0`,
          second_lname: "",
          name,
          phone,
          email,
          documents: {
               active: { doc_number: String(doc_number), doc_type: "RUC" },
          },
          address: { department: null, province: null, exact_address: "", zip_code: "" },
     };
};

module.exports.createPlan = function (business) {
     const { plan } = business;

     const { description, picture_url, title, unit_price } = plans[plan];
     return [
          {
               id: plan,
               quantity: 1,
               description,
               picture_url: `https://storage.googleapis.com/lerietmall-302923/${picture_url}`,
               title,
               unit_price,
               category_id: `PREMIUM.PLANS.${"".concat(plan).toUpperCase()}`,
               currency_id: "USD",
          },
     ];
};

module.exports.createMembership = function (business, free_initial = false, last_preference_id = "") {
     const { plan, ruc, _id: idBusiness } = business;
     const { unit_price: amount } = plans[plan];
     return {
          idBusiness,
          ruc,
          amount,
          frecuency: { value: 1, unit: "months" },
          plan,
          renovals: 0,
          current_period: 0,
          free_initial,
          // last_paid: "",
          // next_void: "",
          // must_pay: "",
          last_preference_id,
          authorized: "pending",
          first_paid: false,
     };
};
