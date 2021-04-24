const moment = require("moment");
const departments = require("../lib/ubigeos/departamentos.json")
const provinces = require("../lib/ubigeos/provincias.json")
module.exports.createPreference = function ({items, user}) {
     const {
          first_lname: fname,
          second_lname: sname,
          name,
          phone,
          email,
          document: { doc_number, doc_type },
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
               cost: 15.0,
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
               success: "http://localhost:9080/",
               pending: "http://localhost:9080/",
               failure: "http://localhost:9080/",
          },
          statement_descriptor: "LERIT",
          auto_return: "approved",
          expires: true,
          date_of_expiration: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_from: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          expiration_date_to: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          marketplace_fee: 2.0,
     };
};
