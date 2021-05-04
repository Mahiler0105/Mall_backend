const moment = require("moment");
const departments = require("../lib/ubigeos/departamentos.json");
const provinces = require("../lib/ubigeos/provincias.json");
module.exports.createPreference = function ({ items, user }) {
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
          back_urls: {
               success: "http://localhost:9080/v1/api/payment/run/confirm",
               pending: "http://localhost:9080/",
               failure: "http://localhost:9080/",
          },
          statement_descriptor: "LERIT",
          auto_return: "approved",
          expires: true,
          date_of_expiration: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_from: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_to: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
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
