const { Router } = require("express");

module.exports = function ({ BusinessController }) {
  const router = Router();
  router.get("", BusinessController.getAll);
  router.get("/:businessId", BusinessController.get);
  router.patch("/:businessId", BusinessController.update);
  router.delete("/:businessId", BusinessController.delete);
  return router;
};
