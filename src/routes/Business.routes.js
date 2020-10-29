const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ BusinessController }) {
  const router = Router();
  router.get("", [AuthMiddleware], BusinessController.getAll);
  router.get("/:businessId", [AuthMiddleware], BusinessController.get);
  router.patch("/:businessId", [AuthMiddleware], BusinessController.update);
  router.delete("/:businessId", [AuthMiddleware], BusinessController.delete);
  return router;
};
