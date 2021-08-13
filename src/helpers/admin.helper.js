const apis = {
     RUC: "/sunat",
     DNI: "/reniec",
};
const { ADMIN_URL } = require("../config");

module.exports.API = function (url) {
     const path = apis[url];

     if (ADMIN_URL && path) {
          return ADMIN_URL.concat(path);
     }
     return null;
};
