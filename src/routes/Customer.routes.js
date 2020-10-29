const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ CustomerController }) {
  const router = Router();
  router.get("", [AuthMiddleware], CustomerController.getAll);
  router.get("/:customerId", [AuthMiddleware], CustomerController.get);
  router.patch("/:customerId", [AuthMiddleware], CustomerController.update);
  router.delete("/:customerId", [AuthMiddleware], CustomerController.delete);
  return router;
};
