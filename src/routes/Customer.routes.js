const { Router } = require("express");

module.exports = function ({ CustomerController }) {
  const router = Router();
  router.get("", CustomerController.getAll);
  router.get("/:customerId", CustomerController.get);
  router.patch("/:customerId", CustomerController.update);
  router.delete("/:customerId", CustomerController.delete);
  return router;
};
