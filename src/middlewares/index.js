const { model } = require("mongoose");

module.exports = {
  NotFoundMiddleware: require("./not-fount-middleware"),
  ErrorMiddleware: require("./error.middleware"),
  AuthMiddleware: require("./auth.middleware"),
};
